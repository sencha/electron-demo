/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 */
Ext.define('App.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'App.view.main.MainController',
        'App.view.main.MainModel',
        'App.view.main.List',

        'Ext.electron.form.FileField'
    ],
    
    mixins: [
        'Ext.electron.menu.Manager'
    ],

    controller: 'main',
    viewModel: 'main',

    ui: 'navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: '{name}'
            },
            flex: 0
        },
        iconCls: 'fa-th-list'
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },

    defaults: {
        bodyPadding: 20,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },

    nativeMenus: {
        app: [{
            label: 'File',
            submenu: [{
                label: 'Reopen',
                submenu: 'getReopenMenu'
            }, {
                label: 'Exit',
                accelerator: 'CmdOrCtrl+Q',
                click: 'onExit'
            }]
        }, {
            label: 'MainMenu',
            tags: ['MainMenu'],
            submenu: [{
                label: 'TagA TagB',
                tags: ['TagA', 'TagB']
            }, {
                label: 'TagB TagC',
                tags: ['TagB', 'TagC']
            }]
        },{
            label: 'TagB',
            tags: ['TagB'],
            submenu: [{
                label: 'Item 1'
            }, {
                label: 'Item 2'
            }]
        },{
            label: 'TagC',
            tags: ['TagC'],
            submenu: [{
                label: 'Item 1'
            }, {
                label: 'Item 2'
            }]
        },{
            label: 'View',
            submenu: [{
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: 'onAppReload'
            }]
        }]
    },

    items: [{
        title: 'Home',
        iconCls: 'fa-home',
        // The following grid shares a store with the classic version's grid as well!
        tbar: [{
            xtype: 'component',
            html: 'Menu filter: '
        },{
            xtype: 'segmentedbutton',
            allowMultiple: true,
            items: [{
                text: 'MainMenu',
                pressed: false
            }, {
                text: 'TagA',
                pressed: false
            }, {
                text: 'TagB',
                pressed: false
            }, {
                text: 'TagC',
                pressed: false
            }],
            listeners: {
                toggle: 'onButtonToggled'
            }
        }],

        items: [{
            xtype: 'mainlist'
        }]
    }, {
        title: 'Users',
        iconCls: 'fa-user',

        tbar: [{
            xtype: 'electronfilefield',
            flex: 2,
            reference: 'filepicker',
            options: {
                filters: [
                    {name: 'Images', extensions: ['jpg', 'png', 'gif']},
                    {name: 'All Files', extensions: ['*']}
                ]
            },
            bind: '{filename}',
            listeners: {
                change: 'onFileChange'
            }
        }, {
            xtype: 'component',
            flex: 5,
            style: {
                'font-family': 'monospace'
            },
            bind: '{hash}'
        }],

        items: [{
            xtype: 'component',

            bind: {
                data: '{colors}'
            },
            tpl: '<tpl for=".">'+
                    '<div style="background-color: {hex};" class="app-main-color-tile"></div>' +
                '</tpl>'
        }],

        bind: {
            html: '{loremIpsum}'
        }
    }, {
        title: 'Groups',
        iconCls: 'fa-users',
        bind: {
            html: '{loremIpsum}'
        }
    }, {
        title: 'Settings',
        iconCls: 'fa-cog',
        bind: {
            html: '{loremIpsum}'
        }
    }]
});
