import get from 'lodash.get'
import set from 'lodash.set'

/**
 * Sets defaults for object values
 * @param {Object<string, *>} defaults
 * @return {function} Takes an object and sets defaults
 */
function set_defaults(defaults) {
  return (item) => {
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
}

export default set_defaults
