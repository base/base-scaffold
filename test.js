'use strict';

require('mocha');
var assert = require('assert');
var scaffold = require('./');

describe('base-scaffold', function() {
  it('should export a function', function() {
    assert.equal(typeof scaffold, 'function');
  });

  it('should export an object', function() {
    assert(scaffold);
    assert.equal(typeof scaffold, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      scaffold();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
