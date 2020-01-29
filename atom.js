(function() {

    function alwaysValid() {
        return true;
    }

    function Atom(val, options) {
        var watchers = {};
        var validator = options && options.validator || alwaysValid;

        function transition(next) {
            if (!validator(next)) {
                var err = new Error(next + " failed validation");
                err.name = "AssertionError";
                throw err;
            }

            var prev = val;
            val = next;

            Object.keys(watchers).forEach(function (k) {
                watchers[k].call(null, k, atom, prev, next);
            });
        }

        this.addWatch = function (key, fn) {
            watchers[key] = fn;
        };

        this.removeWatch = function (key) {
            delete watchers[key];
        };

        this.swap = function (fn) {
            var args = [val].concat([].slice.call(arguments, 1));
            transition(fn.apply(null, args));
        };

        this.reset = function (v) {
            transition(v);
        };

        this.deref = function () {
            return val;
        };

        this.toString = function () {
            return "Atom(" + JSON.stringify(val) + ")";
        };
    }

    function atom(val, options) {
        return new Atom(val, options);
    }

    atom.deref = function(ref) {
        return ref.deref();
    };

    atom.isAtom = function(val) {
        return val instanceof Atom;
    };

    if (module.exports !== void(0)) {
        module.exports = atom;
    }
    else {
        this.atom = atom;
    }

}).call(this);
