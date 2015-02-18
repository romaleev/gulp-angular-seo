'use strict';

var gulp = require('gulp');
gulp.$ = require('gulp-load-plugins')();
gulp.config = require('./config.json');

require('require-dir')('./gulp');

gulp.task('default', ['dev']);
gulp.task('serve', ['dev']);
gulp.task('d', ['dev']);

gulp.task('p', ['prod']);
gulp.task('f', ['ftp']);
gulp.task('h', ['heroku']);

gulp.task('po', ['prod:opt']);
gulp.task('fo', ['ftp:opt']);
gulp.task('ho', ['heroku:opt']);