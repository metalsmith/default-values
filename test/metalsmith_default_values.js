'use strict';

var test = require('tape');

// TODO: Add more tests to cover edge cases

// metalsmith_default_values plugin
test('metalsmith-default-values sets a key when not present', function (assert) {
    var default_values_lib = require('../lib');

    var default_values = default_values_lib([
        {
            defaults: {default_val: true}
        },
        {
            pattern : 'file2',
            defaults: {another_default: 'hello'}
        }
    ]);
    var actual = {
        'file1': {
            existing_key: 'yes'
        },
        'file2': {
            existing_key: 'yes',
            default_val : false
        }
    };
    var expected = {
        'file1': {
            existing_key: 'yes',
            default_val : true
        },
        'file2': {
            existing_key   : 'yes',
            default_val    : false,
            another_default: 'hello'
        }
    };
    default_values(actual, void 0, function (err) {
        assert.ifError(err, 'Has not errored');
        assert.isEquivalent(actual, expected, 'Defaults set where key not present');
        assert.end();
    });
});
