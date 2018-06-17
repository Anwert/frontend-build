'use strict';

const gulp = require('gulp');
const combine = require('stream-combiner2').obj;
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const rev = require('gulp-rev');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function() {
  return function() {
    return combine(
      gulp.src('frontend/assets/**/*.*')
      .pipe(gulpIf(!isDevelopment, rev()))
      .pipe(gulp.dest('public/assets'))
      .pipe(gulpIf(!isDevelopment, combine(rev.manifest('assets.json'), gulp.dest('manifest'))))
    ).on('error', notify.onError()
  )};
};
