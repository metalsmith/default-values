'use strict';

const test = require('tap').test;

// TODO: Add more tests to cover edge cases

// metalsmith_default_values plugin
test('metalsmith-default-values sets a key when not present', (assert) => {
    const default_values_lib = require('../lib');

    const default_values = default_values_lib([
        {
            defaults: {default_val: true}
        },
        {
            pattern : 'file2',
            defaults: {another_default: 'hello'}
        }
    ]);
    const actual = {
        'file1': {
            existing_key: 'yes'
        },
        'file2': {
            existing_key: 'yes',
            default_val : false
        }
    };
    const expected = {
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
    default_values(actual, void 0, (err) => {
        assert.ifError(err, 'Has not errored');
        assert.isEquivalent(actual, expected, 'Defaults set where key not present');
        assert.end();
    });
});
