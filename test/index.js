const assert = require('assert');
const { describe, it } = require('mocha');

// metalsmith_default_values plugin
const default_values_lib = require('..');
const set_defaults_lib = require('../lib/set_defaults');

describe('@metalsmith/default-values', function() {
  it('sets a key when not present', function(done) {
    const default_values = default_values_lib([
      {
        defaults: { default_val: true },
      },
      {
        pattern: 'file2',
        defaults: { another_default: 'hello' },
      },
    ]);
    const actual = {
      file1: {
        existing_key: 'yes',
      },
      file2: {
        existing_key: 'yes',
        default_val: false,
      },
    };
    const expected = {
      file1: {
        existing_key: 'yes',
        default_val: true,
      },
      file2: {
        existing_key: 'yes',
        default_val: false,
        another_default: 'hello',
      },
    };
    default_values(actual, void 0, (err) => {
      assert.ifError(err, 'Has not errored');
      assert.deepStrictEqual(actual, expected);
      done()
    });
  });

  describe('set_defaults', function() {
    it('initialisation returns a function', function() {
      const actual = set_defaults_lib();

      assert.strictEqual(
        typeof actual,
        'function',
        'Function returned after initialisation'
      );
    });

    it('sets a key when not present', function() {
      const defaults = {
        default_val: true,
      };
      const set_defaults = set_defaults_lib(defaults);
      assert.strictEqual(
        typeof set_defaults,
        'function',
        'Function returned after initialisation'
      );
      const actual = set_defaults({
        initial: 'yes',
      });
      const expected = {
        initial: 'yes',
        default_val: true,
      };

      assert.deepStrictEqual(actual, expected);
    });
  });
});