#!/bin/sh
# Transforms the english master TS file into a JSON file that transifex understands.

# HOW TO:
# 1. cd into global-search/src/i18n
# 3. Run this script: ./master-ts-to-json.sh

set -e

# Make copy
cp global-search_en.ts global-search_en.json

# Remove leading stuff to make it valid json
sed -i '' 's/\/\/ prettier-ignore//' global-search_en.json
sed -i '' 's/export default //' global-search_en.json

echo "Great Success!"