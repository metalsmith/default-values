# @metalsmith/default-values

A Metalsmith plugin for setting default values to file metadata.

[![metalsmith: core plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![ci: build][ci-badge]][ci-url]
[![code coverage][codecov-badge]][codecov-url]
[![license: LGPL-3.0][license-badge]][license-url]

## Features

- sets default values for metadata keys and file contents on files matched by pattern
- does not overwrite or transform key values that are already defined, unless `strategy: 'overwrite'`.
- can set computed defaults based on other file keys or metalsmith metadata

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
    pattern: '**/*.md',
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

`@metalsmith/default-values` takes an array of defaults sets or a single defaults set. The defaults set has the following properties:

- `pattern` (`string|string[]`): One or more glob patterns to match file paths. Defaults to `'**'` (all).
- `defaults` (`Object<string, any>`): An object whose key-value pairs will be added to file metadata. You can also specify a function `callback(file, metadata)` to set dynamic defaults based on existing file or global metadata.
- `strategy` (`'keep'|'overwrite'`): Strategy to handle setting defaults to keys that are aleady defined.

### Examples

#### Setting defaults at a keypath

You can set a default at a file's nested keypath:

```js
metalsmith.use(
  defaultValues({
    pattern: '**/*.md',
    pubdate(file) { return new Date() }
    'config.scripts.app': '/app.js',
  })
)
```

#### Setting default contents

You can set a file's default contents (which is a Node buffer) and any other Buffer properties:

```js
metalsmith.use(
  defaultValues({
    pattern: '**/*.md',
    strategy: 'overwrite',
    contents: Buffer.from('TO DO')
  })
)
```

When using a JSON config, a string can be used as default and it will automatically be transformed into a buffer.

#### Setting dynamic defaults

You can set dynamic defaults based on current file metadata or metalsmith metadata:

```js
metalsmith
  .metadata({
    build: { timestamp: Date.now() }
  })
  .use(
    defaultValues([
      {
        strategy: 'overwrite',
        defaults: {
          buildInfo(file, metadata) {
            return metadata.build
          },
          excerpt(file) {
            return file.contents.toString().slice(0, 200)
          }
        }
      }
    ])
  )
```

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

[LGPL-3.0 or later](LICENSE)

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
