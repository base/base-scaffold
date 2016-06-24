/*!
 * base-scaffold (https://github.com/node-base/base-scaffold)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function(config) {
  return function(app) {
    if (!utils.isValid(this, 'base-scaffold')) return;

    /**
     * Register `base-files-each` plugin
     */

    this.use(utils.each());

    /**
     * Asynchronously generate files from a declarative [scaffold][] configuration.
     *
     * ```js
     * var Scaffold = require('scaffold');
     * var scaffold = new Scaffold({
     *   options: {cwd: 'source'},
     *   posts: {
     *     src: ['content/*.md']
     *   },
     *   pages: {
     *     src: ['templates/*.hbs']
     *   }
     * });
     *
     * app.scaffold(scaffold, function(err) {
     *   if (err) console.log(err);
     * });
     * ```
     * @name .scaffold
     * @param {Object} `scaffold` Scaffold configuration object.
     * @param {Function} `cb` Optional callback function. If not passed, `.scaffoldStream` will be called and a stream will be returned.
     * @api public
     */

    this.define('scaffoldSeries', function(scaffold, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      if (typeof cb !== 'function') {
        return this.scaffoldStream(scaffold, options);
      }

      this.run(scaffold);
      var targets = scaffold.targets;
      var keys = Object.keys(targets);

      utils.eachSeries(keys, function(key, next) {
        if (!targets.hasOwnProperty(key)) {
          next();
          return;
        }

        var target = targets[key];
        scaffold.run(target);
        if (!target.files) {
          next();
          return;
        }
        this.each(target, options, next);
      }.bind(this), cb);
    });

    /**
     * Generate files from a declarative [scaffold][] configuration.
     *
     * ```js
     * var Scaffold = require('scaffold');
     * var scaffold = new Scaffold({
     *   options: {cwd: 'source'},
     *   posts: {
     *     src: ['content/*.md']
     *   },
     *   pages: {
     *     src: ['templates/*.hbs']
     *   }
     * });
     *
     * app.scaffoldStream(scaffold)
     *   .on('error', console.error)
     *   .on('end', function() {
     *     console.log('done!');
     *   });
     * ```
     * @name .scaffoldStream
     * @param {Object} `scaffold` [scaffold][] configuration object.
     * @return {Stream} returns a stream with all processed files.
     * @api public
     */

    this.define('scaffoldStream', function(scaffold, options, cb) {
      var streams = [];

      this.run(scaffold);
      var targets = scaffold.targets;
      for (var name in targets) {
        if (targets.hasOwnProperty(name)) {
          var target = targets[name];
          scaffold.run(target);

          if (target.files) {
            streams.push(this.eachStream(target, options));
          }
        }
      }

      var stream = utils.ms.apply(utils.ms, streams);
      stream.on('finish', stream.emit.bind(stream, 'end'));
      return stream;
    });

    // alias the `scaffoldSeries` method. We do this so that `.scaffold`
    // call be used by default, while also allowing this method to be overridden
    // and customized (this is done in `generate-scaffold`)
    this.define('scaffold', this.scaffoldSeries);
  };
};
