#!/usr/bin/env python3
"""
deploy_remote.py — Déploie dist/ sur le serveur Debian via SSH/SFTP.
Appelé par deploy.bat avec le mot de passe en argument.

Usage (interne) :
    python deploy_remote.py <password>
"""
import os
import sys
import time
import paramiko

HOST = os.environ.get("REMOTE_HOST")
USER = os.environ.get("REMOTE_USER")
REMOTE_DIR = os.environ.get("REMOTE_DIR")
if not all([HOST, USER, REMOTE_DIR]):
    sys.exit("REMOTE_HOST, REMOTE_USER, REMOTE_DIR are required (see .env.example)")
SERVICE_NAME = "ai-pricing"
LBC_SERVICE_NAME = "lbc-sniper"
LOCAL_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")
LOCAL_LOCK = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".deploy.lock")
REMOTE_LOCK = "/tmp/.vinted_deploy.lock"


def main():
    if len(sys.argv) < 2:
        print("[ERREUR] Mot de passe manquant. Usage : python deploy_remote.py <password>")
        sys.exit(1)

    password = sys.argv[1]

    # Verrou local — empêche deux deploy.bat simultanés
    if os.path.exists(LOCAL_LOCK):
        age = time.time() - os.path.getmtime(LOCAL_LOCK)
        if age < 300:
            print(f"[ERREUR] Un déploiement est déjà en cours (lock âgé de {int(age)}s).")
            sys.exit(1)
        else:
            print(f"  [!] Lock obsolète ({int(age)}s) — supprimé.")
            os.remove(LOCAL_LOCK)

    open(LOCAL_LOCK, "w").write(str(os.getpid()))

    try:
        _deploy(password)
    finally:
        if os.path.exists(LOCAL_LOCK):
            os.remove(LOCAL_LOCK)


def _deploy(password: str) -> None:
    print(f"Connexion à {USER}@{HOST}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=password, timeout=15)

    sftp = client.open_sftp()

    def run(cmd: str, timeout: int = 120) -> str:
        _, stdout, stderr = client.exec_command(cmd)
        chan = stdout.channel
        chan.settimeout(None)  # pas de timeout par recv — on poll manuellement
        deadline = time.time() + timeout
        chunks = []
        while not chan.exit_status_ready():
            if chan.recv_ready():
                data = chan.recv(4096)
                if data:
                    chunks.append(data.decode())
            elif time.time() > deadline:
                print(f"[TIMEOUT] Commande dépassé {timeout}s : {cmd[:80]}")
                break
            else:
                time.sleep(0.5)
        # Lire le reste après exit
        while chan.recv_ready():
            chunks.append(chan.recv(4096).decode())
        out = "".join(chunks).strip()
        err = stderr.read().decode().strip()
        if out:
            print(out)
        if err and "WARNING" not in err and "notice" not in err.lower():
            print("ERR:", err[:300])
        return out

    def mkdir_p(path: str) -> None:
        parts = path.split("/")
        current = ""
        for p in parts:
            if not p:
                current = "/"
                continue
            current = current.rstrip("/") + "/" + p
            try:
                sftp.stat(current)
            except FileNotFoundError:
                sftp.mkdir(current)

    # Verrou distant
    lock_check = run(f"[ -f {REMOTE_LOCK} ] && cat {REMOTE_LOCK} || echo FREE")
    if lock_check != "FREE":
        age = run(f"echo $(($(date +%s) - $(stat -c %Y {REMOTE_LOCK} 2>/dev/null || echo 0)))")
        try:
            age_int = int(age)
        except ValueError:
            age_int = 999
        if age_int < 300:
            print(f"[ERREUR] Déploiement déjà en cours sur le serveur (lock âgé de {age_int}s).")
            client.close()
            sys.exit(1)
        print(f"  [!] Lock distant obsolète ({age_int}s) — supprimé.")
    run(f"echo {os.getpid()} > {REMOTE_LOCK}")

    try:
        _deploy_steps(client, sftp, run, mkdir_p)
    finally:
        run(f"rm -f {REMOTE_LOCK}")

    client.close()
    print("\n=== DÉPLOIEMENT TERMINÉ ===")


def _deploy_steps(client, sftp, run, mkdir_p) -> None:
    # 0. S'assurer que les dossiers distants existent
    run(f"mkdir -p {REMOTE_DIR}/data")

    # 1. Arrêt des services
    print(f"\n[1/4] Arrêt des services {SERVICE_NAME} + {LBC_SERVICE_NAME}...")
    run(f"systemctl stop {SERVICE_NAME} 2>/dev/null || true")
    run(f"systemctl stop {LBC_SERVICE_NAME} 2>/dev/null || true")
    run(f"pkill -9 -f '{REMOTE_DIR}/venv/bin/python {REMOTE_DIR}/main\\.py' 2>/dev/null || true")
    run(f"pkill -9 -f '{REMOTE_DIR}/venv/bin/python {REMOTE_DIR}/lbc_main\\.py' 2>/dev/null || true")
    time.sleep(2)

    # 2. Nettoyage distant (garde venv/ et data/)
    print(f"\n[2/4] Nettoyage de {REMOTE_DIR} (garde venv/ et data/)...")
    run(f"find {REMOTE_DIR} -maxdepth 1 -mindepth 1 -not -name venv -not -name data -exec rm -rf {{}} +")
    remaining = run(f"ls {REMOTE_DIR}")
    print(f"  Restant : {remaining}")

    # 3. Upload dist/
    print("\n[3/4] Upload des fichiers...")
    total = 0
    for root, dirs, files in os.walk(LOCAL_DIST):
        dirs[:] = [d for d in dirs if d not in ("__pycache__",)]
        for fname in files:
            if fname.endswith(".pyc"):
                continue
            local_path = os.path.join(root, fname)
            rel = os.path.relpath(local_path, LOCAL_DIST).replace(os.sep, "/")
            remote_path = REMOTE_DIR + "/" + rel
            mkdir_p("/".join(remote_path.split("/")[:-1]))
            sftp.put(local_path, remote_path)
            total += 1
            print(f"  + {rel}")

    sftp.close()
    print(f"  {total} fichiers uploadés.")

    # 4. Venv + pip install
    print("\n[4/4] Installation des dépendances...")
    venv_ok = run(f"test -f {REMOTE_DIR}/venv/bin/python && echo OK || echo MISSING")
    if "MISSING" in venv_ok:
        print("  [!] venv absent — création...")
        run(f"python3 -m venv {REMOTE_DIR}/venv", timeout=60)
        print("  [OK] venv créé.")
    # Vérifier que pip fonctionne, sinon recréer le venv
    pip_ok = run(f"{REMOTE_DIR}/venv/bin/pip --version 2>/dev/null && echo OK || echo BROKEN")
    if "BROKEN" in pip_ok:
        print("  [!] pip cassé — recréation du venv...")
        run(f"rm -rf {REMOTE_DIR}/venv")
        run(f"python3 -m venv {REMOTE_DIR}/venv", timeout=60)
        print("  [OK] venv recréé.")
    run(f"{REMOTE_DIR}/venv/bin/pip install -r {REMOTE_DIR}/requirements.txt -q", timeout=600)

    # 5. Mise à jour service systemd
    print(f"\n[+] Mise à jour service {SERVICE_NAME}...")
    service_content = f"""[Unit]
Description=AI Pricing
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User={USER}
WorkingDirectory={REMOTE_DIR}
ExecStart={REMOTE_DIR}/venv/bin/python {REMOTE_DIR}/main.py
Restart=on-failure
RestartSec=15
StandardOutput=journal
StandardError=journal
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
"""
    sftp2 = client.open_sftp()
    with sftp2.open(f"/etc/systemd/system/{SERVICE_NAME}.service", "w") as f:
        f.write(service_content)
    sftp2.close()
    # 5b. Service LBC sniper
    print(f"\n[+] Mise à jour service {LBC_SERVICE_NAME}...")
    lbc_service_content = f"""[Unit]
Description=LBC Je Donne Sniper
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User={USER}
WorkingDirectory={REMOTE_DIR}
ExecStart={REMOTE_DIR}/venv/bin/python {REMOTE_DIR}/lbc_main.py
Restart=on-failure
RestartSec=30
StandardOutput=journal
StandardError=journal
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
"""
    sftp3 = client.open_sftp()
    with sftp3.open(f"/etc/systemd/system/{LBC_SERVICE_NAME}.service", "w") as f:
        f.write(lbc_service_content)
    sftp3.close()

    run("systemctl daemon-reload")
    run(f"systemctl enable {SERVICE_NAME}")
    run(f"systemctl enable {LBC_SERVICE_NAME}")
    print("  Services mis à jour et activés.")

    # 6. Démarrage
    print(f"\nDémarrage de {SERVICE_NAME} + {LBC_SERVICE_NAME}...")
    run(f"systemctl start {SERVICE_NAME}")
    run(f"systemctl start {LBC_SERVICE_NAME}")
    time.sleep(4)

    # 7. Statut
    print(f"\n=== Statut {SERVICE_NAME} ===")
    run(f"systemctl is-active {SERVICE_NAME}")
    print(f"\n--- {SERVICE_NAME} (10 dernières lignes) ---")
    run(f"journalctl -u {SERVICE_NAME} -n 10 --no-pager")

    print(f"\n=== Statut {LBC_SERVICE_NAME} ===")
    run(f"systemctl is-active {LBC_SERVICE_NAME}")
    print(f"\n--- {LBC_SERVICE_NAME} (5 dernières lignes) ---")
    run(f"journalctl -u {LBC_SERVICE_NAME} -n 5 --no-pager")


if __name__ == "__main__":
    main()
