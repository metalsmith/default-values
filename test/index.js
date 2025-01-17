/* eslint-env node, mocha */
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import assert from 'node:assert'
import path from 'node:path'

import Metalsmith from 'metalsmith'
import plugin from '../src/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { name } = JSON.parse(readFileSync(path.resolve(__dirname, '../package.json')))

let set_defaults_lib

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
  before(function (done) {
    import('../src/set_defaults.js').then((imported) => {
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

  // this is essential for CLI flows to be able to set default values in JSON
  it('converts non-buffer defaults to buffers if the target key is already a buffer', function (done) {
    const ms = Metalsmith(__dirname)
      .source('./fixture')
      .env('DEBUG', process.env.DEBUG)
      .use(
        plugin({
          pattern: 'file2',
          defaults: { contents: 'Lorem ipsum' }
        })
      )

    ms.process((err, files) => {
      if (err) done(err)
      try {
        assert(Buffer.isBuffer(files.file2.contents))
        assert.strictEqual(files.file2.contents.toString(), 'Lorem ipsum')
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
      const set_defaults = set_defaults_lib(Object.entries(defaults))
      assert.strictEqual(typeof set_defaults, 'function', 'Function returned after initialisation')
      const actual = set_defaults({
        initial: 'yes'
      })
      const expected = {
        default_val: true
      }

      assert.deepStrictEqual(actual, expected)
    })

    it('overwrites a key when strategy is "overwrite"', function () {
      const defaults = {
        initial: 'no',
        default_val: true
      }
      const set_defaults = set_defaults_lib(Object.entries(defaults), 'overwrite')
      assert.strictEqual(typeof set_defaults, 'function', 'Function returned after initialisation')
      const actual = set_defaults({
        initial: 'yes'
      })
      const expected = {
        initial: 'no',
        default_val: true
      }

      assert.deepStrictEqual(actual, expected)
    })

    it('sets a default computed from additional metadata and returns the delta', function () {
      const defaults = {
        default_val: true,
        buildVersion(file, globalMeta) {
          return globalMeta.buildVersion
        }
      }
      const set_defaults = set_defaults_lib(Object.entries(defaults))
      const actual = set_defaults({ initial: 'yes' }, { buildVersion: '1.0.0' })
      const expected = {
        default_val: true,
        buildVersion: '1.0.0'
      }

      assert.deepStrictEqual(actual, expected)
    })
  })

  // this is essential for CLI flows to be able to set default values in JSON
  it('sets a default at a key path ', function () {
    const defaults = {
      'some.nested.def.value': true
    }
    const set_defaults = set_defaults_lib(Object.entries(defaults))
    const actual = set_defaults({ initial: 'yes' })
    const expected = {
      some: {
        nested: {
          def: {
            value: true
          }
        }
      }
    }

    assert.deepStrictEqual(actual, expected)
  })
})
