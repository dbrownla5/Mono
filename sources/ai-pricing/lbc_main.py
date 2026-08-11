#!/usr/bin/env python3
# lbc_main.py — Bot Leboncoin "Je donne" (sniper items gratuits)
"""
Bot autonome qui surveille la section 'Je donne' de Leboncoin
et envoie des notifications Telegram pour les items intéressants.

Utilise un bot Telegram SÉPARÉ du bot Vinted (token différent).
Configurer dans config/config.yaml, section 'leboncoin:'.

Usage :
    python lbc_main.py
"""

import argparse
import asyncio
import logging
import sys
from pathlib import Path
from typing import Any, Dict, List

# Ajoute le répertoire racine au path
sys.path.insert(0, str(Path(__file__).parent))

from src.core.utils.logging import setup_logging
from src.core.config.loader import load_config
from src.core.storage.state import SeenStore
from src.core.fetching.lbc import LbcJeDonneFetcher
from src.core.scoring.lbc import is_interesting, boost_score


logger = logging.getLogger("lbc-sniper")


# ---------------------------------------------------------------------------
# Notifier Telegram
# ---------------------------------------------------------------------------

async def _send_telegram(token: str, chat_id: str, item: Dict[str, Any],
                         hits: List[str], boost: int) -> bool:
    try:
        import aiohttp  # type: ignore[import]
    except ImportError:
        # Fallback synchrone via requests
        return _send_telegram_sync(token, chat_id, item, hits, boost)

    boost_str = " ⭐" * boost if boost else ""
    hits_str = ", ".join(hits[:5]) if hits else "match"
    text = (
        f"🆓 *LBC Je donne*{boost_str}\n"
        f"*{item['title']}*\n"
        f"📍 {item['city'] or 'France'}\n"
        f"🏷️ {hits_str}\n"
        f"🔗 {item['url']}"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False,
    }

    # Envoi avec photo si disponible
    if item.get("thumb_url"):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"https://api.telegram.org/bot{token}/sendPhoto",
                    json={
                        "chat_id": chat_id,
                        "photo": item["thumb_url"],
                        "caption": text,
                        "parse_mode": "Markdown",
                    },
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as r:
                    if r.status == 200:
                        return True
        except Exception:
            pass  # Fallback sur sendMessage

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as r:
                return r.status == 200
    except Exception as e:
        logger.warning("lbc telegram send error: %s", e)
        return False


def _send_telegram_sync(token: str, chat_id: str, item: Dict[str, Any],
                        hits: List[str], boost: int) -> bool:
    try:
        from curl_cffi import requests as cffi_requests  # type: ignore[import]
        boost_str = " ⭐" * boost if boost else ""
        hits_str = ", ".join(hits[:5]) if hits else "match"
        text = (
            f"🆓 LBC Je donne{boost_str}\n"
            f"{item['title']}\n"
            f"📍 {item['city'] or 'France'}\n"
            f"🏷️ {hits_str}\n"
            f"🔗 {item['url']}"
        )
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        r = cffi_requests.post(
            url,
            json={"chat_id": chat_id, "text": text},
            timeout=10,
        )
        return r.status_code == 200
    except Exception as e:
        logger.warning("lbc telegram sync error: %s", e)
        return False


# ---------------------------------------------------------------------------
# Boucle principale
# ---------------------------------------------------------------------------

async def run_forever(allow_bypass: bool = False) -> None:
    cfg_all = load_config()
    lbc_cfg = cfg_all.get("leboncoin") or {}
    # Propagate --allow-bypass to LBC fetcher behavior
    lbc_cfg["allow_bypass"] = bool(allow_bypass)
    if not allow_bypass:
        logger.info(
            "LBC: bypass DISABLED (use --allow-bypass to enable TLS impersonation; "
            "see README 'Compliance & ToS')"
        )

    if not lbc_cfg.get("enabled", True):
        logger.info("LBC sniper désactivé (leboncoin.enabled: false)")
        return

    token: str = lbc_cfg.get("telegram_token") or ""
    chat_id: str = str(lbc_cfg.get("telegram_chat_id") or "")
    poll_interval: int = int(lbc_cfg.get("poll_interval_s", 300))

    if not token or not chat_id:
        logger.error(
            "LBC sniper : telegram_token et telegram_chat_id requis dans config.yaml "
            "(section leboncoin)"
        )
        return

    location_cfg = lbc_cfg.get("location") or {}
    seen = SeenStore(db_path="data/db/lbc_state.db", max_entries=50_000)
    fetcher = LbcJeDonneFetcher(location_cfg=location_cfg, allow_bypass=allow_bypass)

    loc_info = ""
    if location_cfg.get("radius"):
        loc_info = f" zone={location_cfg.get('lat')},{location_cfg.get('lng')} r={location_cfg['radius']}m"
    logger.info(
        "LBC sniper démarré — poll toutes les %ds.%s Ctrl+C pour arrêter.", poll_interval, loc_info
    )

    while True:
        try:
            items = fetcher.fetch()
            new_count = 0
            sent_count = 0

            for item in items:
                item_id = item.get("id") or ""
                if not item_id or seen.has(item_id):
                    continue

                seen.add(item_id)
                new_count += 1

                interesting, hits = is_interesting(
                    item.get("title", ""),
                    item.get("description", ""),
                )
                if not interesting:
                    continue

                boost = boost_score(item.get("title", ""), item.get("description", ""))
                ok = await _send_telegram(token, chat_id, item, hits, boost)
                if ok:
                    sent_count += 1
                    logger.info(
                        "LBC notif envoyée : '%s' [%s] boost=%d",
                        item.get("title", "")[:50],
                        ", ".join(hits[:3]),
                        boost,
                    )
                else:
                    logger.warning("LBC notif échouée : id=%s", item_id)

                # Anti-flood : pause entre notifications
                if sent_count > 0:
                    await asyncio.sleep(0.5)

            logger.debug(
                "LBC cycle terminé : %d items, %d nouveaux, %d notifications",
                len(items), new_count, sent_count,
            )

        except Exception as e:
            logger.exception("LBC cycle error: %s", e)

        await asyncio.sleep(poll_interval)


def _parse_args(argv=None):
    parser = argparse.ArgumentParser(
        prog="lbc-sniper",
        description="LBC Je Donne sniper — Telegram notifications for free items.",
    )
    parser.add_argument(
        "--allow-bypass",
        action="store_true",
        default=False,
        help=(
            "Enable curl_cffi TLS impersonation against Leboncoin. Default OFF. "
            "Use at your own risk and responsibility regarding Leboncoin Terms of "
            "Service (see README 'Compliance & ToS' section)."
        ),
    )
    return parser.parse_args(argv)


def main(argv=None) -> None:
    args = _parse_args(argv)
    setup_logging()
    try:
        asyncio.run(run_forever(allow_bypass=args.allow_bypass))
    except KeyboardInterrupt:
        logger.info("LBC sniper arrêté.")
    finally:
        # Flush pending writes si le SeenStore est accessible
        logger.debug("LBC cleanup done.")


if __name__ == "__main__":
    main()
