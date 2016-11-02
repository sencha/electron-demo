Ext.application({
    extend: 'App.Application',

    name: 'App',

    requires: [
        'App.view.main.Main'
    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView: 'App.view.main.Main'
});
