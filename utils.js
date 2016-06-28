'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('is-valid-app', 'isValid');
require('isobject', 'isObject');
require('is-scaffold');
require('kind-of', 'typeOf');
require('mixin-deep', 'merge');
require('scaffold', 'Scaffold');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
