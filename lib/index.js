'use strict';

var debug        = require('debug')('metalsmith-set-defaults');
var multimatch   = require('multimatch');
var Joi          = require('joi');
var set_defaults = require('./set_defaults');

var schema = Joi.array().min(1).items(
    Joi.object().keys({
        pattern : [Joi.string(), Joi.array().min(1)],
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
        schema.validate(config, function (err) {
            if (err) {
                return done(err);
            }
        });

        Object.keys(files).forEach(function (file) {
            config.forEach(function (item) {
                item.pattern = item.pattern || '*';
                debug('Checking: %s; Against: %s', file, item.pattern);
                if (multimatch(file, item.pattern).length) {
                    debug('Passed - Will set defaults if required');
                    if (!item.set_defaults) {
                        // initialise set_defaults function
                        item.set_defaults = set_defaults(item.defaults);
                    }

                    // Set defaults if required
                    item.set_defaults(files[file]);
                }
            });
        });

        done();
    };
};

module.exports = default_values;
