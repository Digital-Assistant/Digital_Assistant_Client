#!/usr/bin/env bash
# Generate the title card (1280x800) and the small promo tile (440x280) with ImageMagick.
# Deterministic: fixed fonts, fixed colours, no timestamps (png:exclude-chunk drops date chunks).
# Usage: store/listing/make-cards.sh      (run from anywhere)
# Needs: ImageMagick 6 or 7 (magick or convert) and the DejaVu Sans fonts (override with FONT_BOLD / FONT_REG).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
logo="$here/../../public/logos/nist-logo-128x128.png"
FONT_BOLD="${FONT_BOLD:-/usr/share/fonts/TTF/DejaVuSans-Bold.ttf}"
FONT_REG="${FONT_REG:-/usr/share/fonts/TTF/DejaVuSans.ttf}"
for f in "$logo" "$FONT_BOLD" "$FONT_REG"; do [ -f "$f" ] || { echo "missing: $f" >&2; exit 2; }; done

if command -v magick >/dev/null 2>&1; then im=(magick); else im=(convert); fi
bg="#ffffff"; ink="#14213d"; mute="#4a5568"
png=(-define png:exclude-chunk=date,time -strip)

# Title card, 1280x800: logo, product name on two lines, one line of value text.
"${im[@]}" -size 1280x800 "xc:$bg" \
  "$logo" -gravity north -geometry +0+210 -composite \
  -gravity north -font "$FONT_BOLD" -fill "$ink" -pointsize 58 -annotate +0+370 "Universal Digital Assistant" \
  -gravity north -font "$FONT_BOLD" -fill "$ink" -pointsize 58 -annotate +0+440 "by Nistapp (UDAN)" \
  -gravity north -font "$FONT_REG"  -fill "$mute" -pointsize 30 -annotate +0+560 "Record, save and replay step-by-step guides on any web page." \
  "${png[@]}" "PNG24:$here/01-title-card-1280x800.png"

# Small promo tile, 440x280: logo and name only.
"${im[@]}" -size 440x280 "xc:$bg" \
  "$logo" -gravity north -geometry +0+36 -composite \
  -gravity north -font "$FONT_BOLD" -fill "$ink" -pointsize 22 -annotate +0+184 "Universal Digital Assistant" \
  -gravity north -font "$FONT_BOLD" -fill "$ink" -pointsize 22 -annotate +0+214 "by Nistapp (UDAN)" \
  "${png[@]}" "PNG24:$here/promo-tile-440x280.png"

identify "$here/01-title-card-1280x800.png" "$here/promo-tile-440x280.png"
