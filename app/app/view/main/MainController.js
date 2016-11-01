/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('App.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onFileChange (picker, path) {
        console.log(`File is ${path}`);
    },

    onHash () {
        let picker = this.lookup('filepicker');
        let path = picket.getValue();

        console.log(`Hash ${path}`);
    }
});
