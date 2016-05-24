'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('async-each-series', 'eachSeries');
require('base-files-each', 'each');
require('is-registered');
require('is-valid-instance');
require('merge-stream', 'ms');
require = fn;

utils.isValid = function(app) {
  if (!utils.isValidInstance(app)) {
    return false;
  }
  if (utils.isRegistered(app, 'base-scaffold')) {
    return false;
  }
  return true;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
