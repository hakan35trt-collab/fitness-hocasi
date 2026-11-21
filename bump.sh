#!/bin/sh
# Kullanım: ./bump.sh 2.0.1   → sw.js, version.json ve index.html içindeki sürümü günceller
set -e
[ -z "$1" ] && { echo "Kullanım: ./bump.sh X.Y.Z"; exit 1; }
cd "$(dirname "$0")"
sed -i.bak "s/^const VERSION = '.*';/const VERSION = '$1';/" sw.js
printf '{"version": "%s"}\n' "$1" > version.json
sed -i.bak -E "s/\?v=[0-9A-Za-z.\-]+\"/?v=$1\"/g" index.html
rm -f sw.js.bak index.html.bak
echo "Sürüm $1 yapıldı. Şimdi: git commit -am 'v$1' && git push"
