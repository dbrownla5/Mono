#!/usr/bin/env python3
"""
Mapper le DOM de la page de connexion Vinted via Playwright.

Lance un browser headful, navigue sur vinted.fr, et dump :
  - La structure HTML des formulaires/boutons de login
  - Les selecteurs CSS utilisables pour l'automatisation
  - Les URLs OAuth detectees

Usage :
  python scripts/map_login_html.py [--headless] [--domain www.vinted.fr] [--profile D:\vinted_pw_profile]
"""

import argparse
import json
import sys
import time
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

DEFAULT_DOMAIN = "www.vinted.fr"
DEFAULT_PROFILE = r"D:\vinted_pw_profile"
LOGIN_PATHS = [
    "/",                        # Homepage (login button triggers SPA modal)
    "/#l10n-old-translations",  # Alternate hash route
]


def map_page(page, url: str, label: str) -> dict:
    """Navigue sur une URL et extrait la structure interactive du DOM."""
    result = {"url": url, "label": label, "status": None, "elements": [], "oauth_urls": [], "raw_html": ""}

    try:
        resp = page.goto(url, wait_until="networkidle", timeout=30000)
        result["status"] = resp.status if resp else None
        time.sleep(2)  # Laisser le JS finir de rendre

        # Accepter les cookies si banniere presente
        for consent_sel in [
            '[data-testid="cookie-consent-banner-accept"]',
            'button:has-text("Accepter")',
            'button:has-text("Accept")',
            '#onetrust-accept-btn-handler',
        ]:
            try:
                btn = page.query_selector(consent_sel)
                if btn and btn.is_visible():
                    btn.click()
                    print(f"  [+] Cookie consent accepte via {consent_sel}")
                    time.sleep(1)
                    break
            except Exception:
                continue

        # Extraire tous les elements interactifs
        elements = page.evaluate("""() => {
            const results = [];
            const selectors = [
                'button', 'a[href*="auth"]', 'a[href*="login"]', 'a[href*="oauth"]',
                'a[href*="google"]', 'a[href*="facebook"]', 'a[href*="apple"]',
                'input[type="email"]', 'input[type="password"]', 'input[type="text"]',
                'form', '[data-testid]', '[role="button"]',
                'a[href*="register"]', 'a[href*="signup"]', 'a[href*="member"]',
            ];

            for (const sel of selectors) {
                document.querySelectorAll(sel).forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width === 0 && rect.height === 0) return; // skip hidden

                    const info = {
                        tag: el.tagName.toLowerCase(),
                        type: el.type || null,
                        text: (el.textContent || '').trim().substring(0, 100),
                        href: el.href || null,
                        name: el.name || null,
                        id: el.id || null,
                        testid: el.dataset?.testid || null,
                        classes: el.className ? el.className.substring(0, 200) : null,
                        action: el.action || null,
                        method: el.method || null,
                        selector: sel,
                        visible: rect.width > 0 && rect.height > 0,
                        aria_label: el.getAttribute('aria-label') || null,
                    };
                    results.push(info);
                });
            }
            return results;
        }""")
        result["elements"] = elements

        # Detecter les URLs OAuth dans les liens
        oauth_urls = page.evaluate("""() => {
            const urls = [];
            document.querySelectorAll('a[href]').forEach(a => {
                const h = a.href;
                if (h.includes('oauth') || h.includes('google') || h.includes('facebook')
                    || h.includes('apple') || h.includes('accounts.google')
                    || h.includes('auth/') || h.includes('login')) {
                    urls.push({text: (a.textContent || '').trim(), href: h});
                }
            });
            return urls;
        }""")
        result["oauth_urls"] = oauth_urls

        # HTML brut de la zone principale
        main_html = page.evaluate("""() => {
            const main = document.querySelector('main') || document.querySelector('#app') || document.body;
            return main.innerHTML.substring(0, 50000);
        }""")
        result["raw_html"] = main_html

    except Exception as e:
        result["error"] = str(e)
        print(f"  [!] Erreur: {e}")

    return result


def check_logged_in(page, domain: str) -> dict:
    """Verifie si le profil est connecte en appelant l'API user."""
    info = {"logged_in": False, "user": None}
    try:
        resp = page.goto(f"https://{domain}/api/v2/users/current", wait_until="networkidle", timeout=15000)
        if resp and resp.status == 200:
            data = json.loads(page.content().split("<pre>")[-1].split("</pre>")[0] if "<pre>" in page.content() else page.inner_text("body"))
            try:
                data = json.loads(page.evaluate("() => document.body.innerText"))
                info["logged_in"] = True
                info["user"] = {
                    "id": data.get("user", {}).get("id") or data.get("id"),
                    "login": data.get("user", {}).get("login") or data.get("login"),
                }
            except Exception:
                pass
        else:
            info["status"] = resp.status if resp else None
    except Exception as e:
        info["error"] = str(e)
    return info


def main():
    parser = argparse.ArgumentParser(description="Map Vinted login page HTML via Playwright")
    parser.add_argument("--headless", action="store_true", help="Run headless (default: headful)")
    parser.add_argument("--domain", default=DEFAULT_DOMAIN)
    parser.add_argument("--profile", default=DEFAULT_PROFILE, help="Playwright persistent profile path")
    parser.add_argument("--output", default="scripts/login_map.json", help="Output JSON file")
    args = parser.parse_args()

    from playwright.sync_api import sync_playwright

    report = {"domain": args.domain, "profile": args.profile, "timestamp": time.time(), "pages": [], "login_status": None}

    with sync_playwright() as p:
        print(f"[*] Lancement Playwright ({'headless' if args.headless else 'headful'}) avec profil {args.profile}")
        context = p.chromium.launch_persistent_context(
            user_data_dir=args.profile,
            headless=args.headless,
            args=["--disable-blink-features=AutomationControlled", "--no-first-run"],
            locale="fr-FR",
            viewport={"width": 1440, "height": 900},
        )
        page = context.pages[0] if context.pages else context.new_page()

        # 1. Verifier si deja connecte
        print("[*] Verification du statut de connexion...")
        login_status = check_logged_in(page, args.domain)
        report["login_status"] = login_status
        if login_status["logged_in"]:
            print(f"  [OK] Connecte en tant que: {login_status['user']}")
        else:
            print("  [!] Non connecte")

        # 2. Mapper la homepage et chercher le bouton de login
        url = f"https://{args.domain}/"
        print(f"\n[*] Mapping homepage: {url}")
        page_data = map_page(page, url, "/")
        report["pages"].append(page_data)

        # 2b. Cliquer sur le bouton login/inscription pour ouvrir la modale SPA
        print("\n[*] Recherche du bouton de connexion sur la homepage...")
        login_clicked = False
        for sel in [
            'a[href*="login"]', 'a[href*="auth"]',
            'button:has-text("Se connecter")', 'button:has-text("Connexion")',
            'button:has-text("S\'inscrire")', 'button:has-text("Log in")',
            'a:has-text("Se connecter")', 'a:has-text("S\'inscrire")',
            '[data-testid*="login"]', '[data-testid*="auth"]',
            '[data-testid*="header--login"]',
        ]:
            try:
                btn = page.query_selector(sel)
                if btn and btn.is_visible():
                    print(f"  [+] Bouton trouve: {sel} → \"{btn.inner_text()[:50]}\"")
                    btn.click()
                    time.sleep(3)  # Attendre la modale
                    login_clicked = True

                    # Mapper la modale/page de login
                    print("[*] Mapping de la modale de login...")
                    modal_data = map_page(page, page.url, "login_modal_after_click")
                    report["pages"].append(modal_data)
                    break
            except Exception:
                continue

        if not login_clicked:
            print("  [!] Aucun bouton de connexion visible — dump de tous les liens/boutons")
            all_btns = page.evaluate("""() => {
                const results = [];
                document.querySelectorAll('a, button, [role="button"]').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width === 0 || rect.height === 0) return;
                    results.push({
                        tag: el.tagName,
                        text: (el.textContent || '').trim().substring(0, 80),
                        href: el.href || null,
                        testid: el.dataset?.testid || null,
                        classes: (el.className || '').substring(0, 100),
                    });
                });
                return results;
            }""")
            report["all_visible_buttons"] = all_btns
            for b in all_btns:
                print(f"    <{b['tag']}> \"{b['text'][:50]}\" href={b.get('href','')[:60]}")

            # Resume
            n_elems = len(page_data.get("elements", []))
            n_oauth = len(page_data.get("oauth_urls", []))
            print(f"  Status: {page_data.get('status')}")
            print(f"  Elements interactifs: {n_elems}")
            print(f"  URLs OAuth detectees: {n_oauth}")

            for el in page_data.get("elements", []):
                if el.get("text") and el.get("visible"):
                    tag = el["tag"]
                    text = el["text"][:60]
                    sel = el.get("testid") or el.get("id") or el.get("classes", "")[:40]
                    print(f"    <{tag}> \"{text}\" | {sel}")

            for oauth in page_data.get("oauth_urls", []):
                print(f"    OAuth: {oauth['text'][:40]} → {oauth['href'][:80]}")

        # 3. Extraire les cookies actuels
        cookies = context.cookies()
        report["cookies_count"] = len(cookies)
        report["has_access_token"] = any(c["name"] == "access_token_web" for c in cookies)
        report["has_refresh_token"] = any(c["name"] == "refresh_token_web" for c in cookies)
        report["has_session"] = any(c["name"] == "_vinted_fr_session" for c in cookies)
        print(f"\n[*] Cookies: {len(cookies)} total")
        print(f"    access_token_web: {'present' if report['has_access_token'] else 'ABSENT'}")
        print(f"    refresh_token_web: {'present' if report['has_refresh_token'] else 'ABSENT'}")
        print(f"    _vinted_fr_session: {'present' if report['has_session'] else 'ABSENT'}")

        context.close()

    # Sauvegarder le rapport (sans raw_html pour la lisibilite console)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"\n[*] Rapport sauvegarde: {output_path}")

    # Resume final
    print("\n" + "=" * 60)
    print("RESUME")
    print("=" * 60)
    if login_status["logged_in"]:
        print("Le profil Playwright est CONNECTE a Vinted.")
        print("→ L'auto-reconnexion par profil persistant fonctionnera.")
    else:
        print("Le profil Playwright N'EST PAS connecte.")
        print("→ Relancer avec --no-headless, se connecter manuellement,")
        print("  puis les cookies seront persistes dans le profil.")


if __name__ == "__main__":
    main()
