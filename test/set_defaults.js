'use strict';

const test = require('tap').test;
const set_defaults_lib = require('../lib/set_defaults');

test('set-defaults initialisation returns a function', (assert) => {
    const actual = set_defaults_lib();

    assert.isEqual(typeof actual, 'function', 'Function returned after initialisation');
    assert.end();
});

test('set-defaults sets a key when not present', (assert) => {
    const defaults = {
        default_val: true
    };
    const set_defaults = set_defaults_lib(defaults);
    assert.isEqual(typeof set_defaults, 'function', 'Function returned after initialisation');
    const actual = set_defaults({
        initial: 'yes'
    });
    const expected = {
        initial    : 'yes',
        default_val: true
    };

    assert.isEquivalent(actual, expected, 'Defaults set where key not present');
    assert.end();
});
