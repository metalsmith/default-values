'use strict'

const get = require('lodash.get')
const set = require('lodash.set')

/**
 * Sets defaults for object values
 *
 * @param {Object} defaults
 *        {'key.param': 'default_value'}
 *
 * @return {function} Takes an object and sets defaults
 */
const set_defaults = (defaults) => (item) => {
  Object.keys(defaults).forEach((key) => {
    const value = get(item, key)
    const default_value = defaults[key]

    if (value === void 0 || value === null) {
      if (typeof default_value === 'function') {
        set(item, key, default_value(item))
      } else {
        set(item, key, default_value)
      }
    }
  })
  return item
}

module.exports = set_defaults
