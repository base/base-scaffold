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

describe('.getScaffold', function() {
  beforeEach(function() {
    app = new App({isApp: true});
    app.use(scaffolds());
  });

  describe('return value', function() {
    it('should return an instance of Scaffold', function() {
      scaffold = app.getScaffold({foo: {src: 'b.txt'}});
      assert(scaffold instanceof Scaffold);
    });
  });

  describe('properties', function() {
    it('should set `scaffold.name` when defined as a function', function() {
      app.setScaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });
      scaffold = app.getScaffold('abc');
      assert.strictEqual(scaffold.name, 'abc');
    });

    it('should set `scaffold.name` when defined as a function with an instance of Scaffold', function() {
      app.setScaffold('abc', function(options) {
        return new Scaffold({
          options: options,
          foo: {src: 'b.txt'}
        });
      });
      scaffold = app.getScaffold('abc');
      assert.strictEqual(scaffold.name, 'abc');
    });

    it('should set `scaffold.name` when defined as a plain object', function() {
      app.setScaffold('abc', {foo: {src: 'b.txt'}});
      scaffold = app.getScaffold('abc');
      assert.strictEqual(scaffold.name, 'abc');
    });

    it('should set `scaffold.name` when defined as an instance of Scaffold', function() {
      app.setScaffold('abc', new Scaffold({foo: {src: 'b.txt'}}));
      scaffold = app.getScaffold('abc');
      assert.strictEqual(scaffold.name, 'abc');
    });
  });

  describe('events', function() {
    it('should emit `scaffold` when defined as a function', function() {
      var count = 0;
      app.on('scaffold', function() {
        count++;
      });

      app.setScaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });

      scaffold = app.getScaffold('abc');
      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as a function', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      app.setScaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });

      scaffold = app.getScaffold('abc');
      assert.equal(count, 1);
    });

    it('should emit `scaffold` when defined as a function with an instance of Scaffold', function() {
      var count = 0;
      app.on('scaffold', function() {
        count++;
      });

      app.setScaffold('abc', function(options) {
        return new Scaffold({
          options: options,
          foo: {src: 'b.txt'}
        });
      });
      scaffold = app.getScaffold('abc');
      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as an instance with a function', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      app.setScaffold('abc', function(options) {
        return new Scaffold({
          options: options,
          foo: {src: 'b.txt'}
        });
      });
      scaffold = app.getScaffold('abc');
      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as a plain object', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      app.setScaffold('abc', {foo: {src: 'b.txt'}});
      scaffold = app.getScaffold('abc');
      assert.equal(count, 1);
    });

    it('should have `scaffold.name` when defined as an instance of Scaffold', function() {
      var count = 0;
      app.on('scaffold', function(scaffold) {
        assert.equal(scaffold.name, 'abc');
        count++;
      });

      app.setScaffold('abc', new Scaffold({foo: {src: 'b.txt'}}));
      scaffold = app.getScaffold('abc');
      assert.equal(count, 1);
    });
  });

  describe('plain object', function() {
    it('should get a scaffold from `app.scaffolds`', function() {
      app.scaffold('abc', {foo: {src: 'b.txt'}});
      assert(isObject(app.getScaffold('abc')));
      assert.strictEqual(app.getScaffold('abc').name, 'abc');
    });
  });

  describe('instance', function() {
    it('should get an instance of Scaffold', function() {
      app.setScaffold('abc', new Scaffold({foo: {src: 'b.txt'}}));
      scaffold = app.getScaffold('abc');
      assert(scaffold instanceof Scaffold);
    });
  });

  describe('function', function() {
    it('should create an instance from a function', function() {
      app.setScaffold('abc', function(options) {
        return {
          options: options,
          foo: {src: 'b.txt'}
        }
      });
      scaffold = app.getScaffold('abc');
      assert(scaffold instanceof Scaffold);
    });

    it('should create an instance from a plain object', function() {
      app.setScaffold('abc', {foo: {src: 'b.txt'}});
      scaffold = app.getScaffold('abc');
      assert(scaffold instanceof Scaffold);
    });
  });
});

