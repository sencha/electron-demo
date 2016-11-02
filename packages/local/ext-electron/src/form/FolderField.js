/**
 * This component presents a native folder picker.
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
