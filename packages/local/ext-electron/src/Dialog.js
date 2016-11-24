/**
 * This singleton class simplifies invoking a system file Open or file Save As dialog
 * by wrapping the native [Electron dialog API](http://electron.atom.io/docs/api/dialog/),
 * adding useful global events and a promise-based result delivery.
 *
 * **Note:** As this class wraps the Electron API, you may need to refer to the source
 * Electron API documentation for your installed version.  The options described with
 * this class and its methods may or may not apply to the version of Electron you have
 * installed.
 *
 * ##Events
 * The {@link #method-filePicker filePicker} method fires two global methods:
 * {@link Ext.GlobalEvents#event-nativemodalopen nativemodalopen} and
 * {@link Ext.GlobalEvents#event-nativemodalclose nativemodalclose}.  See the
 * {@link #method-filePicker filePicker} description for example usage.
 *
 * ## File Open / Save Callback
 * A departure from the native Electron Dialog class is that a Promise is returned
 * and resolves to the folder or file(s) selected. The result is an array of user-selected
 * folder or file paths or `null` if nothing was selected.
 *
 * Example:
 *
 *     Ext.electron.Dialog.filePicker({
 *         title: 'Open File',
 *         properties: ['openFile']
 *     }).
 *     then(function (filePaths) {
 *         if (filePaths) {               // null if nothing was selected (Cancel)
 *             console.log(filePaths[0]); // logs the path to the selected file
 *         }
 *     });
 *
 * To select multiple files:
 *
 *     Ext.electron.Dialog.filePicker({
 *         title: 'Open File',
 *         properties: ['openFile', 'multiSelections']
 *     }).
 *     then(function (filePaths) {
 *         if (filePaths) {
 *             console.log(filePaths); // logs the path(s) to the selected file(s)
 *         }
 *     });
 */
Ext.define('Ext.electron.Dialog', function () {
 if(window && window.process) {
    var remote = require('electron').remote;
    var dialog = remote.dialog;

return {
    requires: [
        'Ext.GlobalEvents'
    ],

    singleton: true,

    methods: {
        open: 'showOpenDialog',
        save: 'showSaveDialog'
    },

    /**
     * Shows the local system’s Open or Save As file view.  Internally this is done by
     * calling Electron’s
     * [showOpenDialog](http://electron.atom.io/docs/api/dialog/#dialogshowopendialogbrowserwindow-options-callback)
     * or [showSaveDialog](http://electron.atom.io/docs/api/dialog/#dialogshowsavedialogbrowserwindow-options-callback)
     * methods.
     *
     * The `options` param is processed only partially by the `Ext.electron.Dialog and the
     * majority of the properties are passed on to the appropriate Electron method based
     * on the passed `type` (either 'save' or 'open').
     *
     * A `Promise` is passed back once a user has selected a file.
     *
     * Example:
     *
     *     Ext.electron.Dialog.filePicker({
     *         title: 'Open Config File',
     *         properties: ['openFile'],
     *         filters: [{
     *             name: 'Config Files',
     *             extensions: ['cfg', 'json']
     *         }]
     *     }).then(function(filePaths) {
     *         if (filePaths) {         // null if a file was not selected in the dialog
     *             console.log(filePaths); // logs the path(s) to the selected file(s)
     *         }
     *     });
     *
     * This method fires the `{@link #event!nativemodalopen nativemodalopen}` and
     * `{@link #event!nativemodalclose nativemodalclose}` surrounding the presentation of
     * the native file picker. These events can be used by controllers using the `global`
     * event domain.
     *
     * @param {Object} options The options param is passed on to the native Electron
     * Dialog open/save method. The properties described below are those passed on to
     * the Electron method’s `options` param.  All options apply to both the open and
     * and save Dialog methods unless otherwise stated.
     * @param {String} options.type Pass either ‘save’ or ‘open’ to open the save / open
     * file dialog respectively.  Defaults to ‘open’.
     * @param {String} options.title The dialog window title
     * @param {String} options.defaultPath {The path to initially display in the file
     * window.  When opening a file this refers to the initial directory from which the
     * user will select a file.  When saving a path + file.extension may be passed for
     * the default save path + file name.
     * @param {String} options.buttonLabel Custom label for the confirmation button, when
     * left empty the default system label will be used
     * @param {Object[]} options.filters The filters specifies an array of file types
     * that can be displayed or selected when you want to limit the user to a specific
     * type.
     *
     * For example:
     *
     *     filters: [{
     *         name: 'Images',
     *         extensions: ['jpg', 'png', 'gif']
     *     }, {
     *         name: 'Movies',
     *         extensions: ['mkv', 'avi', 'mp4']
     *     }, {
     *         name: 'Custom File Type',
     *         extensions: ['as']
     *     }, {
     *         name: 'All Files',
     *         extensions: ['*']
     *     }]
     *
     * The `extensions` array should contain extensions without wildcards or dots (e.g.
     * 'png' is good but '.png' and'*.png' are bad). To show all files, use the '*'
     * wildcard (no other wildcard is supported).
     * @param {String[]} options.properties Contains which features the dialog should
     * use, can contain `openFile`, `openDirectory`, `multiSelections`, `createDirectory`
     * and `showHiddenFiles`.  **Note:** This option applies to `open` file dialogs only.
     * @return {Promise} A promise processed after a user selects a file or files as a
     * `String[]`.
     *
     *  - param: {String[]/null} filePaths - An array of user-selected folder or file
     * paths or `null` if nothing was selected.
     */
    filePicker (options) {
        options = Ext.apply({
            type: 'open'
        }, options);

        var method = this.methods[options.type];

        //<debug>
        if (!method) {
            Ext.raise(`Unknown dialog type "${options.type}" (expected "open" or "save")`);
        }
        //</debug>

        return new Promise(resolve => {
            /**
             * The `filePicker` method fires this event as a `global` event before it
             * opens the native file picker. It is a useful way for controllers to know
             * that the application will be blocked by native UI. One possible use for
             * this is to mask the viewport via {@link Ext.app.BaseController#cfg-listen listen}:
             *
             *     Ext.define('MyApp.view.viewport.ViewportController', {
             *         extend: 'Ext.app.ViewController',
             *         alias: 'controller.viewport',
             *
             *         listen: {
             *             global: {
             *                 nativemodalopen: function () {
             *                     viewport.mask();
             *                 },
             *                 nativemodalclose: function () {
             *                     viewport.unmask();
             *                 }
             *             }
             *         }
             *     });
             *
             * @event nativemodalopen
             * @param {Object} info An object describing the native modal being created.
             * @param {String} info.type The type of native dialog (for example, "filePicker").
             * @param {Object} [info.options] Where appropriate for the `info.type` value,
             * an object describing the options controlling the native dialog.
             */
            Ext.fireEvent('nativemodalopen', {
                type: 'filePicker',
                options: options
            });

            dialog[method](
                //opens as a sheet in OSX
                remote.getCurrentWindow(),
                options,
                function (result) {
                    if (result && !result.length) {
                        result = null;
                    }

                    /**
                     * The `filePicker` method fires this event as a `global` event after
                     * the native file picker has closed. It is a useful way for controllers
                     * to know that the application will be unblocked by native UI.
                     *
                     * One possible use for this is to unmask the viewport via
                     * {@link Ext.app.BaseController#cfg-listen listen}:
                     *
                     *     Ext.define('MyApp.view.viewport.ViewportController', {
                     *         extend: 'Ext.app.ViewController',
                     *         alias: 'controller.viewport',
                     *
                     *         listen: {
                     *             global: {
                     *                 nativemodalopen: function () {
                     *                     viewport.mask();
                     *                 },
                     *                 nativemodalclose: function () {
                     *                     viewport.unmask();
                     *                 }
                     *             }
                     *         }
                     *     });
                     *
                     * @event nativemodalclose
                     * @param {Object} info An object describing the native modal that was
                     * closed.
                     * @param {String} info.type The type of native dialog (for example, "filePicker").
                     * @param {Object} [info.options] Where appropriate for the `info.type` value,
                     * an object describing the options controlling the native dialog.
                     * @param {Mixed} [info.result] Where appropriate for the `info.type`
                     * value, this property holds the result produced by native the dialog.
                     */
                    Ext.fireEvent('nativemodalclose', {
                        type: 'filePicker',
                        options: options,
                        result: result
                    });

                    resolve(result);
                });
        });
    }
} else {
     return {
        requires: [
            'Ext.Class'
        ]
     }
 }

 });
