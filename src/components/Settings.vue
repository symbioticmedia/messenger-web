<template>
     <div id="settings" >
         <div class="page-content" id="account-list" v-mdl>
            <h4>Theme Settings</h4>

             <!-- Refresh Settings Button -->
            <div class="click-item mdl-js-button mdl-js-ripple-effect" id="refresh_settings" @click="refreshSettings" v-if="showSettingsRefresh">
                <div class="mdl-color-text--grey-900">
                    Refresh settings from phone
                </div>
                <div class="mdl-color-text--grey-600">
                    These settings are pulled from the app, when you click this preference. You can also change them manually, from this page.
                </div>
            </div>
            <!-- End Refresh settings button -->

            <div class="click-item mdl-js-button mdl-js-ripple-effect" id="base-theme" @click="theme_menu.toggle()"> <!-- Base theme -->
                <div class="mdl-color-text--grey-900">Base Theme</div>
                <div class="mdl-color-text--grey-600">{{ base_theme }}</div>
            </div>

            <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--unaligned"
                id="base-theme-menu" data-mdl-for="base-theme">
                <li class="mdl-menu__item" @click="theme='day_night'">Day / Night</li>
                <li class="mdl-menu__item" @click="theme='light'">Light</li>
                <li class="mdl-menu__item" @click="theme='dark'">Dark</li>
                <li class="mdl-menu__item" @click="theme='black'">Black</li>
            </ul><!-- End Base Theme -->

            <div class="click-item mdl-js-button mdl-js-ripple-effect" @click="color_dialog.showModal();"> <!-- Global Colors -->
                <div class="mdl-color-text--grey-900">Primary Color, Primary Color Dark, Accent Color</div>
                <div class="mdl-color-text--grey-600">{{ global_colors }}</div>
            </div> <!-- End Global Colors -->

            <dialog class="mdl-dialog">
                <div class="mdl-dialog__content">
                    <h4>Update Theme Colors</h4>
                    <div class="mdl-textfield mdl-js-textfield">
                        Primary Color
                        <input class="mdl-textfield__input" type="text" id="theme-default" v-model="theme_default"/>
                        <label class="mdl-textfield__label" for="theme-default">Default Color</label>
                    </div>
                    <div class="mdl-textfield mdl-js-textfield">
                        Dark Color
                        <input class="mdl-textfield__input" type="text" id="theme-dark" v-model="theme_dark"/>
                        <label class="mdl-textfield__label" for="theme-dark">Dark Color</label>
                    </div>
                    <div class="mdl-textfield mdl-js-textfield">
                        Accent Color
                        <input class="mdl-textfield__input" type="text" id="theme-accent" v-model="theme_accent"/>
                        <label class="mdl-textfield__label" for="theme-accent">Accent Color</label>
                    </div>
                </div>
                <div class="mdl-dialog__actions">
                    <button type="button" class="mdl-button close" @click="saveColors()">Save</button>
                    <button type="button" class="mdl-button close" @click="color_dialog.close()">Close</button>
                </div>
            </dialog>

            <br />

            <!-- Use Global Theme -->
            <div class="label-item">
                <label for="global-theme" class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events">
                    <input id="global-theme" class="mdl-switch__input" type="checkbox" v-model="global_theme">
                    <span class="mdl-switch__label mdl-color-text--grey-900">
                        Apply to all Conversations
                    </span>
                </label>
            </div> <!-- End Global Theme -->

            <br />
            <h4>Web Specific Settings</h4>
            <br />
            <div class="label-item" v-if="showNotification">
                <label for="show-notifications" class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events">
                    <input id="show-notifications" class="mdl-switch__input" type="checkbox" v-model="show_notifications">
                    <span class="mdl-switch__label mdl-color-text--grey-900">
                        Show Notifications
                    </span>
                </label>
            </div>
            <div class="label-item">
                <label for="enter-to-send" class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events">
                    <input id="enter-to-send" class="mdl-switch__input" type="checkbox" v-model="enter_to_send">
                    <span class="mdl-switch__label mdl-color-text--grey-900">
                        Use Enter to Send Messages
                    </span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import { Api, Util, Platform } from '@/utils/'
import dialogPolyfill from 'dialog-polyfill'

export default {
    name: 'settings',

    mounted () {
        Api.fetchSettings()
            .then( response => {
                this.$store.commit("loading", false);
            })

        this.$store.commit('title', this.title);
        this.$store.state.msgbus.$on('refresh-btn', this.refreshSettings);

        let theme_menu_el = this.$el.querySelector("#base-theme-menu")
        this.theme_menu = theme_menu_el.MaterialMenu;

        this.color_dialog = this.$el.querySelector(".mdl-dialog");
        if (! this.color_dialog.showModal)
            dialogPolyfill.registerDialog(this.color_dialog)
    },

    data () {
        return {
            title: "Settings",
            global_theme: this.$store.state.theme_use_global,
            show_notifications: this.$store.state.notifications,
            enter_to_send: this.$store.state.enter_to_send,
            theme: this.$store.state.theme_base,
            theme_default: this.rgbaToHex(this.$store.state.theme_global_default).length > 1 ? this.rgbaToHex(this.$store.state.theme_global_default) : "#009688",
            theme_dark: this.rgbaToHex(this.$store.state.theme_global_dark).length > 1 ? this.rgbaToHex(this.$store.state.theme_global_dark) : "#00695C",
            theme_accent: this.rgbaToHex(this.$store.state.theme_global_accent).length > 1 ? this.rgbaToHex(this.$store.state.theme_global_accent) : "#FFAB40",
            theme_menu: null,
            color_dialog: null
        }
    },

    computed: {
        base_theme () {
            let base = this.$store.state.theme_base;
            base = base.split("_")
            base.forEach( (b, i) => {
                base[i] = b.charAt(0).toUpperCase() + b.slice(1);
            })

            return base.join(" / ");
        },

        global_colors () {
            const defaul = this.$store.state.theme_global_default;
            const dark = this.$store.state.theme_global_dark;
            const accent = this.$store.state.theme_global_accent;

            if (!defaul && !dark && !accent) {
                return "#009688, #00695C, #FFAB40"
            } else {
                const defaultHex = this.rgbaToHex(defaul);
                const darkHex = this.rgbaToHex(dark);
                const accentHex = this.rgbaToHex(accent);

                const defaultString = defaultHex.length > 1 ? defaultHex : "#009688";
                const darkString = darkHex.length > 1 ? darkHex : "#00695C";
                const accentString = accentHex.length > 1 ? accentHex : "#FFAB40";

                return defaultString + ", " + darkString + ", " + accentString;
            }
        },

        use_global_theme () {
            return this.boolToStr(this.$store.state.theme_use_global);
        },

        showSettingsRefresh () {
            // I don't want to remove this completely, it could be useful in the future, but we are refreshing the user's settings
            // each time the app is loaded, so this isn't necessary.
            return false;
        },

        showNotification () {
            return Platform.isWebsite();
        }
    },

    methods: {
        refreshSettings () {
            Api.fetchSettings();
            Util.snackbar("Settings Refreshed")
        },

        /**
         * rgbaToHex
         * Converts rgba (css value, str) to string hex value (css)
         * @param string - rgba(x, y, z, aa)
         * @return #0x0y0z
         */
        rgbaToHex (rgba) {
            let color_comps = rgba.match(/[0-9]+/g);
            let str_16;
            let hex = [];

            for( let c of color_comps) {
                // Parse to b16
                str_16 = parseInt(c).toString(16);
                // Normalize
                str_16 = str_16.length == 1 ? "0" + str_16 : str_16;

                hex.push(str_16);
            }

            return "#" + hex.slice(0, (hex.length - 1)).join("")
        },
        hexToRgb(hex) {
            let r = parseInt(hex.slice(1, 3), 16),
                g = parseInt(hex.slice(3, 5), 16),
                b = parseInt(hex.slice(5, 7), 16),
                a = 255 & 0xFF;

            return (r << 16) + (g << 8) + (b << 0) + (a << 24);
        },
        /**
         * Bool to Yes/No
         */
        boolToStr (bool) {
            return bool ? "Yes" : "No";
        },
        saveColors () {

            // Convert hex to RGB Int
            const theme_default = this.hexToRgb(this.theme_default)
            const theme_dark = this.hexToRgb(this.theme_dark)
            const theme_accent = this.hexToRgb(this.theme_accent)

            // Update value on remote server
            Api.updateSetting("global_primary_color", "int", theme_default);
            Api.updateSetting("global_primary_dark_color", "int", theme_dark);
            Api.updateSetting("global_accent_color", "int", theme_accent);

            // Store rgba value in store
            this.$store.commit('theme_global_default', Util.expandColor(theme_default))
            this.$store.commit('theme_global_dark', Util.expandColor(theme_dark))
            this.$store.commit('theme_global_accent', Util.expandColor(theme_accent))

            this.$store.commit('colors_default', Util.expandColor(theme_default))
            this.$store.commit('colors_dark', Util.expandColor(theme_dark))
            this.$store.commit('colors_accent', Util.expandColor(theme_accent))

            this.color_dialog.close()
        }

    },
    watch: {
        'show_notifications' () {
            this.$store.commit('notifications', this.show_notifications);
        },
        'enter_to_send' () {
            this.$store.commit('enter_to_send', this.enter_to_send);
        },
        'global_theme' () {
            this.$store.commit('theme_use_global', this.global_theme)
            Api.updateSetting("apply_theme_globally", "boolean", this.global_theme)
        },
        'theme' () {
            this.$store.commit('theme_base', this.theme),
            Api.updateSetting("base_theme", "string", this.theme)
        },
        '$store.state.theme_global_default' () {
            const color = this.$store.state.theme_global_default;
            if (!color) {
                this.theme_default = "#009688";
            } else {
                this.theme_default = this.rgbaToHex(color);
            }
        },
        '$store.state.theme_global_dark' () {
            const color = this.$store.state.theme_global_dark;
            if (!color) {
                this.theme_dark = "#00695C";
            } else {
                this.theme_dark = this.rgbaToHex(color);
            }
        },
        '$store.state.theme_global_accent' () {
            const color = this.$store.state.theme_global_accent;
            if (!color) {
                this.theme_accent = "#FFAB40";
            } else {
                this.theme_accent = this.rgbaToHex(color);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/_vars.scss";

    .label-item {
        padding-left: 15px;
    }

    .item, .click-item {
        position: relative;
        width: 100%;
        padding: 16px;
        line-height: 18px;
    }

    .item:hover, .click-item:hover {
    	  background: #E0E0E0;
    }

    .click-item:hover {
        cursor: pointer;
    }

    dialog {
        position: fixed;
        top: 50%;
        transform: translate(0, -50%);
    }

    body.dark {
        .item:hover, .click-item:hover {
        	  background: #202020;
        }
    }

</style>
