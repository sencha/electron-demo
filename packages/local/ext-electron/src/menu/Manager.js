/*
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
// @cmd.optimizer.requires.async
Ext.define('Ext.electron.menu.Manager', function () {
    var remote = require('electron').remote;
    var Menu = remote.Menu;

return {
    config: {
        nativeAppMenu: 'app',

        nativeMenus: null,

        tags: [
            // <debug>
            'development','devtools'
            // </debug>
        ]
    },

    addTag (tag) {
        var me = this;
        if (me.tags.indexOf(tag) == -1) {
            this.tags.push(tag);
        }
    },

    removeTag (tag) {
        var me = this,
            i = me.tags.indexOf(tag);
        if (i != -1) {
            me.tags.splice(i, 1);
        }
    },

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

                if (name === me.getNativeAppMenu()) {
                    Menu.setApplicationMenu(menu);
                }

                if (instances) {
                    instances[name] = menu;
                }
            }
        }

        return menu || null;
    },

    invalidateNativeMenu (name) {
        var instances = this.instances;

        if (instances) {
            delete instances[name];
        }

        return this;
    },

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
        var hooks = cls._classHooks,
            onCreated = hooks.onCreated,
            proto = cls.prototype,
            nativeAppMenu = proto.nativeAppMenu,
            nativeMenus = proto.nativeMenus;

        // Our configs get lost as we are mixed in, so restore them from the
        // target class...

        hooks.onCreated = function (a, b, c, d) {
            var me = this,
                args = Ext.Array.slice(arguments);

            cls.$config.add({
                nativeAppMenu: nativeAppMenu,
                nativeMenus: nativeMenus
            });

            hooks.onCreated = onCreated;
            hooks.onCreated.call(me, args);
        };
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
                var j, k, intersects = false;

                if (!ary2 || !ary2.length) {
                    return true;
                }

                if (ary1 && ary1.length && ary2 && ary2.length) {
                    for (j = 0; j < ary1.length; j++) {
                        for (k = 0; k < ary2.length; k++) {
                            if (ary1[j] === ary2[k]) {
                                intersects = true;
                                break;
                            }
                        }
                        if (intersects) {
                            break;
                        }
                    }
                }

                return intersects;
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
                // if (menu.shouldEnable && !menu.shouldEnable()) {
                //     return false;
                // }

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
}});
