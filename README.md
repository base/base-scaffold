# base-scaffold [![NPM version](https://img.shields.io/npm/v/base-scaffold.svg?style=flat)](https://www.npmjs.com/package/base-scaffold) [![NPM downloads](https://img.shields.io/npm/dm/base-scaffold.svg?style=flat)](https://npmjs.org/package/base-scaffold) [![Build Status](https://img.shields.io/travis/node-base/base-scaffold.svg?style=flat)](https://travis-ci.org/node-base/base-scaffold)

Base plugin that adds support for generating files from declarative scaffold configurations.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install base-scaffold --save
```

## Usage

Can be used with any [base](https://github.com/node-base/base) application. See example [base applications](#base-apps).

```js
var scaffold = require('base-scaffold');
```

## Example

This example shows [generate](https://github.com/generate/generate), but this plugin can be used with any [base](https://github.com/node-base/base) application.

```js
var Generate = require('generate');
var Scaffold = require('scaffold');
var scaffold = new Scaffold();
var app = generate();

/**
 * Add a basic "target" to our scaffold. Scaffolds are like
 * grunt "tasks" and can have any number of targets
 */

scaffold.addTarget('abc', {
  options: {
    pipeline: generate.renderFile,
    data: {
      site: { title: 'My Blog' }
    }
  },
  src: 'templates/*.hbs',
  dest: 'site',
});

/**
 * Template engine for rendering handlebars templates
 */

app.engine('hbs', require('engine-handlebars'));

/**
 * Generate the scaffold!
 */

app.scaffold(scaffold)
  .on('error', console.error)
  .on('data', console.log)
  .on('end', function() {
    console.log('done!');
  });
```

See the [scaffold](https://github.com/jonschlinkert/scaffold) library for additional information.

## API

### [.scaffold](index.js#L46)

Generate files from a declarative [scaffold](https://github.com/jonschlinkert/scaffold) configuration and return a stream.

**Params**

* `scaffold` **{Object}**: Scaffold configuration object.
* `cb` **{Function}**: Optional callback function. If not passed, `.scaffoldStream` will be called and a stream will be returned.

**Example**

```js
var Scaffold = require('scaffold');
var scaffold = new Scaffold({
  options: {cwd: 'source'},
  posts: {
    src: ['content/*.md']
  },
  pages: {
    src: ['templates/*.hbs']
  }
});

app.scaffold(scaffold, function(err) {
  if (err) console.log(err);
});
```

### [.scaffoldStream](index.js#L92)

Generate files from a declarative [scaffold](https://github.com/jonschlinkert/scaffold) configuration.

**Params**

* `scaffold` **{Object}**: [scaffold](https://github.com/jonschlinkert/scaffold) configuration object.
* `returns` **{Stream}**: returns a stream with all processed files.

**Example**

```js
var Scaffold = require('scaffold');
var scaffold = new Scaffold({
  options: {cwd: 'source'},
  posts: {
    src: ['content/*.md']
  },
  pages: {
    src: ['templates/*.hbs']
  }
});

app.scaffoldStream(scaffold)
  .on('error', console.error)
  .on('end', function() {
    console.log('done!');
  });
```

## Base apps

The following projects are built on [base](https://github.com/node-base/base).

* [assemble](https://www.npmjs.com/package/assemble): Assemble is a powerful, extendable and easy to use static site generator for node.js. Used… [more](https://www.npmjs.com/package/assemble) | [homepage](https://github.com/assemble/assemble)
* [generate](https://www.npmjs.com/package/generate): Fast, composable, highly extendable project generator with a user-friendly and expressive API. | [homepage](https://github.com/generate/generate)
* [update](https://www.npmjs.com/package/update): Easily keep anything in your project up-to-date by installing the updaters you want to use… [more](https://www.npmjs.com/package/update) | [homepage](https://github.com/update/update)
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/node-base/base-scaffold/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/node-base/base-scaffold/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on May 11, 2016._