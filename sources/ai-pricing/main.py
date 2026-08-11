# main.py — point d'entree mince
import argparse
import sys

from src.ai_pricing import SniperApp
from src.core.config.loader import load_config


def _parse_args(argv=None):
    parser = argparse.ArgumentParser(
        prog="ai-pricing",
        description="AI Pricing — Vinted scanner with ML scoring.",
    )
    parser.add_argument(
        "--allow-bypass",
        action="store_true",
        default=False,
        help=(
            "Enable Cloudflare/DataDome bypass via curl_cffi TLS impersonation "
            "and Scrapling StealthyFetcher. Default OFF. Use at your own risk "
            "and responsibility regarding Vinted Terms of Service "
            "(see README 'Compliance & ToS' section)."
        ),
    )
    return parser.parse_args(argv)


def main(argv=None) -> int:
    args = _parse_args(argv)
    cfg = load_config()

    # Propagate --allow-bypass into config (overrides http.solve_cloudflare default)
    cfg.setdefault("http", {})
    cfg["http"]["allow_bypass"] = bool(args.allow_bypass)
    if not args.allow_bypass:
        # When bypass is OFF, force solve_cloudflare OFF too (defense in depth)
        cfg["http"]["solve_cloudflare"] = False

    app = SniperApp(cfg)
    app.run()
    return 0


if __name__ == "__main__":
    sys.exit(main())
