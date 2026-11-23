# Panel Islands

Floating island-style top panel for GNOME Shell. Splits the top bar into three
rounded, spaced islands (left / center / right) with configurable opacity,
corner radius, margin, height, color and shadow.

- UUID: `panel-islands@lox`
- Shell versions: 45 – 51

## Install

```sh
mkdir -p ~/.local/share/gnome-shell/extensions
cp -r panel-islands@lox ~/.local/share/gnome-shell/extensions/
gnome-extensions enable panel-islands@lox
```

Then restart the shell (on Wayland: log out and back in).

## Settings

`gnome-extensions prefs panel-islands@lox`, or via dconf:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `opacity` | double | 0.35 | Island background opacity (0–1) |
| `corner-radius` | double | 12.0 | Corner radius (px) |
| `margin` | double | 4.0 | Gap around/between islands (px) |
| `panel-height` | double | 40.0 | Panel height (px) |
| `island-color` | string | `#000000` | Base island color (`#rrggbb`) |
| `enable-shadow` | bool | true | Soft drop shadow under islands |

## Development

The schema must be compiled for the settings to apply:

```sh
glib-compile-schemas schemas/
```

## License

_TBD — add a LICENSE file._
