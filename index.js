/*!
 * base-scaffold (https://github.com/node-base/base-scaffold)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base-scaffold');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('base-scaffold')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    this.define('scaffold', function() {
      debug('running scaffold');
      
    });
  };
};
