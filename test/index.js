const assert = require('assert')
const { describe, it } = require('mocha')
const { name } = require('../package.json')
const Metalsmith = require('metalsmith')

// metalsmith_default_values plugin
const plugin = require('..')
const set_defaults_lib = require('../lib/set_defaults')

describe('@metalsmith/default-values', function () {
  
  it('should export a named plugin function matching package.json name', function () {
    const namechars = name.split('/')[1]
    const camelCased = namechars.split('').reduce((str, char, i) => {
      str += namechars[i - 1] === '-' ? char.toUpperCase() : char === '-' ? '' : char
      return str
    }, '')
    assert.strictEqual(plugin().name, camelCased)
  })

  it('should not crash the metalsmith build when using default options', function (done) {
    Metalsmith(__dirname)
      .source('.')
      .use(plugin())
      .process((err) => {
        if (err) done(err)
        else done()
      })
  })
  it('sets a key when not present', function (done) {
    const ms = Metalsmith(__dirname)
      .source('./fixture')
      .use(plugin([
      {
        defaults: { default_val: true }
      },
      {
        pattern: 'file2',
        defaults: { another_default: 'hello' }
      }
    ]))
    const expected = {
      file1: {
        existing_key: 'yes',
        default_val: true
      },
      file2: {
        existing_key: 'yes',
        default_val: false,
        another_default: 'hello'
      }
    }

    function relevantProps(expected, files) {
      return Object
        .keys(expected)
        .reduce((acc, filename) => {
          acc[filename] = {}
          Object.keys(expected[filename]).forEach(prop => {
            acc[filename][prop] = files[filename] && files[filename][prop]
          })
          return acc
        }, {})
    }
  
    ms.process((err, files) => {
      assert.ifError(err, 'Has not errored')
      assert.deepStrictEqual(relevantProps(expected, files), expected)
      done()
    })
  })

  describe('set_defaults', function () {
    it('initialisation returns a function', function () {
      const actual = set_defaults_lib()

      assert.strictEqual(typeof actual, 'function', 'Function returned after initialisation')
    })

    it('sets a key when not present', function () {
      const defaults = {
        default_val: true
      }
      const set_defaults = set_defaults_lib(defaults)
      assert.strictEqual(typeof set_defaults, 'function', 'Function returned after initialisation')
      const actual = set_defaults({
        initial: 'yes'
      })
      const expected = {
        initial: 'yes',
        default_val: true
      }

      assert.deepStrictEqual(actual, expected)
    })
  })
})
