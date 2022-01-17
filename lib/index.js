'use strict';

const package_name = '@metalsmith/default-values';
const debug_lib = require('debug');
const debug = debug_lib(package_name);
const error = debug_lib(`${package_name}:error`);

const multimatch = require('multimatch');
const Joi = require('joi');
const set_defaults = require('./set_defaults');

const schema = Joi.array()
  .min(1)
  .items(
    Joi.object().keys({
      pattern: [Joi.array().min(1), Joi.string()],
      defaults: Joi.object().min(1),
    })
  );

/**
 * @typedef {Object} DefaultsSet 
 * @property {string|string[]} pattern 1 or more glob patterns to match files
 * @property {Object} defaults an object whose keys will be set as file metadata keys
 */

/**
 * Set `defaults` to file metadata matching `pattern`s.
 *
 * @param  {DefaultsSet[]} options an array of defaults sets to add to files matched by pattern
 * @return {import('metalsmith').Plugin}
 **/

function initDefaultValues(options) {
  return function defaultValues(files, metalsmith, done) {
    // Check config fits schema
    const validation = schema.validate(options, { allowUnknown: true });
    console.log(validation)
    if (validation.error) {
      error('Validation failed, %o', validation.error.details[0].message);
      return done(validation.error);
    }
    // Convert string patterns to be in an array for multimatch
    options = validation.value.map((item) => {
      item.pattern = item.pattern || '*';
      item.pattern =
        typeof item.pattern === 'string' ? [item.pattern] : item.pattern;
      return item;
    });

    debug('options: ', options);

    // Loop through files
    Object.keys(files).forEach(function (file) {
      // Loop through configurations
      options.forEach(function (item) {
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

    done();
  };
};

module.exports = initDefaultValues;
