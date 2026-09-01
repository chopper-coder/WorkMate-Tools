#!/usr/bin/env bash
set -euo pipefail
VERSION="0.20.3"
EXPECTED_MD5="6b3130af1ceadf07caa0ec08af7addff"
URL="https://cdn.sheetjs.com/xlsx-${VERSION}/package/dist/xlsx.full.min.js"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/vendor/xlsx.full.min.js"
TMP="$OUT.tmp"
mkdir -p "$(dirname "$OUT")"
echo "Downloading SheetJS ${VERSION} from official CDN..."
curl --fail --location --retry 3 --connect-timeout 15 --max-time 120 "$URL" -o "$TMP"
ACTUAL="$(md5sum "$TMP" | awk '{print $1}')"
if [[ "$ACTUAL" != "$EXPECTED_MD5" ]]; then
  echo "ERROR: SheetJS checksum mismatch" >&2
  echo "Expected: $EXPECTED_MD5" >&2
  echo "Actual:   $ACTUAL" >&2
  rm -f "$TMP"
  exit 1
fi
SIZE="$(wc -c < "$TMP")"
if [[ "$SIZE" -lt 500000 || "$SIZE" -gt 2000000 ]]; then
  echo "ERROR: unexpected SheetJS file size: $SIZE" >&2
  rm -f "$TMP"
  exit 1
fi
mv "$TMP" "$OUT"
echo "SheetJS ${VERSION} vendored successfully ($SIZE bytes)."
