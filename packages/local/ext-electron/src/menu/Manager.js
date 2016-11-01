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
        nativeAppMenu: null,

        nativeMenus: null,

        tags: [
            // <debug>
            'development','devtools'
            // </debug>
        ]
    },

    addTag: function (tag) {
        var me = this;
        if (me.tags.indexOf(tag) == -1) {
            this.tags.push(tag);
        }
    },

    removeTag: function (tag) {
        var me = this,
            i = me.tags.indexOf(tag);
        if (i != -1) {
            me.tags.splice(i, 1);
        }
    },

    getNativeMenu: function (name, cache) {
        var me = this,
            instances = (cache !== false) && (me.instances || (me.instances = {})),
            menu = instances && instances[name],
            menus;

        if (!menu) {
            menus = me.getNativeMenus();
            menu = menus && menus[name];

            if (menu) {
                menu = me.fixupMenuHandlers(menu);
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

    invalidateNativeMenu: function (name) {
        delete this.instances[name];
        return this;
    },

    reloadNativeMenu: function (name) {
        return this.invalidateNativeMenu(name).getNativeMenu(name);
    },

    onAppToggleFullScreen: function (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
    },

    onAppReload: function (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.reload();
        }
    },

    onAppToggleDevTools: function (item, focusedWindow) {
        if (focusedWindow) {
            focusedWindow.toggleDevTools();
        }
    },

    onClassMixedIn: function (cls) {
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
        fixupMenuHandlers: function (template) {
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

            function intersects (ary1, ary2) {
                var j, k, intersects = false;

                if (ary1 && ary1.length > 0 && ary2 && ary2.length > 0) {
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
                var accelerator, i, j, k, fixed, submenu;
                //intersects, submenu;

                if (Array.isArray(menu)) {
                    for (i = menu.length; i-- > 0;) {
                        fixed = fix(menu[i]);

                        if (menu[i].tags && menu[i].tags.length > 0) {
                            // check for tags... the list of tags on the item is an OR list
                            // if there is an intersection between me.tags and menu.tags then the item is in.
                            // otherwise it's out.

                            if (!intersects(me.tags, menu[i].tags) && !fixed) {
                                menu.splice(i, 1);
                            }
                        }
                    }

                    return menu.length > 0;
                }

                if (menu.tags && menu.tags.length > 0) {
                     if (!intersects(me.tags, menu.tags)) {
                         return false;
                     }
                }

                if (menu.shouldEnable && !menu.shouldEnable()) {
                    return false;
                }

                submenu = menu.submenu;
                if (submenu) {
                    // Idea here is that a submenu of type string indicates a method to call on the controller to
                    // retrieve menu items dynamically. We pass the array of tags so it can be sensitive to them.
                    if (typeof submenu === 'string') {
                        if (controller && controller[submenu]) {
                            submenu = controller[submenu](me.tags);
                        } else {
                            submenu = me[submenu](me.tags);
                        }
                        if (!submenu) {
                            return false;
                        }

                        menu.submenu = submenu;
                    }

                    if (!fix(submenu)) {
                        return false;
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
