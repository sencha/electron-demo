// @cmd.optimizer.requires.async
/**
 * This class helps you manage the [native menus](http://electron.atom.io/docs/api/menu/)
 * for an Electron application.
 *
 * `Ext.electron.menu.Manager` is designed to be used as a Mixin. Typically it would be
 * mixed into the viewport or some other high-level class within your app.
 *
 * The application menu and its sub-menus are defined using the `{@link #cfg-nativeMenus nativeMenus}`
 * config.
 *
 * See {@link #method-reloadNativeMenu reloadNativeMenu} for information on setting the
 * native menu at runtime.
 *
 * Example Viewport class with `Ext.electron.menu.Manager` mixed in with two pre-defined
 * menus:
 *
 *     Ext.define('Ext.container.Viewport', {
 *         extend: 'Ext.container.Viewport',
 *         xtype: 'my-viewport',
 *
 *         mixins: ['Ext.electron.menu.Manager'],
 *
 *         nativeMenus: {
 *             // The "app" menu is the menu to associate as the primary
 *             // application menu.
 *
 *             app: [{
 *                 label: 'File',
 *                 submenu: [{
 *                     label: 'Show Mac Menu',
 *                     click: 'showMacMenu',
 *                     visible () {
 *                         return Ext.os.is.MacOS
 *                     }
 *                 }],
 *             }, {
 *                 label: 'View',
 *                 submenu: [{
 *                     label: 'Fullscreen',
 *                     click: 'toggleFullScreen',
 *                     accelerator: 'Ctrl+Command+F'
 *                 }, {
 *                     label: 'Developer Tools',
 *                     click: 'toggleDevTools',
 *                     accelerator: 'Alt+Command+I',
 *                     tags: ['development']
 *                 }]
 *             }],
 *
 *             // Another native menu to use for a context menu.
 *
 *             context: [{
 *                 label: 'Inspect',
 *                 click: 'onInspectApp'
 *             }]
 *         }
 *     });
 */

if(window && window.process) {
Ext.define('Ext.electron.menu.Manager', function () {
    
    var remote = require('electron').remote;
    var Menu = remote.Menu;

return {
    requires: [
        'Ext.electron.menu.Menu',
        'Ext.electron.form.FileField'
    ],

    config: {
        /**
         * @cfg {Object} nativeMenus
         * An object map of named menu configs that can be used for the native Electron
         * menu. The menu config wraps the Electron menu configuration options
         * along with a few additional configs provided by this class.  For each menu
         * config option, its usage will be described below and a link provided for the
         * Electron documentation as applicable.
         *
         * Example config:
         *
         *     nativeMenus: {
         *         app: [{
         *             label: 'File',
         *             submenu: [{
         *                 label: 'Show Mac Menu',
         *                 click: 'showMacMenu',
         *                 visible () {
         *                     return Ext.os.is.MacOS;
         *                 }
         *             }],
         *         }, {
         *             label: 'View',
         *             submenu: [{
         *                 label: 'Fullscreen',
         *                 click: 'toggleFullScreen',
         *                 accelerator: 'Ctrl+Command+F'
         *             }, {
         *                 label: 'Developer Tools',
         *                 click: 'toggleDevTools',
         *                 accelerator: 'Alt+Command+I',
         *                 tags: ['development']
         *             }]
         *         }],
         *
         *         context: [{
         *             label: 'Inspect',
         *             click: 'onInspectApp'
         *         }]
         *     }
         *
         * ### Menu Options
         *
         * - **label** {String} The text to display for this menu.
         *
         * - **click** {Function/String} A function called when the menu item is clicked
         * (or name of the view controller method handling the click).
         *
         * - **enabled** {Boolean/Function} A boolean value or a function returning
         * `true` or `false` where a return value of `false` disables the menu.
         *
         * - **visible** {Boolean/Function} A boolean value or a function returning
         * `true` or `false` where a return value of `false` hides the menu.
         *
         * - **accelerator** {String} A key combination used to execute the click
         * handler for this menu.  For a listing of possible values refer to the Electron
         * [Accelerator](http://electron.atom.io/docs/api/accelerator/) API documentation.
         *
         * - **tags** {String[]} An array of strings used to filter out menus or menu
         * items.  Omitting this config (a `null` value) indicates the item will always
         * be shown.  Else, the item will be only be shown if one or more of its `tags`
         * are present in the {@link #cfg-tags tags} config.
         *
         * - **submenu** {Object[]} An array of menu config objects for sub-menus off of
         * this menu.
         *
         * - **type** {String} The type of [menu item](http://electron.atom.io/docs/api/menu-item/).
         * Can be 'normal', 'separator', 'submenu', 'checkbox', or 'radio' (will
         * automatically be 'submenu' if the submenu config options is used, otherwise is
         * 'normal').
         *
         * - **role** {String} The role / action to be performed by the menu item (use
         * of `role` overrides any configured `click` handler).  See the
         * [Electron API docs](http://electron.atom.io/docs/api/menu-item/)
         * for possible role options.
         *
         * - **checked** {Boolean} Should only be specified for 'checkbox' or 'radio'
         * `type` menu items.
         *
         * The Electron Menu API used will depend on the version you have installed.  For
         * additional menu / menu item configuration options refer to the
         * [Electron Menu](http://electron.atom.io/docs/api/menu/) and
         * [MenuItem](http://electron.atom.io/docs/api/menu-item/) API documentation.
         */
        nativeMenus: null,

        /**
         * @cfg {String[]} tags
         * An array of tags (strings) used to filter menus and menu items. Menu and items
         * with a `tags` property require one or more of their tags to be present in this
         * config to be shown at runtime.
         *
         * Consider the following example:
         *
         *     nativeMenus: {
         *         app: [{
         *             label: 'File',
         *             submenu: [{
         *                 label: 'Show Mac Menu',
         *                 click: 'showMacMenu',
         *                 visible () {
         *                     return Ext.os.is.MacOS
         *                 }
         *             }],
         *         }, {
         *             label: 'View',
         *             submenu: [{
         *                 label: 'Fullscreen',
         *                 click: 'toggleFullScreen',
         *                 accelerator: 'Ctrl+Command+F'
         *             }, {
         *                 label: 'Developer Tools',
         *                 click: 'toggleDevTools',
         *                 accelerator: 'Alt+Command+I',
         *                 tags: ['development']
         *             }]
         *         }],
         *
         *         context: [{
         *             label: 'Inspect',
         *             click: 'onInspectApp'
         *         }]
         *     }
         *
         * In this example the "Developer Tools" menu item has a `tags` config of
         * `['development']`.  This menu item will be hidden unless the class mixing in
         * Ext.electron.menu.Manager has a tags config including 'development' such as:
         *
         *     tags: ['development', 'initial', 'superuser']
         *
         * Since 'development' is matched the "Developer Tools" menu item will be shown.
         * See {@link #method-addTag} and {@link #method-removeTag} for information on
         * managing `tags` filtering at runtime.
         *
         * **Note:** By default the value of `tags` is `['development', 'devtools']`,
         * however, this will automatically stripped from the class in a production
         * build generated by Sencha Cmd.
         */
        tags: [
            // <debug>
            'development','devtools'
            // </debug>
        ]
    },

    /**
     * Adds a member from `{@link #cfg-tags tags}` at runtime to filter the Electron menu.
     *
     * **Note:** After changing the tags you must then call
     * {@link #method-reloadNativeMenu reloadNativeMenu} with the name of the menu you
     * wish to refresh in order to update the current menu.
     *
     * @param {String} tag The tag to add to the {@link #cfg-tags tags} array.
     * @return {Ext.electron.menu.Manager} this
     * @chainable
     */
    addTag (tag) {
        var tags = this.tags;

        if (tags.indexOf(tag) < 0) {
            tags.push(tag);
        }

        return this;
    },

    /**
     * Removes a member from `{@link #cfg-tags tags}` at runtime to filter the Electron menu.
     *
     * **Note:** After changing the tags you must then call
     * {@link #method-reloadNativeMenu reloadNativeMenu} with the name of the menu you
     * wish to refresh in order to update the current menu.
     *
     * @param {String} tag The tag to add to the {@link #cfg-tags tags} array.
     * @return {Ext.electron.menu.Manager} this
     * @chainable
     */
    removeTag (tag) {
        var tags = this.tags,
            i = tags.indexOf(tag);

        if (i > -1) {
            tags.splice(i, 1);
        }

        return this;
    },

    /**
     * Gets the Electron menu given a name in the `{@link #cfg-nativeMenus nativeMenus}`
     * config.
     *
     * @param {String} name The name of the {@link #cfg-nativeMenus menu} to fetch.
     * @param {Boolean} [cache=true] Pass `false` to build a new Electron menu instance
     * instead of fetching the existing menu instance (if it exists).
     *
     * @return {Ext.electron.menu.Menu} The menu or `null` if a menu was not able to be
     * loaded using the passed `name`.
     */
    getNativeMenu (name, cache) {
        var me = this,
            instances = (cache !== false) && (me.instances || (me.instances = {})),
            menu = instances && instances[name],
            menus;

        if (!menu) {
            menus = me.getNativeMenus();
            menu = menus && menus[name];

            if (menu) {
                menu = me.fixupMenuHandlers(menu);

                // https://github.com/electron/electron/blob/master/docs/api/menu.md
                // https://github.com/electron/electron/blob/master/docs/api/menu-item.md
                menu = Menu.buildFromTemplate(menu);

                if (name === 'app') {
                    Menu.setApplicationMenu(menu);
                }

                menu = new Ext.electron.menu.Menu(name, menu);

                if (instances) {
                    instances[name] = menu;
                }
            }
        }

        return menu || null;
    },

    invalidateNativeMenu (name) {
        var instances = this.instances,
            menu = instances && instances[name];

        if (menu) {
            delete instances[name];
            menu.destroy();
        }

        return this;
    },

    /**
     * Refreshes the specified {@link #cfg-nativeMenus menu}.
     *
     * In the below example, the menu loaded at launch will be the 'app' menu per the
     * {@link #cfg-nativeAppMenu nativeAppMenu} config.
     *
     *     Ext.define('Ext.container.Viewport', {
     *         extend: 'Ext.container.Viewport',
     *         xtype: 'my-viewport',
     *
     *         mixins: ['Ext.electron.menu.Manager'],
     *
     *         nativeMenus: {
     *             app: [{
     *                 // .. menu config
     *             }],
     *
     *             context: [{
     *                 // .. menu config
     *             }]
     *         }
     *     });
     *
     * To load the 'context' menu at runtime you would call:
     *
     *     Ext.first('my-viewport').reloadNativeMenu('context');
     *
     * @param {String} name The name of the {@link #cfg-nativeMenus menu} to set
     * @return {Menu} The loaded [Electron menu](http://electron.atom.io/docs/api/menu/)
     * or null if a menu was not able to be loaded using the passed `name`.
     */
    reloadNativeMenu (name) {
        return this.invalidateNativeMenu(name).getNativeMenu(name);
    },

    onAppToggleFullScreen (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
    },

    onAppReload (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.reload();
        }
    },

    onAppToggleDevTools (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.toggleDevTools();
        }
    },

    onClassMixedIn (cls) {
        var hooks = cls._classHooks;
        if(hooks){
            onCreated = hooks.onCreated,
            proto = cls.prototype,
            nativeMenus = proto.nativeMenus;
        
            // Our configs get lost as we are mixed in, so restore them from the
            // target class...

            hooks.onCreated = function (...args) {
                var me = this;

                if (nativeMenus) {
                    cls.$config.add({
                        nativeMenus: nativeMenus
                    });
                }

                hooks.onCreated = onCreated;
                hooks.onCreated.call(me, args);
            };
        }
    },

    privates: {
        fixupMenuHandlers (template) {
            var me = this,
                controller = me.lookupController && me.lookupController(),
                ret = Ext.clone(template);

            function bind (method) {
                var owner = me;

                if (controller && controller[method]) {
                    owner = controller;
                }

                return function (menuItem, browserWindow) {
                    return owner[method](menuItem, browserWindow);
                };
            }

            function expand (item, prop) {
                
                var val = item[prop];
                var type = typeof val;

                if (type === 'function') {
                    item[prop] = val.call(me, me.tags);
                }
                else if (type === 'string') {
                    if (controller && controller[val]) {
                        item[prop] = controller[val](me.tags);
                    }
                    else {
                        item[prop] = me[val](me.tags);
                    }
                }
            }

            function intersects (ary1, ary2) {
                var j, k;

                if (!ary2 || !ary2.length) {
                    return true;
                }

                if (ary1 && ary1.length) {
                    for (j = 0; j < ary1.length; j++) {
                        for (k = 0; k < ary2.length; k++) {
                            if (ary1[j] === ary2[k]) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            }

            function fix (menu) {
                var accelerator, i, fixed, submenu;

                if (Array.isArray(menu)) {
                    for (i = menu.length; i-- > 0;) {
                        fixed = fix(menu[i]);

                        // check for tags... the list of tags on the item is an OR list
                        // if there is an intersection between me.tags and menu.tags
                        // then the item is in. Otherwise it's out.

                        if (!intersects(me.tags, menu[i].tags) && !fixed) {
                            menu.splice(i, 1);
                        }
                    }

                    return menu.length > 0;
                }

                 if (!intersects(me.tags, menu.tags)) {
                     return false;
                 }

                // If these properties contain methods, call them. If they are strings,
                // call those methods on the controller or me to get the true value.
                expand(menu, 'checked');
                expand(menu, 'enabled');
                expand(menu, 'visible');
                expand(menu, 'submenu');

                submenu = menu.submenu;
                if (submenu) {
                    // Idea here is that a submenu of type string indicates a method to call on the controller to
                    // retrieve menu items dynamically. We pass the array of tags so it can be sensitive to them.
                    // if (typeof submenu === 'string') {
                    //     if (controller && controller[submenu]) {
                    //         submenu = controller[submenu](me.tags);
                    //     } else {
                    //         submenu = me[submenu](me.tags);
                    //     }
                    //     if (!submenu) {
                    //         return false;
                    //     }
                    //
                    //     menu.submenu = submenu;
                    // }

                    if (!fix(submenu)) {
                        delete menu.submenu;
                        //return false;
                    }
                }

                accelerator = menu.accelerator;
                if (accelerator && typeof accelerator !== 'string') {
                    menu.accelerator = accelerator[process.platform] ||
                        accelerator.otherwise;
                }

                if (typeof menu.click === 'string') {
                    menu.click = bind(menu.click);
                }

                return true;
            }

            fix(ret);

            return ret;
        }
    }
 }
});
} else {
    Ext.define('Ext.electron.menu.Manager', {});
}
/*
The default template:

var template = [
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            },
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            },
            {
                label: 'Toggle Full Screen',
                accelerator: (function () {
                    if (process.platform == 'darwin') {
                        return 'Ctrl+Command+F';
                    } else {
                        return 'F11';
                    }
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: (function () {
                    if (process.platform == 'darwin') {
                        return 'Alt+Command+I';
                    } else {
                        return 'Ctrl+Shift+I';
                    }
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                }
            },
        ]
    },
    {
        label: 'Window',
        role: 'window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
        ]
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: function () {
                    require('electron').remote.shell.openExternal('http://electron.atom.io')
                }
            },
        ]
    },
];
 */
