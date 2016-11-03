/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('App.view.main.MainController', function () {
    // Since file-scope is global-scope (not module-scope), use a closure to limit
    // require() vars

    const getColors = require("get-image-colors");
    const electron = require('electron');

    // See http://electron.atom.io/docs/api/remote/
    const remote = electron.remote;

    // An easy way to make calls to the main process from here (the render process):
    const mainStub = remote.require('./main/mainStub.js');

    return {
        extend: 'Ext.app.ViewController',

        alias: 'controller.main',

        init () {
            this.recentFiles = [];

            this.getView().reloadNativeMenu('app');  
        },

        onFileChange (picker, path) {
            var me = this,
                vm = this.getViewModel(),
                recentFiles = me.recentFiles;

            getColors(path, (err, colors) => {
                if (err) {
                    //Ext.Msg.alert(`Error reading file ${path}: ${err.message}`);
                }
                else {
                    vm.set('colors', colors.map(c => {
                        return {
                            hex: c.hex()
                        };
                    }));

                    let i = recentFiles.indexOf(path);
                    if (i > -1) {
                        recentFiles.splice(i, 1);
                    }

                    recentFiles.push(path);
                    if (recentFiles.length > 3) {
                        recentFiles.shift();
                    }

                    // change the menu
                    me.getView().reloadNativeMenu('app');
                }
            });

            me.testRemote();
        },
        
        getReopenMenu () {
            var vm = this.getViewModel();

            return this.recentFiles.map(file => {
                return {
                    label: file,
                    click () {
                        vm.set('filename', file);
                    }
                };
            });
        },
        
        onRefreshMenu () {
            var view = this.getView();

            view.reloadNativeMenu('app');
        },

        onAppReload (item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.reload();
            }
        },

        onExit () {
            window.close();
        },
        
        onButtonToggled (btn, button, pressed) {
            var view = this.getView();

            if (pressed) {
                view.addTag(button.text)
            }
            else {
                view.removeTag(button.text);
            }

            view.reloadNativeMenu('app');
        },

        onToggleMenuItem () {
            var menu = this.getView().getNativeMenu('app');
            var item = menu.get('bsub');

            if (item) {
                item.checked = !item.checked;
            }
            else {
                Ext.Msg.alert('The TagB menuItem is not currently in the menu',
                    'Cannot Toggle');
            }
        },

        testRemote () {
            // This code demonstrates how we can *synchronously* invoke methods in
            // modules back in the main process. It also shows how callbacks can be
            // passed in and later called by the main process.
            //
            var v = mainStub.invoke(process.type, () => {
                console.log(`Callback called in ${process.type}`);
            });

            console.log(`Value from remote call to mainStub.invoke: ${v}`);
        }
    };
});
