'use strict';

const gulp = require('gulp');

function lazyRequireTask(taskName, path, options) {
  options = options || {};
  gulp.task(taskName, function(callback) {
    let task = require(path).call(this, options);
    return task(callback);
  });
}

lazyRequireTask('styles', './tasks/styles');

lazyRequireTask('assets', './tasks/assets');

lazyRequireTask('webpack', './tasks/webpack', {
  dirname: __dirname
});

lazyRequireTask('clean', './tasks/clean');

lazyRequireTask('build', './tasks/build');

lazyRequireTask('serve', './tasks/serve');

lazyRequireTask('dev', './tasks/dev');

lazyRequireTask('views', './tasks/views');
