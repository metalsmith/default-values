import get from 'dlv'
import { dset as set } from 'dset'

/**
 * Sets defaults for object values
 * @param {Array<Array<*>>} defaults
 * @param {'keep'|'overwrite'} strategy
 * @return {import('.').DefaultSetter} Takes an object and sets defaults
 */
function set_defaults(defaults, strategy) {
  return (item, context) => {
    defaults.forEach(([key, defaultValue]) => {
      const value = get(item, key)
      if (
        strategy === 'overwrite' ||
        value === void 0 ||
        value === null ||
        (key === 'contents' && item.contents.toString().trim().length === 0)
      ) {
        if (typeof defaultValue === 'function') defaultValue = defaultValue(item, context)
        set(item, key, defaultValue)
      }
    })
    return item
  }
}

export default set_defaults
