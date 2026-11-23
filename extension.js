import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const KEYS = ['opacity', 'corner-radius', 'margin', 'panel-height',
    'island-color', 'enable-shadow'];

const hexToRgb = hex => {
    const value = parseInt(hex.replace('#', ''), 16);
    return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
};

export default class PanelIslandsExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._boxes = [Main.panel._leftBox, Main.panel._centerBox, Main.panel._rightBox]
            .filter(box => box);

        this._cssDir = GLib.build_filenamev([GLib.get_user_cache_dir(), 'panel-islands']);
        GLib.mkdir_with_parents(this._cssDir, 0o755);
        this._cssFile = null;
        this._cssHeight = -1;

        this._apply();
        this._ids = KEYS.map(key =>
            this._settings.connect(`changed::${key}`, () => this._apply()));
    }

    disable() {
        this._ids.forEach(id => this._settings.disconnect(id));
        this._ids = null;

        if (this._cssFile) {
            this._unloadStylesheet(this._cssFile);
            this._cssFile = null;
        }

        for (const box of this._boxes)
            box.set_style(null);
        this._boxes = null;
        this._settings = null;
    }

    _apply() {
        const height = Math.round(this._settings.get_double('panel-height'));
        const radius = Math.round(this._settings.get_double('corner-radius'));
        const margin = Math.round(this._settings.get_double('margin'));
        const alpha = this._settings.get_double('opacity').toFixed(2);
        const [r, g, b] = hexToRgb(this._settings.get_string('island-color'));
        const shadow = this._settings.get_boolean('enable-shadow')
            ? 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);'
            : '';

        this._setPanelHeight(height);

        const style = `border-radius: ${radius}px;` +
            `margin: ${margin}px;` +
            `background-color: rgba(${r}, ${g}, ${b}, ${alpha});` +
            shadow;

        for (const box of this._boxes)
            box.set_style(style);
    }

    _setPanelHeight(height) {
        if (height === this._cssHeight)
            return;
        this._cssHeight = height;

        if (this._cssFile) {
            this._unloadStylesheet(this._cssFile);
            this._cssFile = null;
        }

        const path = GLib.build_filenamev([this._cssDir, `panel-height-${height}.css`]);
        GLib.file_set_contents(path, `#panel { height: ${height}px !important; }\n`);
        this._cssFile = Gio.File.new_for_path(path);

        try {
            this._theme().load_stylesheet(this._cssFile);
        } catch (e) {
            logError(e, 'panel-islands: failed to load stylesheet');
        }
    }

    _unloadStylesheet(file) {
        try {
            this._theme().unload_stylesheet(file);
        } catch (e) {
            logError(e, 'panel-islands: failed to unload stylesheet');
        }
    }

    _theme() {
        return St.ThemeContext.get_for_stage(global.stage).get_theme();
    }
}
