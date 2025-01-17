import { Buffer } from 'buffer'
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
    const delta = {}
    defaults.forEach(([key, defaultValue]) => {
      const value = get(item, key)
      if (
        strategy === 'overwrite' ||
        value === void 0 ||
        value === null ||
        (Buffer.isBuffer(value) && value.toString().trim().length === 0)
      ) {
        if (typeof defaultValue === 'function') defaultValue = defaultValue(item, context)
        if (Buffer.isBuffer(value) && !Buffer.isBuffer(defaultValue)) defaultValue = Buffer.from(defaultValue)
        set(item, key, defaultValue)
        set(delta, key, defaultValue)
      }
    })
    return delta
  }
}

export default set_defaults
