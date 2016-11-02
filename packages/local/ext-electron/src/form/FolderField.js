/**
 * This component presents a native folder picker.
 *
 *     Ext.create({
 *         xtype: 'electronfolderfield',
 *
 *         // allow the user to only select a folder under `baseDir`
 *         baseDir: 'Macintosh HD/Users/MyName/Documents',
 *
 *         listeners: {
 *             pathselect: function (field, path) {
 *                 console.log(path);  // logs the path of the selected folder
 *             }
 *         }
 *     });
 */
Ext.define('Ext.electron.form.FolderField', {
    extend: 'Ext.electron.form.FileField',

    xtype: 'electronfolderfield',

    options: {
        title: 'Select Folder',

        properties: [
            'openDirectory'
        ]
    }
});
