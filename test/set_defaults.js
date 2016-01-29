'use strict';

var test = require('tape');
var set_defaults_lib = require('../lib/set_defaults');

test('set-defaults initialisation returns a function', function (assert) {
    var actual = set_defaults_lib();

    assert.end();
    assert.isEqual(typeof actual, 'function', 'Function returned after initialisation');
});

test('set-defaults sets a key when not present', function (assert) {
    var defaults = {
        default_val: true
    };
    var set_defaults = set_defaults_lib(defaults);
    assert.isEqual(typeof set_defaults, 'function', 'Function returned after initialisation');
    var actual = set_defaults({
        initial: 'yes'
    });
    var expected = {
        initial    : 'yes',
        default_val: true
    };

    assert.isEquivalent(actual, expected, 'Defaults set where key not present');
    assert.end();
});
