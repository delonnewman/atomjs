![Node.js CI](https://github.com/delonnewman/atomjs/workflows/Node.js%20CI/badge.svg)
![npm](https://img.shields.io/npm/v/@delonnewman/atom)
[![dependencies Status](https://david-dm.org/delonnewman/atomjs/status.svg)](https://david-dm.org/delonnewman/atomjs)
[![devDependencies Status](https://david-dm.org/delonnewman/atomjs/dev-status.svg)](https://david-dm.org/delonnewman/atomjs?type=dev)

# Atom.js

Shared, synchronous, independent state--Clojure Atoms for Javascript. A fork of [js-atom](https://github.com/cjohansen/js-atom).

# Rational

Immutable values require some sort of external state management in order for
your app to change state. One option is to use variables in scope to hold the
current state of your app:

```js
function startApp(root) {
    var data;

    function render() {
        React.renderComponent(AppUI(data), root);
    }

    pollForData(function (newData) {
        data = newData;
        render();
    });

    // ...
}
```

This sort of works, but quickly becomes unwieldy. Atoms offer a formal mechanism
for maintaining a single mutable reference. An atom is used to hold the current
state. It offers a small API for changing (or replacing) this state, subscribing
to changes, and for validating state changes.

```js
function startApp(root) {
    var state = atom({});

    function render() {
        React.renderComponent(AppUI(state.deref()), root);
    }

    // Render when the state changes
    state.addWatch("poll-update", render);

    pollForNewData(function (newData) {
        state.reset(newData);
    });

    // ...
}
```

# Immutability

Atoms are most useful when containing immutable values, but there's nothing
stopping you from sticking whatever you want in them. If you put a mutable value
in the atom, you either have to make sure you don't actually mutate it, or lose
some of the benefits (e.g. being able to trust past versions of the state).

# API

The API is designed to mirror Clojure's atoms as closely as possible. Because
atoms are references, and not values, I didn't see any problems with defining
the API as methods on the atom object.

## atom(val[, options])

Creates a new atom wrapping the provided value. `options` is optional, and
currently only supports one option: `validator`:

```js
var atom = require("atom");
var ref = atom([], { validator: Array.isArray });

atom.reset([1, 2, 3]); // OK
atom.reset({}); // Throws exception
```


## atom.isAtom(val)

Returns true if `val` is an atom instance otherwise returns false.


## atom#deref() 

(aliased as `atom.deref(value)`)

Returns the contained value.


## atom#reset(val)

Replace the current state with a new value


## atom#swap(fn[, ...])

Update the state by applying the function to the current value, and setting the
return value as the new value of the atom. Any additional arguments are passed
to the function as well, after the atom value, e.g.: `atom.swap(fn, 1, 2, 3)`
will replace the current value with what is returned from
`fn(atomValue, 1, 2, 3)`.

## atom#compareAndSet(oldValue, newValue)

Atomically sets the value of atom to newval if and only if the
current value of the atom is identical to oldval. Returns true if
set happened, else false.

## atom#addWatch(key, function (key, ref, old, new) {})

Add a function that will be called whenever the atom value changes. The key is
just a string identifying this watcher - it can be used to remove the watcher
again. The callback is called with four arguments whenever the state changes
(e.g. with `reset` or `swap`):

- `key` - The key used to register the watcher
- `ref` - The atom reference
- `old` - The previous value
- `new` - The new value


## atom#removeWatch(key)

Removes the previously added watcher.

## atom#toString

Prints a useful string representation of the contents of the atom.

License
=======

Copyright © 2014, 2019 Christian Johansen, Delon Newman.

See [LICENSE](LICENSE)
