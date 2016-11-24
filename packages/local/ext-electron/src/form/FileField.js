/**
 * This component is similar to the browser file field but uses the native file picker.
 *
 *     Ext.create({
 *         xtype: 'electronfilefield',
 *
 *         // allow the user to only select a file from `baseDir`
 *         baseDir: 'Macintosh HD/Users/MyName/Documents',
 *
 *         listeners: {
 *             pathselect: function (field, path) {
 *                 console.log(path);  // logs the path of the selected file
 *             }
 *         }
 *     });
 */
if(window && window.process) {
Ext.define('Ext.electron.form.FileField', function () {
    
    var Path = require('path');
    return {
        extend: 'Ext.form.field.Text',
        xtype: 'electronfilefield',

        config: {
            /**
             * @cfg {String} baseDir
             * The base directory for the file selection. If a `rootDir` is also specified,
             * this path must be a sub-folder of `rootDir`.
             */
            baseDir: null,

            /**
             * @cfg {String} defaultName
             * When provided, this name is appended to file picker selections.
             */
            defaultName: null,

            /**
             * @cfg {Boolean} normalize
             * Pass `true` to convert all path separators to '/'.
             */
            normalize: null,

            /**
             * @cfg {Boolean} relative
             * When `true`, the file path is maintained relative to `baseDir` (if it is
             * specified) or `rootDir` (if it is specified). If neither are specified, this
             * config is ignored. If both `baseDir` and `rootDir` are specified, paths are
             * maintained relative to `baseDir`.
             */
            relative: null,

            /**
             * @cfg {String} rootDir
             * An optional directory that limits file selection to a particular file system
             * sub-path.
             */
            rootDir: null,

            suffix: null,

            /**
             * @cfg {Object} options
             * The options passed in to {@link Ext.electron.Dialog#method!filePicker} method.
             */
            options: {
                title: 'Select File',
                properties: [
                    'openFile'
                ]
            },


            absoluteSubPath: false
        },

        triggers: {
            pick: {
                cls: 'x-fa fa-folder-open-o',
                handler (field) {
                    field.showDialog();
                }
            }
        },

        separator: Path.sep,

        resolvePath (location) {
            var me = this,
                defaultName = me.defaultName,
                rootDir = me.rootDir,
                baseDir = me.baseDir || rootDir,
                relative = me.relative,
                separator = me.separator,
                ch, i;

            if (!Path.isAbsolute(location)) {
                if (!baseDir) {
                    return location;  // relative path w/o base... shrug
                }
                location = Path.resolve(baseDir, location);
            }

            if (rootDir && location !== rootDir) {
                i = rootDir.length;
                if (location.length < i || !location.startsWith(rootDir)) {
                    return false;
                }

                ch = rootDir.charAt(i - 1);

                if (ch !== '/' && ch !== separator) {
                    // If rootDir does not end in a / (or \ on Windows), make sure the
                    // location has a separator at that index. Catches situations like:
                    //
                    //      rootDir  = '/foo/bar'
                    //      location = '/foo/barf'
                    //
                    ch = location.charAt(i);
                    if (ch !== '/' && ch !== separator) {
                        return false;
                    }
                }
            }

            if (baseDir && relative) {
                location = Path.relative(baseDir, location);
            }

            if (defaultName && defaultName !== Path.basename(location)) {
                location = Path.join(location, defaultName);
            }

            if (me.normalize) {
                location = location.replace(/[\\]/g, '/');
            }

            if (me.absoluteSubPath) {
                location = '/' + location;
            }

            return location;
        },

        setLocation (location) {
            var me = this,
                value = me.resolvePath(location),
                rootDir = me.rootDir;

            if (value === false) {
                Ext.Msg.alert('Invalid selection',
                    'Selection is limited to: ' + Ext.htmlEncode(rootDir));
            }
            else {
                me.setValue(value);
            }

            return value;
        },

        showDialog () {
            var me = this,
                options = {},
                value = me.getValue(),
                baseDir = me.baseDir || me.rootDir;

            if (value) {
                if (baseDir) {
                    value = Path.resolve(baseDir, value);
                }
                options.defaultPath = value;
            }

            options = Ext.apply(options, me.getOptions());

            me.dialogOpen = true;

            Ext.electron.Dialog.filePicker(options).then(function (selected) {
                me.dialogOpen = false;

                var path = selected && selected[0],
                    suffix = me.getSuffix(),
                    value;

                if (path) {
                    if (suffix) {
                        path = Path.join(path, suffix);
                    }

                    value = me.setLocation(path);
                    if (value !== false) {
                        me.fireEvent('pathselect', me, value);
                    }
                }
            });
        }
    }
});
} else {
 Ext.define('Ext.electron.form.FileField', {});
}
