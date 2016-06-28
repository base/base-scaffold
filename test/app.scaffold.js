'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Scaffold = require('scaffold');
var isObject = require('isobject');
var scaffolds = require('..');
var App = require('base-app');
var app, scaffold;

describe('.scaffold', function() {
  beforeEach(function() {
    app = new App({isApp: true});
    app.use(scaffolds());
  });

  describe('return value', function() {
    it('should return an instance of Scaffold', function() {
      scaffold = app.scaffold({foo: {src: 'b.txt'}});
      assert(scaffold instanceof Scaffold);
    });
  });

  describe('properties', function() {
    it('should set `scaffold.name` when defined as a function', function() {
      scaffold = app.scaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });
      assert.strictEqual(scaffold.name, 'abc');
    });

    it('should set `scaffold.name` when defined as a function with an instance of Scaffold', function() {
      scaffold = app.scaffold('abc', function(options) {
        return new Scaffold({
          options: options,
          foo: {src: 'b.txt'}
        });
      });
      assert.strictEqual(scaffold.name, 'abc');
    });

    it('should set `scaffold.name` when defined as a plain object', function() {
      scaffold = app.scaffold('abc', {foo: {src: 'b.txt'}});
      assert.strictEqual(scaffold.name, 'abc');
    });

    it('should set `scaffold.name` when defined as an instance of Scaffold', function() {
      scaffold = app.scaffold('abc', new Scaffold({foo: {src: 'b.txt'}}));
      assert.strictEqual(scaffold.name, 'abc');
    });
  });

  describe('events', function() {
    it('should emit `scaffold` when defined as a function', function() {
      var count = 0;
      app.on('scaffold', function() {
        count++;
      });

      scaffold = app.scaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });

      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as a function', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      scaffold = app.scaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });

      assert.equal(count, 1);
    });

    it('should emit `scaffold` when defined as a function with an instance of Scaffold', function() {
      var count = 0;
      app.on('scaffold', function() {
        count++;
      });

      scaffold = app.scaffold('abc', function(options) {
        return new Scaffold({
          options: options,
          foo: {src: 'b.txt'}
        });
      });

      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as an instance with a function', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      scaffold = app.scaffold('abc', function(options) {
        return new Scaffold({
          options: options,
          foo: {src: 'b.txt'}
        });
      });

      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as a plain object', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      scaffold = app.scaffold('abc', {foo: {src: 'b.txt'}});
      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as an instance of Scaffold', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      scaffold = app.scaffold('abc', new Scaffold({foo: {src: 'b.txt'}}));
      assert.equal(count, 1);
    });
  });

  describe('plain object', function() {
    it('should get a scaffold from `app.scaffold`', function() {
      app.scaffold('abc', {foo: {src: 'b.txt'}});
      assert(isObject(app.scaffold('abc')));
      assert.strictEqual(app.scaffold('abc').name, 'abc');
    });
  });

  describe('instance', function() {
    it('should get an instance of Scaffold', function() {
      app.scaffold('abc', new Scaffold({foo: {src: 'b.txt'}}));
      scaffold = app.scaffold('abc');
      assert(scaffold instanceof Scaffold);
    });
  });

  describe('function', function() {
    it('should create an instance from a function', function() {
      app.scaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });
      scaffold = app.scaffold('abc');
      assert(scaffold instanceof Scaffold);
    });

    it('should create an instance from a plain object', function() {
      app.scaffold('abc', {foo: {src: 'b.txt'}});
      scaffold = app.scaffold('abc');
      assert(scaffold instanceof Scaffold);
    });
  });
});

