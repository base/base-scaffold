'use strict';

var forOwn = require('for-own');
var scaffold = require('./');
var Base = require('base-app');
var base = new Base({isApp: true});

base.use(scaffold());

// base.on('scaffold.set', function(name, scaffold) {
//   scaffold = base.getScaffold(name);
//   base.register(name, function(app) {
//     app.task(name, function(cb) {
//       console.log(scaffold.targets.docs.files)
//       scaffold.generate(cb);
//     });
//   });
// });

base.on('scaffold', function(scaffold) {
  base.register(scaffold.name, function(app) {
    forOwn(scaffold.targets, function(target, key) {
      app.task(target.name, function(cb) {
        base.each(target, cb);
      });
    });
  });
});

// base.on('scaffold', function(scaffold) {
//   base.register(scaffold.name, function(app) {
//     app.on('target', function(target) {
//       base.task(target.name, function(cb) {
//         // target.generate(cb);
//         cb();
//       });
//     });
//   });
// });

// base.on('scaffold', function(scaffold) {
//   console.log('scaffold:', scaffold.name);
// });

// base.on('target', function(target) {
//   console.log('target:', target.parent.name);
// });

// base.on('files', function(stage, config) {
//   console.log('files:', config.parent.name);
// });

// base.on('node', function(node) {
//   console.log('node:', node);
//   node.src.forEach(function(fp) {
//     base.emit('file', fp);
//   });
// });

// base.on('file', function(file) {
//   console.log('file:', file);
// });

base.scaffold('foo', {
  docs: {
    options: {},
    files: {
      src: ['*', '!**/foo/**'],
      dest: 'foo'
    }
  },
  site: {
    options: {},
    files: {
      src: ['*', '!**/foo/**'],
      dest: 'foo'
    }
  }
});

// base.scaffold('bar', new base.Scaffold({
//   docs: {
//     options: {},
//     files: {
//       src: ['*'],
//       dest: 'foo'
//     }
//   }
// }));

// base.scaffold('baz', function(options) {
//   var scaffold = new base.Scaffold(options);
//   return scaffold.addTargets({
//     docs: {
//       options: {},
//       files: {
//         src: ['*'],
//         dest: 'foo'
//       }
//     }
//   });
// });

// base.scaffold('qux', function(options) {
//   return {
//     options: options,
//     docs: {
//       files: {
//         src: ['*'],
//         dest: 'foo'
//       }
//     }
//   };
// });

// base.getScaffold('foo');
// base.getScaffold('bar');
// base.getScaffold('baz');
// base.getScaffold('qux');
// console.log(base.getScaffold('foo').targets.docs.files);


base.generate('foo:site', function(err) {
  if (err) return console.log(err);
  console.log('done');
});
