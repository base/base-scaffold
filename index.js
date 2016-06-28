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
     * Create the cache for storing scaffolds
     */

    this.scaffolds = this.scaffolds || {};

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
        var opts = utils.merge({name: name}, this.options, options);
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
        return config;
      }
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
