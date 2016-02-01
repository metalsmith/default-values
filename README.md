# metalsmith-default-values
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![bitHound Dependencies][bithound-badge]][bithound-url]

Metalsmith Plugin for setting default frontmatter metadata

## Installation
```bash
npm install -S metalsmith-default-values
```

*Note*: `-S` switch saves the plugin to your `package.json`.

## Usage:

### 1. Include the plugin
```js
var default_values = require('./modules/default_values.js');
```

### 2. Use the plugin in your build pipeline
```js
...
.use(default_values([
    {
        pattern : 'posts/*.md',
        defaults: {
            layout: 'post.hbs'
        }
    },
	{
		pattern : 'diary/*.md',
		defaults: {
			layout : 'diary.hbs',
			private: true
		}
	}
]))
...
```

### 3. Profit
[GL HF](http://www.urbandictionary.com/define.php?term=glhf)

# License - GPL-3.0
metalsmith-default-values is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

metalsmith-default-values is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with metalsmith-default-values.  If not, see http://www.gnu.org/licenses/.


[npm-badge]: https://img.shields.io/npm/v/metalsmith-default-values.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-default-values

[travis-badge]: https://travis-ci.org/woodyrew/metalsmith-default-values.svg?branch=master
[travis-url]: https://travis-ci.org/woodyrew/metalsmith-default-values

[bithound-badge]: https://www.bithound.io/github/woodyrew/metalsmith-default-values/badges/dependencies.svg
[bithound-url]: https://www.bithound.io/github/woodyrew/metalsmith-default-values/master/dependencies/npm
