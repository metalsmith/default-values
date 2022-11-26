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
    if (value === void 0 || value === null || (key === 'contents' && item.contents.toString().trim().length === 0)) {
      let default_value = defaults[key]
      if (typeof defaults[key] === 'function') default_value = default_value(item)
      set(item, key, default_value)
    }
  })
  return item
}

module.exports = set_defaults
