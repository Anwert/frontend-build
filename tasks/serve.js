'use strict';

const browserSync = require('browser-sync').create();
const path = require('path');

module.exports = function() {
  return function() {
    browserSync.init({
      server: {
          baseDir: 'public',
          index: 'index.html'
      }
    });
    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
  };
};
