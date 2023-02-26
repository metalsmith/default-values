import getDefaultsSetter from './set_defaults.js'

/**
 * @typedef {Object} DefaultsSet
 * @property {string|string[]} [pattern="**"] 1 or more glob patterns to match files. Defaults to `'**'` (all).
 * @property {Object} [defaults={}] an object whose keys will be set as file metadata keys
 * @property {'keep'|'overwrite'} strategy Strategy to handle setting defaults to keys that are aleady defined.
 */

/** @type {DefaultsSet} */
const defaultDefaultsSet = {
  defaults: {},
  strategy: 'keep',
  pattern: '**'
}

/**
 * Set `defaults` to file metadata matching `pattern`'s.
 *
 * @param  {DefaultsSet|DefaultsSet[]} options an array of defaults sets to add to files matched by pattern
 * @return {import('metalsmith').Plugin}
 * 
 * @example
 * metalsmith.use(defaultValues({
    pattern: 'posts/*.md',
    defaults: {
      layout: 'post.hbs',
      draft: false,
      date(post) {
        return post.stats.ctime
      }
    }
  }))
 **/

function defaultValues(options) {
  return function defaultValues(files, metalsmith, done) {
    const debug = metalsmith.debug('@metalsmith/default-values')
    debug('Running with options: %O ', options)
    if (!Array.isArray(options) && typeof options === 'object' && options !== null) {
      options = [options]
    }
    const defaultSets = (options || []).map((defaultsSet) => Object.assign({}, defaultDefaultsSet, defaultsSet))

    // Loop through configurations
    defaultSets.forEach(function ({ pattern, defaults, strategy }) {
      const matches = metalsmith.match(pattern, Object.keys(files))
      const defaultsEntries = Object.entries(defaults)
      debug.info('Matched %s files to pattern "%s": %o', matches.length, pattern, matches)
      if (matches.length) {
        const setDefaults = getDefaultsSetter(defaultsEntries, strategy)
        matches.forEach((file) => {
          setDefaults(files[file])
          debug.info(
            'Defaults set for file "%s", the resulting metadata is: %O',
            file,
            Object.keys(defaults).reduce((resulting, prop) => {
              resulting[prop] = files[file][prop]
              return resulting
            }, {})
          )
        })
      } else {
        debug.warn('No matches for pattern "%s"', pattern)
      }
    })

    done()
  }
}

export default defaultValues
