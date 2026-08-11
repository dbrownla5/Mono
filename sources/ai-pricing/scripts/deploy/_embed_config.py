#!/usr/bin/env python3
"""
_embed_config.py — Embarque config/config.yaml + secrets .env + cookies
dans src/core/_embedded_config.py avant obfuscation PyArmor.

En prod (dist/), le code obfusqué contient tout — aucun fichier externe nécessaire.
Appelé par deploy.bat (étape 1/3).
"""
import json
import secrets
from pathlib import Path

CONFIG_SRC = Path("config/config.yaml")
ENV_SRC = Path(".env")
COOKIE_SRC = Path("www.vinted.fr_cookies.json")
EMBEDDED_DST = Path("src/core/config/_embedded.py")

# Clés .env à embarquer (toutes sauf SSH_PASSWORD qui est pour le deploy uniquement)
EMBED_KEYS = [
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_CHAT_ID",
    "DISCORD_WEBHOOK",
    "DB_ENCRYPTION_KEY",
    "DESTRUCT_ADMIN_ID",
    "DESTRUCT_TOKEN",
    "LBC_TELEGRAM_TOKEN",
    "LBC_TELEGRAM_CHAT_ID",
]


def _parse_env(path: Path) -> dict:
    """Parse un fichier .env simple (KEY=VALUE, ignore commentaires et lignes vides)."""
    env = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        if key in EMBED_KEYS:
            env[key] = value.strip()
    return env


def _load_cookies(path: Path) -> dict:
    """Parse le fichier cookies JSON et retourne un dict {name: value}."""
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return {c["name"]: c["value"] for c in data if "name" in c and "value" in c}
        if isinstance(data, dict):
            return data
    except (json.JSONDecodeError, KeyError):
        pass
    return {}


def embed() -> None:
    if not CONFIG_SRC.exists():
        raise FileNotFoundError(f"{CONFIG_SRC} introuvable — lance depuis la racine du projet.")

    db_key = secrets.token_hex(32)
    content = CONFIG_SRC.read_text(encoding="utf-8")
    escaped = content.replace("\\", "\\\\").replace('"""', '\\"\\"\\"')

    # Parse .env
    env_dict = _parse_env(ENV_SRC)
    if not env_dict:
        print("  [!] .env absent ou vide — secrets non embarqués")

    # Parse cookies
    cookies_dict = _load_cookies(COOKIE_SRC)
    if cookies_dict:
        print(f"  -> {len(cookies_dict)} cookies embarqués depuis {COOKIE_SRC}")
    else:
        print(f"  [!] {COOKIE_SRC} absent ou vide — cookies non embarqués")

    EMBEDDED_DST.write_text(
        f"# AUTO-GENERATED par _embed_config.py — ne pas modifier ni committer\n"
        f'_CONFIG_YAML: str = """\n{escaped}\n"""\n'
        f'_DB_KEY: str = "{db_key}"\n'
        f"_ENV: dict = {repr(env_dict)}\n"
        f"_COOKIES: dict = {repr(cookies_dict)}\n",
        encoding="utf-8",
    )
    keys_found = ", ".join(env_dict.keys()) if env_dict else "(aucun)"
    print(f"  -> {EMBEDDED_DST} créé (DB_KEY: {db_key[:8]}..., secrets: {keys_found})")


def restore_stub() -> None:
    """Restaure un stub vide pour le développement local."""
    EMBEDDED_DST.write_text(
        "# Fichier vide pour le développement local.\n"
        "# En prod ce fichier est généré et obfusqué par deploy.bat.\n"
        '_CONFIG_YAML: str = ""\n'
        '_DB_KEY: str = ""\n'
        "_ENV: dict = {}\n"
        "_COOKIES: dict = {}\n",
        encoding="utf-8",
    )
    print(f"  -> {EMBEDDED_DST} restauré (stub vide).")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--restore":
        restore_stub()
    else:
        embed()
