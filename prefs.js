import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class PanelIslandsPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Panel Islands',
            icon_name: 'preferences-desktop-appearance-symbolic',
        });

        const islands = new Adw.PreferencesGroup({
            title: 'Islands',
            description: 'Appearance of the floating panel groups.',
        });
        page.add(islands);

        const addSlider = (group, key, title, lower, upper, step, digits = 2) => {
            const row = new Adw.ActionRow({title});
            const adj = new Gtk.Adjustment({lower, upper, step_increment: step});
            const scale = new Gtk.Scale({
                orientation: Gtk.Orientation.HORIZONTAL,
                adjustment: adj,
                digits,
                hexpand: true,
                valign: Gtk.Align.CENTER,
            });
            scale.set_size_request(220, -1);
            settings.bind(key, adj, 'value', Gio.SettingsBindFlags.DEFAULT);
            row.add_suffix(scale);
            group.add(row);
        };

        addSlider(islands, 'opacity', 'Opacity', 0, 1, 0.05);

        const colorRow = new Adw.ActionRow({title: 'Color'});
        const dialog = new Gtk.ColorDialog({with_alpha: false});
        const button = new Gtk.ColorDialogButton({dialog, valign: Gtk.Align.CENTER});
        const rgba = new Gdk.RGBA();
        rgba.parse(settings.get_string('island-color'));
        button.set_rgba(rgba);
        button.connect('notify::rgba', () => {
            const {red, green, blue} = button.get_rgba();
            const hex = '#' + [red, green, blue]
                .map(v => Math.round(v * 255).toString(16).padStart(2, '0'))
                .join('');
            settings.set_string('island-color', hex);
        });
        colorRow.add_suffix(button);
        islands.add(colorRow);

        addSlider(islands, 'corner-radius', 'Corner radius (px)', 0, 40, 1, 0);
        addSlider(islands, 'margin', 'Margin (px)', 0, 24, 1, 0);

        const shadow = new Adw.SwitchRow({title: 'Drop shadow'});
        settings.bind('enable-shadow', shadow, 'active', Gio.SettingsBindFlags.DEFAULT);
        islands.add(shadow);

        const panel = new Adw.PreferencesGroup({
            title: 'Panel',
            description: 'Size of the top bar itself.',
        });
        page.add(panel);
        addSlider(panel, 'panel-height', 'Panel height (px)', 24, 80, 1, 0);

        window.add(page);
    }
}
