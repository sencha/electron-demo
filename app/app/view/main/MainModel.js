/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('App.view.main.MainModel', function () {
    // Since file-scope is global-scope (not module-scope), use a closure to limit
    // require() vars

    const fs = require('fs');
    const sha = require('sha.js');

    return {
        extend: 'Ext.app.ViewModel',

        alias: 'viewmodel.main',

        data: {
            name: 'App',
            filename: null,

            loremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do ' +
                'eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ' +
                'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
                'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit ' +
                'esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat ' +
                'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },

        formulas: {
            hash (get) {
                let path = get('filename');

                if (!path) {
                    return '';
                }

                let file = fs.readFileSync(path);
                let hasher = sha('sha256');

                let hash = hasher.update(file).digest('hex');

                return hash;
            }
        }
    }
});
