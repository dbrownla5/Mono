#!/bin/bash
# build_dist.sh — Build PyArmor pour Linux x86_64 (sans deploy SSH)
# Usage : bash build_dist.sh
set -e
cd "$(dirname "$0")/../.."

PYTHON=${PYTHON:-python}

echo "[1/4] Vérification des dépendances..."
$PYTHON -m pip install pyarmor --quiet
$PYTHON -c "import pyarmor.cli.core" 2>/dev/null || \
    $PYTHON -m pip install "pyarmor.cli.core.linux~=8.1.0" --quiet

echo "[2/4] Embarquement de config.yaml..."
$PYTHON scripts/deploy/_embed_config.py

echo "[3/4] Obfuscation PyArmor (target: linux.x86_64)..."
rm -rf dist/
pyarmor gen --recursive --platform linux.x86_64 \
    src/core/config/_embedded.py \
    main.py \
    src/ \
    --output dist/

echo "[+] Copie requirements.txt..."
cp requirements.txt dist/

echo "[4/4] Restauration stub local..."
$PYTHON scripts/deploy/_embed_config.py --restore

echo ""
echo "dist/ prêt — code obfusqué, target Linux x86_64."
echo "Pour déployer : python scripts/deploy/deploy_remote.py"
