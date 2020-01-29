// jshint esversion: 6
if (typeof module !== 'undefined') {
    var atom = require('../atom.js');
}

function nat(max) {
    return Math.floor(Math.random() * Math.floor(max || 10000));
}

function inc(x) {
    return x + 1;
}

function add(a, b) {
    return a + b;
}

describe('atom', () => {
    it('should create an atom from the given value', () => {
        var ref = atom([1, 2, 3]);
        expect(atom.isAtom(ref)).toBe(true);
        expect(ref.deref()).toEqual(jasmine.arrayContaining([1, 2, 3]));
    });

    it('should accept a validator and throw an exception if given a value that fails validation', () => {
        var ref = atom([], { validator: Array.isArray });
        try {
            ref.reset(1);
            fail('it should not be able to reset to anything but an array');
        }
        catch (e) {
            expect(true).toBe(true);
        }
    });
});

describe('atom#swap', () => {
    it('should accept a function that operates and on the referenced value and returns a new value', () => {
        var ref = atom(nat());
        var n = ref.deref();
        ref.swap(inc);
        expect(ref.deref()).toBe(n + 1);
    });

    it('should take arguments for the passed function', () => {
        var ref = atom(nat());
        var a = ref.deref();
        var b = nat();
        ref.swap(add, b);
        expect(ref.deref()).toBe(a + b);
    });
});

describe('atom#addWatch', () => {
    it('should process watchers with atom#reset', () => {
        var ref = atom();
        ref.addWatch('test', (k, ref, prev, next) => {
            expect(next).toBe(5);
        });
        ref.reset(5);
    });

    it('should process watchers with atom#swap', () => {
        var ref = atom(nat());
        ref.addWatch('test', (k, ref, prev, next) => {
            expect(next).toBe(prev + 1);
        });
        ref.swap(inc);
    });
});


describe('atom#removeWatch', () => {
    it('should not process watcher with atom#reset', () => {
        var ref = atom();
        ref.addWatch('test', (k, ref, prev, next) => {
            fail('it should not trigger watcher');
        });
        ref.removeWatch('test');
        ref.reset(5);
    });

    it('should process watchers with atom#swap', () => {
        var ref = atom(nat());
        ref.addWatch('test', (k, ref, prev, next) => {
            fail('it should not trigger watcher');
        });
        ref.removeWatch('test');
        ref.swap(inc);
    });
});
