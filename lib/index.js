'use strict'

const debug = require('debug')('@metalsmith/default-values')
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
  const defaultSets = (options || []).map(defaultsSet => Object.assign({}, defaultDefaultsSet, defaultsSet))
  return function defaultValues(files, metalsmith, done) {
    debug('Running with options: %O ', options)

    // Loop through configurations
    defaultSets.forEach(function ({ pattern, defaults }) {
      const matches = metalsmith.match(pattern)
      debug('Matched %s files to pattern %s: %o', matches.length, pattern, matches)
      if (matches.length) {
        matches.forEach(file => {
          set_defaults(defaults)(files[file])
          debug('Defaults set for file %s, the resulting metadata is: %O', file, Object.keys(defaults).reduce((resulting, prop) => {
            resulting[prop] = files[file][prop]
            return resulting
          }, {}))
        })
      }
    })

    done()
  }
}

module.exports = initDefaultValues
