/**
 * This view is an example list of people.
 */
Ext.define('App.view.main.List', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlist',

    requires: [
        'App.store.Personnel',
        'Ext.electron.form.FieldPicker'
    ],

    title: 'Personnel',

    store: {
        type: 'personnel'
    },

    tbar: [{
        xtype: 'electronfilefield'
    }],

    columns: [
        { text: 'Name',  dataIndex: 'name' },
        { text: 'Email', dataIndex: 'email', flex: 1 },
        { text: 'Phone', dataIndex: 'phone', flex: 1 }
    ],

    listeners: {
        select: 'onItemSelected'
    }
});
