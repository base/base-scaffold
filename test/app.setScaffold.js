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

describe('.setScaffold', function() {
  beforeEach(function() {
    app = new App({isApp: true});
    app.use(scaffolds());
  });

  it('should set an instance of Scaffold on app.scaffolds', function() {
    app.setScaffold('abc', new Scaffold({foo: {src: 'b.txt'}}));
    assert(app.scaffolds.abc instanceof Scaffold);
  });

  it('should not create an instance from a plain object', function() {
    app.setScaffold('abc', {foo: {src: 'b.txt'}});
    assert(!(app.scaffolds.abc instanceof Scaffold));
  });

  it('should set a scaffold config on `app.scaffolds`', function() {
    app.scaffold('abc', {foo: {src: 'b.txt'}});
    assert(isObject(app.scaffolds.abc));
    assert.strictEqual(app.scaffolds.abc.name, 'abc');
  });
});

