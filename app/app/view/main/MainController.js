/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('App.view.main.MainController', function () {
    // Since file-scope is global-scope (not module-scope), use a closure to limit
    // require() vars

    const getColors = require("get-image-colors");
    const electron = require('electron');

    // See http://electron.atom.io/docs/api/remote/
    const remote = electron.remote;

    // We can do simple calls to the main process from here (the render process)
    const foo = remote.require('./main/mainStub.js');

    return {
        extend: 'Ext.app.ViewController',

        alias: 'controller.main',

        init () {
            this.getView().reloadNativeMenu('app');  
        },
        
        initViewModel (vm) {
            var colorStore = new Ext.data.Store({
                fields: ['hex']
            });

            vm.set('colorStore', this.colorStore = colorStore);
        },

        onFileChange (picker, path) {
            var vm = this.getViewModel();
            var v = foo.foobar(process.type, () => {
                console.log(`Callback called in ${process.type}`);
                debugger;
            });

            console.log(`v=${v}`);

            getColors(path, (err, colors) => {
                if (err) {
                    Ext.Msg.alert(`Error reading file ${path}: ${err.message}`);
                }
                else {
                    vm.set('colors', colors.map(c => {
                        return {
                            hex: c.hex()
                        };
                    }));
                    // change the menu
                    me.getView().reloadNativeMenu('app');
                }
            });
        },
        
        onRefreshMenu () {
            var view = this.getView();
            view.reloadNativeMenu('app');
        },

        onAppReload: function (item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.reload();
            }
        },

        onExit: function() {
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
        }
    };
});
