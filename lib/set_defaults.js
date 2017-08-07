'use strict';

const debug = require('debug')('metalsmith-set-defaults:set-defaults');
const get   = require('lodash.get');
const set   = require('lodash.set');

/**
 * Sets defaults for object values
 *
 * @param {Object} defaults
 *        {'key.param': 'default_value'}
 *
 * @return {function} Takes an object and sets defaults
 */
const set_defaults = (defaults) => (item) => {
    debug('defaults: %o', defaults);
    Object.keys(defaults).forEach((key) => {
        const value = get(item, key);

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

module.exports = set_defaults;
