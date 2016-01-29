'use strict';

var debug = require('debug')('metalsmith-set-defaults:set-defaults');
var get   = require('lodash.get');
var set   = require('lodash.set');

/**
 * Sets defaults for object values
 *
 * @param {Object} defaults
 *        {'key.param': 'default_value'}
 *
 * @return {function} Takes an object and sets defaults
 */
var set_defaults = function (defaults) {
    return function (item) {
        debug('defaults: %o', defaults);
        Object.keys(defaults).forEach(function (key) {
            var value = get(item, key);

            // For more verbose debugging enable the following
            // debug('key: %s', key);
            // debug('default: %s', defaults[key]);
            // debug('value: %s', value);

            if (value === void 0 || value === null) {
                set(item, key, defaults[key]);
            }
        });
        return item;
    };
};

module.exports = set_defaults;
