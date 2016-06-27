/*!
 * base-scaffold (https://github.com/node-base/base-scaffold)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function(config) {
  config = config || {};

  return function fn(app) {
    if (!utils.isValid(this, 'base-scaffold')) return;
    var Scaffold;
    var self = this;

    /**
     * Register the `base-files-each` plugin
     */

    this.use(utils.each());

    /**
     * Create the cache for storing scaffolds
     */

    this.scaffolds = this.scaffolds || {};

    /**
     * Listen for scaffolds and create tasks for the targets on each scaffold
     */

    this.on('scaffold', function(scaffold) {
      self.register(scaffold.name, function(gen) {
        var keys = Object.keys(scaffold.targets);
        keys.forEach(function(key) {
          gen.task(key, function(cb) {
            self.each(scaffold.targets[key], cb);
          });
        });
        gen.task('default', keys);
      });
    });

    /**
     * Add methods to the API
     */

    this.define({

      /**
       * Returns true if the given value is a valid `Scaffold`.
       *
       * ```js
       * app.isScaffold('foo');
       * //=> false
       *
       * var Scaffold = require('scaffold');
       * var scaffold = new Scaffold();
       * app.isScaffold(scaffold);
       * //=> true
       * ```
       * @name .isScaffold
       * @param {any} `val`
       * @return {Boolean}
       * @api public
       */

      isScaffold: utils.isScaffold,

      /**
       * Get scaffold `name` from `app.scaffolds`, or set scaffold `name` with the given
       * `config`.
       *
       * ```js
       * app.scaffold('foo', {
       *   docs: {
       *     options: {},
       *     files: {
       *       src: ['*'],
       *       dest: 'foo'
       *     }
       *   }
       * });
       *
       * // or
       * var scaffold = app.scaffold('foo');
       * ```
       * @name .scaffold
       * @param {String|Object|Function} `name`
       * @param {Object|Fucntion} `config`
       * @return {Object} Returns the app instance when setting a scaffold, or the scaffold instance when getting a scaffold.
       * @api public
       */

      scaffold: function(name, config) {
        if (!config && typeof name === 'string' || utils.isObject(name)) {
          return this.getScaffold(name);
        }

        this.setScaffold.apply(this, arguments);
        if (typeof name === 'string') {
          return this.getScaffold(name);
        }
        return this;
      },

      /**
       * Add scaffold `name` to `app.scaffolds`.
       *
       * ```js
       * app.addScaffold('foo', {
       *   docs: {
       *     options: {},
       *     files: {
       *       src: ['*'],
       *       dest: 'foo'
       *     }
       *   }
       * });
       * ```
       * @param {String} `name`
       * @param {Object|Function} `config`
       * @api public
       */

      setScaffold: function(name, config) {
        if (typeof name !== 'string') {
          throw new TypeError('expected the first argument to be a string');
        }
        if (utils.isObject(config)) {
          config.name = name;
        }
        this.emit('scaffold.set', name, config);
        this.scaffolds[name] = config;
        return this;
      },

      /**
       * Get scaffold `name` from `app.scaffolds`, or return a normalized
       * instance of `Scaffold` if an object or function is passed.
       *
       * ```js
       * var scaffold = app.getScaffold('foo');
       *
       * // or create an instance of `Scaffold` using the given object
       * var scaffold = app.getScaffold({
       *   docs: {
       *     options: {},
       *     files: {
       *       src: ['*'],
       *       dest: 'foo'
       *     }
       *   }
       * });
       * ```
       * @param {String} `name`
       * @param {Object} `options`
       * @api public
       */

      getScaffold: function(name, options) {
        var opts = utils.merge({name: name}, this.options);
        var config;

        switch (utils.typeOf(name)) {
          case 'function':
            config = name;
            break;
          case 'object':
            config = name;
            name = config.name;
            break;
          case 'string':
          default: {
            config = this.scaffolds[name];
            if (typeof config === 'undefined') {
              throw new Error(`scaffold "${name}" is not registered`);
            }
            break;
          }
        }

        if (typeof config === 'function') {
          config = config(opts);
        }

        if (!utils.isObject(config)) {
          throw new TypeError('expected config to be an object');
        }

        // if `config` is not an instance of Scaffold, make it one
        if (!this.isScaffold(config)) {
          var Scaffold = this.get('Scaffold');
          var scaffold = new Scaffold(opts);
          scaffold.options = utils.merge({}, this.options, scaffold.options, options);
          if (typeof name === 'string') {
            scaffold.name = name;
          }
          if (typeof this.run === 'function') {
            this.run(scaffold);
          }
          this.emit('scaffold', scaffold);
          scaffold.on('target', this.emit.bind(this, 'target'));
          config = scaffold.addTargets(config);
        }

        // otherwise, ensure options are merged onto the scaffold,
        // and all targets are emitted
        else {
          config.options = utils.merge({}, this.options, config.options, options);
          if (typeof name === 'string') {
            config.name = name;
          }
          if (typeof this.run === 'function') {
            this.run(config);
          }
          for (var key in config.targets) {
            if (config.targets.hasOwnProperty(key)) {
              this.emit('target', config.targets[key]);
            }
          }
          config.on('target', this.emit.bind(this, 'target'));
          this.emit('scaffold', config);
        }

        decorate(this, config);
        return config;
      }
    });

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

    this.define('scaffoldSeries', function(config, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      if (typeof cb !== 'function') {
        return this.scaffoldStream(config, options);
      }

      var scaffold = this.getScaffold(config);
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

    /**
     * Get or set the `Scaffold` constructor. Exposed as a getter/setter to allow it to be
     * customized before or after instantiation.
     *
     * ```js
     * // set
     * app.Scaffold = CustomScaffoldFn;
     *
     * // get
     * var scaffold = new app.Scaffold();
     * ```
     * @name Scaffold
     * @api public
     */

    Object.defineProperty(this, 'Scaffold', {
      configurable: true,
      set: function(val) {
        if (typeof val !== 'function') {
          throw new TypeError('expected Scaffold to be a constructor function');
        }
        Scaffold = val;
      },
      get: function() {
        var Ctor = Scaffold || this.options.Scaffold || utils.Scaffold;
        var self = this;

        if (this._scaffoldEvents === true) {
          return Ctor;
        }

        this.define('_scaffoldEvents', true);
        Ctor.on('files', function(stage, config) {
          self.emit('files', stage, config);
          if (stage === 'expanded' && self.hasListeners('node')) {
            config.files.forEach(function(node) {
              self.emit('node', node);
            });
          }
        });
        return Ctor;
      }
    });
    return fn;
  };
};

/**
 * Decorate the given scaffold with "generate" methods
 */

function decorate(app, scaffold) {
  if (typeof scaffold.generate === 'function') return;

  scaffold.define('generate', function(options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    if (typeof cb === 'function') {
      return this.generateSeries.apply(this, arguments);
    }
    return this.generateStream.apply(this, arguments);
  });

  scaffold.define('generateSeries', function(options, cb) {
    var args = [].slice.call(arguments);
    args.unshift(this);
    return app.scaffoldSeries.apply(app, args);
  });

  scaffold.define('generateStream', function() {
    var args = [].slice.call(arguments);
    args.unshift(this);
    return app.scaffoldStream.apply(app, args);
  });
}
