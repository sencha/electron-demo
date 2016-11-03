/**
 * This class wraps an [Electron menu](http://electron.atom.io/docs/api/menu/). The
 * `{@link #property!menu menu}` property holds the actual menu instance.
 */
Ext.define('Ext.electron.menu.Menu', {
    map: null,

    constructor (name, menu) {
        /**
         * @property {String} name
         * The name of this menu as managed by `Ext.electron.menu.Manager`.
         */
        this.name = name;

        /**
         * @property {Menu} menu
         * The [Electron menu](http://electron.atom.io/docs/api/menu/) instance.
         */
        this.menu = menu;
    },

    /**
     * This method returns the [menu](http://electron.atom.io/docs/api/menu/) or
     * [menu item](http://electron.atom.io/docs/api/menu-item/) given an `id`.
     *
     * @param {String} id
     * @return {Menu/MenuItem}
     */
    get (id) {
        var map = this.map;

        if (!map) {
            this.map = map = {};

            this._scan(this.menu);
        }

        return map[id] || null;
    },

    _scan (menu) {
        for (let item of menu.items) {
            if (item.id) {
                this.map[item.id] = item;
            }

            if (item.submenu) {
                this._scan(item.submenu);
            }
        }
    }
});
