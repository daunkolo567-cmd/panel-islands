#!/usr/bin/env bash
# Panel Islands installer — works from a clone or via curl | bash
set -euo pipefail

UUID="panel-islands@lox"
REPO="https://github.com/daunkolo567-cmd/panel-islands.git"
DEST="$HOME/.local/share/gnome-shell/extensions/$UUID"

say() { printf '\033[1;32m==>\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m!!!\033[0m %s\n' "$*" >&2; exit 1; }

command -v glib-compile-schemas >/dev/null || die "нет glib-compile-schemas (пакет glib2)"

# Use local files if run from inside the repo, otherwise clone.
sourcedir=""
if [[ -f ./metadata.json && -f ./extension.js ]]; then
    sourcedir="$(pwd)"
else
    command -v git >/dev/null || die "нужен git"
    sourcedir="$(mktemp -d)"
    say "Клонирую $REPO ..."
    git clone --depth 1 "$REPO" "$sourcedir"
fi

say "Устанавливаю в $DEST"
mkdir -p "$DEST/schemas"
cp -f "$sourcedir/extension.js" "$sourcedir/prefs.js" \
      "$sourcedir/metadata.json" "$sourcedir/stylesheet.css" "$DEST/"
cp -f "$sourcedir"/schemas/*.gschema.xml "$DEST/schemas/"
glib-compile-schemas "$DEST/schemas"

say "Включаю расширение"
gnome-extensions enable "$UUID" 2>/dev/null || true

echo
echo "Готово! Если панель не изменилась — перелогинься (GNOME на Wayland"
echo "грузит расширения только при входе) и выполни:"
echo "    gnome-extensions enable $UUID"
