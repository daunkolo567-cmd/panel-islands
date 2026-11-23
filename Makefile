UUID := panel-islands@lox
DEST := $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

.PHONY: install pack enable uninstall

install:
	mkdir -p "$(DEST)/schemas"
	cp -f extension.js prefs.js metadata.json stylesheet.css "$(DEST)/"
	cp -f schemas/*.gschema.xml "$(DEST)/schemas/"
	glib-compile-schemas "$(DEST)/schemas"
	-gnome-extensions enable "$(UUID)"
	@echo "Установлено. Если не подхватилось — перелогинься."

pack:
	gnome-extensions pack --force --extra-source=README.md

enable:
	-gnome-extensions enable "$(UUID)"

uninstall:
	-rm -rf "$(DEST)"
