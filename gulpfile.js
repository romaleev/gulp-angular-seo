'use strict';

var gulp = require('gulp');
gulp.$ = require('gulp-load-plugins')();
gulp.config = require('./config.json');
var path = gulp.config.path;

require('require-dir')('./gulp');

gulp.task('clean', ['dist:clean', 'dist:opt:clean', 'ftp:opt:clean']);

gulp.task('default', ['dev']);
gulp.task('serve', ['dev']);
gulp.task('d', ['dev']);
gulp.task('p', ['prod']);
gulp.task('f', ['ftp']);
gulp.task('po', ['prod:opt']);
gulp.task('fo', ['ftp:opt']);