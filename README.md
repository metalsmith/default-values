# Metalsmith Default Values

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![code style: prettier][prettier-badge]][prettier-url]

[![Known Vulnerabilities][snyk-badge]][synk-url]
[![NSP Status][nsp-badge]][nsp-url]

Metalsmith Plugin for setting default front-matter metadata.

Uses [multimatch](https://github.com/sindresorhus/multimatch#multimatch-) for pattern matching.

## Installation

```bash
npm install -S metalsmith-default-values
```

_Note_: `-S` switch saves the plugin to your `package.json`.

## Usage:

### 1. Include the plugin

```js
const default_values = require('metalsmith-default-values');
```

### 2. Use the plugin in your build pipeline

```js
...
.use(default_values([
  {
    pattern : 'posts/*.md',
    defaults: {
      layout: 'post.hbs',
      date: function (post) {
        return post.stats.ctime;
      }
    }
  },
  {
    pattern : 'diary/*.md',
    defaults: {
      layout : 'diary.hbs',
      private: true
    }
  },
  {
    pattern : [
      'diary/*.md',
      'archive/**/*.md'
    ],
    defaults: {
      no_index: true
    }
  },
  {
    pattern : '**/*.md',
    defaults: {
      layout : 'default.hbs'
    }
  }
]))
...
```

### 3. Profit

[GL HF](http://www.urbandictionary.com/define.php?term=glhf)

## Node versions

Because [Joi](https://github.com/hapijs/joi/) > `v6` uses ES6 syntax this runs on NodeJS `v4` and above.

## Contributions

Make sure you have [EditorConfig plugin](http://editorconfig.org/#download) for your editor.

`npm test` runs the tests, also uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)

# License - GPL-3.0

metalsmith-default-values is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

metalsmith-default-values is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with metalsmith-default-values. If not, see http://www.gnu.org/licenses/.

[npm-badge]: https://img.shields.io/npm/v/metalsmith-default-values.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-default-values
[travis-badge]: https://travis-ci.org/woodyrew/metalsmith-default-values.svg?branch=master
[travis-url]: https://travis-ci.org/woodyrew/metalsmith-default-values
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[snyk-badge]: https://snyk.io/test/github/woodyrew/metalsmith-default-values/badge.svg
[synk-url]: https://snyk.io/test/github/woodyrew/metalsmith-default-values
[nsp-badge]: https://nodesecurity.io/orgs/woodyrew/projects/14b90fd0-d8f1-4156-8e1c-d690a8c4f197/badge
[nsp-url]: https://nodesecurity.io/orgs/woodyrew/projects/14b90fd0-d8f1-4156-8e1c-d690a8c4f197
