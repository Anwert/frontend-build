'use strict';

const gulp = require('gulp');

module.exports = function() {
  return gulp.series(
      'build',
      gulp.parallel(
          'serve',
          function() {
            gulp.watch('frontend/styles/**/*.styl', gulp.series('styles'));
            gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
            gulp.watch('frontend/views/**/*.*', gulp.series('views'));
          }
      )
  )
};
