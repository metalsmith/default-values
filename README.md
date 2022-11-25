# @metalsmith/default-values

A Metalsmith plugin for setting default values to file metadata.

[![metalsmith: core plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![ci: build][ci-badge]][ci-url]
[![code coverage][codecov-badge]][codecov-url]
[![license: GPL-3.0][license-badge]][license-url]

## Installation

NPM:

```bash
npm install @metalsmith/default-values
```

Yarn:

```bash
yarn add @metalsmith/default-values
```

## Usage:

Pass `@metalsmith/default-values` to `metalsmith.use`:

```js
import defaultValues from '@metalsmith/default-values'

// single defaults set for all HTML and markdown files
metalsmith.use({
  defaults: {
    pattern: '**/*.{html,md}',
    title: 'Lorem ipsum'
  }
})

metalsmith.use(
  defaultValues([
    {
      pattern: 'posts/*.md',
      defaults: {
        layout: 'post.hbs',
        date: function (post) {
          return post.stats.ctime
        }
      }
    },
    {
      pattern: 'diary/*.md',
      defaults: {
        layout: 'diary.hbs',
        private: true
      }
    },
    {
      pattern: ['diary/*.md', 'archive/**/*.md'],
      defaults: {
        no_index: true
      }
    },
    {
      pattern: '**/*.md',
      defaults: {
        layout: 'default.hbs'
      }
    }
  ])
)
```

### Options

`@metalsmith/default-values` takes an array of objects which specify the defaults to set for all files matching a pattern. The objects have the following properties:

- `pattern` (`string|string[]`): One or more glob patterns to match file paths. Defaults to `'**'` (all).
- `defaults` (`Object<string, any>`): An object whose key-value pairs will be added to file metadata. You can also specify a function `callback(file)` to set dynamic defaults based on other, existing file metadata.

You can pass omit the array if you only need a single defaults set `[ DefaultsSet ]`.

### Examples

#### Combining with other plugins

@metalsmith/default-values works great with other `@metalsmith` plugins. The example below attaches a collection and layout matching the parent directory for all files in the directories `services`,`products`, and `articles`:

```js
import slugify from 'slugify'
const contentTypes = ['product', 'service', 'article']

metalsmith
  .use(
    defaultValues(
      contentTypes.map((contentType) => ({
        pattern: `${contentType}s/*.md`, // pluralized
        defaults: {
          collection: `${contentType}s`, // pluralized
          bodyClass: contentType,
          layout: `${contentType}.njk`, // using jstransformer-nunjucks
          contentLength(file) {
            if (file.contents) return file.contents.toString().length
            return 0
          }
        }
      }))
    )
  )
  .use(markdown()) // @metalsmith/markdown
  .use(collections()) // @metalsmith/collections
  .use(
    layouts({
      // @metalsmith/layouts
      pattern: '**/*.html'
    })
  )
```

### Debug

To enable debug logs, set the `DEBUG` environment variable to `@metalsmith/default-values*`:

```js
metalsmith.env('DEBUG', '@metalsmith/default-values*')
```

Alternatively you can set `DEBUG` to `@metalsmith/*` to debug all Metalsmith core plugins.

### CLI usage

To use this plugin with the Metalsmith CLI, add `@metalsmith/default-values` to the `plugins` key in your `metalsmith.json` file:

```json
{
  "plugins": [
    {
      "@metalsmith/default-values": [
        {
          "pattern": "diary/*.md",
          "defaults": {
            "layout": "diary.hbs",
            "private": true
          }
        }
      ]
    }
  ]
}
```

## License

[GPL-3.0](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/@metalsmith/default-values.svg
[npm-url]: https://www.npmjs.com/package/@metalsmith/default-values
[ci-badge]: https://github.com/metalsmith/default-values/actions/workflows/test.yml/badge.svg
[ci-url]: https://github.com/metalsmith/default-values/actions/workflows/test.yml
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-core_plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[codecov-badge]: https://img.shields.io/coveralls/github/metalsmith/default-values
[codecov-url]: https://coveralls.io/github/metalsmith/default-values
[license-badge]: https://img.shields.io/github/license/metalsmith/default-values
[license-url]: LICENSE
