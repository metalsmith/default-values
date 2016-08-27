'use strict';

var debug_lib    = require('debug');
var debug        = debug_lib('metalsmith-set-defaults');
var error        = debug_lib('metalsmith-set-defaults:error');
var multimatch   = require('multimatch');
var Joi          = require('joi');
var set_defaults = require('./set_defaults');

var schema = Joi.array().min(1).items(
    Joi.object().keys({
        pattern : [Joi.array().min(1), Joi.string()],
        defaults: Joi.object().min(1)
    })
);

/**
 * Sets default values based upon config
 *
 * @return {function}
 */

var default_values = function (config) {
    return function (files, metalsmith, done) {
        // Check config fits schema
        var schema_err;
        schema.validate(config, function (err, value) {
            if (err) {
                error('Validation failed, %o', err.details[0].message);
                schema_err = err;
            }
            // Convert string patterns to be in an array for multimatch
            config = value.map(function (item) {
                item.pattern = item.pattern || '*';
                item.pattern = (typeof item.pattern === 'string') ? [item.pattern] : item.pattern;
                return item;
            });
        });
        if (schema_err) {
            return done(schema_err);
        }
        debug('config: ', config);

        // Loop through files
        Object.keys(files).forEach(function (file) {
            // Loop through configurations
            config.forEach(function (item) {
                if (!item.set_defaults) {
                    // initialise set_defaults function
                    item.set_defaults = set_defaults(item.defaults);
                }

                debug('Checking: %s; Against: %s', file, item.pattern);
                if (multimatch(file, item.pattern).length) {
                    debug('Passed - Will set defaults if required');

                    // Set defaults if required
                    item.set_defaults(files[file]);
                }
            });
        });

        return done();
    };
};

module.exports = default_values;
