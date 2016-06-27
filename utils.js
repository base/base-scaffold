'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('async-each-series', 'eachSeries');
require('base-files-each', 'each');
require('extend-shallow', 'extend');
require('for-own');
require('is-valid-app', 'isValid');
require('isobject', 'isObject');
require('is-scaffold');
require('kind-of', 'typeOf');
require('mixin-deep', 'merge');
require('merge-stream', 'ms');
require('scaffold', 'Scaffold');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
