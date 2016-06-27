'use strict';

var forOwn = require('for-own');
var scaffold = require('./');

module.exports = function(app) {
  app.use(scaffold());

  this.scaffold('one', {
    options: {},
    files: {
      src: ['*.*'],
      dest: 'one'
    }
  });

  app.register('abc', function() {
    this.scaffold('local', {
      docs: {
        options: {},
        files: {
          options: {dot: true},
          src: ['*.*'],
          dest: 'docs'
        }
      },
      site: {
        options: {},
        files: {
          src: ['*.*'],
          dest: 'site'
        }
      }
    });
  });
};
