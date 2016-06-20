'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('async-each-series', 'eachSeries');
require('base-files-each', 'each');
require('is-valid-app', 'isValid');
require('merge-stream', 'ms');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
