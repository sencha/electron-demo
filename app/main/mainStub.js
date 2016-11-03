var value = 1;

module.exports = {
    // This method is called from the "render" process via the "remote" module.
    // We are passed a value and a callback function. The return value of this
    // method is returned *synchronously* to the render process. The callback
    // is called later asynchronously.
    //
    invoke (from, callback) {
        console.log(`[mainStub] Get foobar ${value} from ${from}`);

        if (callback) {
            setTimeout(() => {
                console.log(`[mainStub] Calling callback from ${process.type}`);
                callback();
            }, 2000);
        }

        return process.type + value;
    },

    // This method is called from the main ("browser") process and simply stores
    // some data. This is to demonstrate that the remote call uses the same
    // module and its data (instead of instantiating the module in the render
    // process).
    //
    setup (v, from) {
        console.log(`[mainStub] setup to ${v} (was ${value}) from ${from}`);
        value = v;
    }
};
