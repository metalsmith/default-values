/* eslint-env node, mocha */

const assert = require('assert')
const { describe, it } = require('mocha')
const { name } = require('../package.json')
const Metalsmith = require('metalsmith')

// metalsmith_default_values plugin
const plugin = require('..')
let set_defaults_lib
const path = require('path')

function relevantProps(expected, files) {
  return Object.keys(expected).reduce((acc, filename) => {
    acc[filename] = {}
    Object.keys(expected[filename]).forEach((prop) => {
      acc[filename][prop] = files[filename] && files[filename][prop]
      if (acc[filename][prop] instanceof Buffer) acc[filename][prop] = acc[filename][prop].toString()
    })
    return acc
  }, {})
}

describe('@metalsmith/default-values', function () {
  before(function(done) {
    // eslint-disable-next-line import/no-internal-modules
    import('../src/set_defaults.js').then(imported => {
      set_defaults_lib = imported.default
      done()
    })
  })

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
      .env('DEBUG', process.env.DEBUG)
      .use(plugin())
      .process((err) => {
        if (err) done(err)
        else done()
      })
  })
  it('sets a key when not present', function (done) {
    const ms = Metalsmith(__dirname)
      .source('./fixture')
      .env('DEBUG', process.env.DEBUG)
      .use(
        plugin([
          {
            defaults: { default_val: true }
          },
          {
            pattern: 'file2',
            defaults: { another_default: 'hello' }
          }
        ])
      )
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

    ms.process((err, files) => {
      assert.ifError(err, 'Has not errored')
      assert.deepStrictEqual(relevantProps(expected, files), expected)
      done()
    })
  })

  it('logs a warning when no files match a pattern', function (done) {
    let warning
    function Debugger() {}
    Debugger.warn = (msg) => {
      warning = msg
    }
    Debugger.info = () => {}

    const msStub = {
      match() {
        return []
      },
      debug() {
        return Debugger
      }
    }

    plugin([
      {
        pattern: 'non-existant',
        defaults: { wontbeset: 1 }
      }
    ])({}, msStub, () => {
      try {
        assert.strictEqual(warning, 'No matches for pattern "%s"')
      } catch (err) {
        done(err)
      }
      done()
    })
  })

  it('supports defining a function to return default value', function (done) {
    const ms = Metalsmith(__dirname)
      .source('./fixture')
      .env('DEBUG', process.env.DEBUG)
      .use(
        plugin([
          {
            pattern: 'func',
            defaults: {
              computedDefault({ funcDefault }) {
                return funcDefault + 100
              }
            }
          }
        ])
      )
    const expected = {
      func: {
        funcDefault: 1,
        computedDefault: 101
      }
    }

    ms.process((err, files) => {
      if (err) done(err)
      try {
        assert.deepStrictEqual(relevantProps(expected, { func: files.func }), expected)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('allows passing a single defaults set as shorthand', function (done) {
    const ms = Metalsmith(__dirname)
      .source('./fixture')
      .env('DEBUG', process.env.DEBUG)
      .use(
        plugin({
          defaults: { all: 'ok' }
        })
      )
    const expected = {
      file1: { all: 'ok' },
      file2: { all: 'ok' },
      func: { all: 'ok' }
    }

    expected[path.join('nested', 'index')] = { all: 'ok' }

    ms.process((err, files) => {
      if (err) done(err)
      try {
        assert.deepStrictEqual(relevantProps(expected, files), expected)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('allows setting default contents when empty buffer', function (done) {
    const ms = Metalsmith(__dirname)
      .source('./fixture')
      .env('DEBUG', process.env.DEBUG)
      .use(
        plugin({
          pattern: 'file*',
          defaults: { contents: Buffer.from('Lorem ipsum') }
        })
      )

    ms.process((err, files) => {
      if (err) done(err)
      try {
        const expected = {
          file1: { contents: 'Hello world' },
          file2: { contents: 'Lorem ipsum' }
        }
        assert.deepStrictEqual(relevantProps(expected, files), expected)
        done()
      } catch (err) {
        done(err)
      }
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
