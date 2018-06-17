'use strict';

const gulp = require('gulp');
const notify = require('gulp-notify');
const path = require('path');
const gulplog = require('gulplog');
const AssetsPlugin = require('assets-webpack-plugin');
const plumber = require('gulp-plumber');
const webpackStream = require('webpack-stream');
const webpack = require('webpack')
//const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const fs = require('fs')

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(args) {
  return function(callback) {
    let firstBuildReady = false;

    function done(err, stats) {
      firstBuildReady = true;
      if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
        return;  // emit('error', err) in webpack-stream
      }
      // write the in-memory manifest to disk
      // if (!isDevelopment) {
      //   const abspath = path.resolve(args.dirname + '/manifest/webpack.json')
      //   console.log(abspath)
      //   const content = stats.compilation.compiler.outputFileSystem.readFileSync(abspath)
      //   fs.writeFileSync(abspath, content)
      // }
      gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
        colors: true
      }));
    }

    let options = {
      mode: isDevelopment ? "development" : "production",
      entry: {
        index: './frontend/js/src/index.js',
        page: './frontend/js/page.js'
      },
      //entry: ['./frontend/js/index.js', './frontend/js/page2.js', './frontend/js/header/index.js', './frontend/js/menu/index.js'],
      output: {
        publicPath: '/js/',
        filename: isDevelopment ? '[name].js' : '[name]-[chunkhash:10].js'
      },
      watch: isDevelopment,
      devtool: isDevelopment ? 'cheap-module-inline-sourcemap' : false,
      module: {
        // rules: [{
        //   test: /\.(js|jsx)$/,
        //   include: path.join(args.dirname, "frontend", "js"),
        //   loader: 'babel-loader'
        //   use: {
        //     loader: 'babel-loader',
        //     query: {
        //       presets: ["env", "react"]
        //     }
        //   }
        rules: [{
          test: /\.js$/,
          use: [ 'babel-loader'],
          exclude: /node_modules/
        }, {
          test: /\.jsx$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        }]
      },
      plugins: [
        new webpack.NoEmitOnErrorsPlugin()
      ]
    }

    if (!isDevelopment) {
        options.plugins.push(new AssetsPlugin({
          filename: 'webpack.json',
          path: args.dirname + '/manifest',
          processOutput(assets) {
            for (let key in assets) {
              assets[key + '.js'] = assets[key].js.slice(options.output.publicPath.length);
              delete assets[key];
            }
            console.log(assets)
            return JSON.stringify(assets);
          }
        }));
      };

    return gulp.src('frontend/js/*.js')
      .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title:   'Webpack',
          message: err.message
        }))
      }))
      .pipe(named())
      .pipe(webpackStream(options, webpack, done))
      .pipe(gulpIf(!isDevelopment, uglify()))
      .pipe(gulp.dest('public/js'))
      .on('data', function() {
        if (firstBuildReady) {
          callback();
        }
      });
  };
};
