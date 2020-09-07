'use strict';

const package_name = 'metalsmith-set-defaults';
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
 * Sets default values based upon config passed
 *
 * @param  {array} config   See schema for constraints
 *
 * @return {function}       Metalmsith Plugin
 */
const default_values = (config) => (files, metalsmith, done) => {
  // Check config fits schema
  const validation = schema.validate(config, { allowUnknown: true });
  if (validation.error) {
    error('Validation failed, %o', validation.error.details[0].message);
    return done(validation.error);
  }
  // Convert string patterns to be in an array for multimatch
  config = validation.value.map((item) => {
    item.pattern = item.pattern || '*';
    item.pattern =
      typeof item.pattern === 'string' ? [item.pattern] : item.pattern;
    return item;
  });

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

module.exports = default_values;
