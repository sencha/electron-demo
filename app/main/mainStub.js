var foo = 1;

module.exports = {
    foobar (from, callback) {
        console.log(`Get foobar ${foo} from ${from}`);

        if (callback) {
            setTimeout(() => {
                console.log(`Calling callback from ${process.type}`);
                callback();
            }, 2000);
        }

        return process.type + foo;
    },

    setFoo (v, from) {
        console.log(`setFoo to ${v} (was ${foo}) from ${from}`);
        foo = v;
    }
};
