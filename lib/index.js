'use strict'

const package_name = '@metalsmith/default-values'
const debug_lib = require('debug')
const debug = debug_lib(package_name)

const multimatch = require('multimatch')
const set_defaults = require('./set_defaults')

/**
 * @typedef {Object} DefaultsSet
 * @property {string|string[]} pattern 1 or more glob patterns to match files
 * @property {Object} defaults an object whose keys will be set as file metadata keys
 */

/** @type {DefaultsSet} */
const defaultDefaultsSet = {
  defaults: {},
  pattern: '**'
}


/**
 * Set `defaults` to file metadata matching `pattern`s.
 *
 * @param  {DefaultsSet[]} options an array of defaults sets to add to files matched by pattern
 * @return {import('metalsmith').Plugin}
 **/

function initDefaultValues(options) {
  options = (options || []).map(defaultsSet => Object.assign({}, defaultDefaultsSet, defaultsSet))
  return function defaultValues(files, metalsmith, done) {
    debug('Running with options: %O ', options)

    // Loop through files
    Object.keys(files).forEach(function (file) {
      // Loop through configurations
      options.forEach(function (item) {
        if (!item.set_defaults) {
          // initialise set_defaults function
          item.set_defaults = set_defaults(item.defaults)
        }

        debug('Checking: %s; Against: %s', file, item.pattern)
        if (multimatch(file, item.pattern).length) {
          debug('Passed - Will set defaults if required')

          // Set defaults if required
          item.set_defaults(files[file])
        }
      })
    })

    done()
  }
}

module.exports = initDefaultValues
