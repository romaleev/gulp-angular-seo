'use strict';

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	del = require('del'),
	browserSync = require('browser-sync');
	//TODO make gulp.$ single init
gulp.config = require('./config.json');

require('require-dir')('./gulp');

gulp.task('clean', function(cb) {
	del([
		dist + '/**/*.*',
		tmp + '/**/*.*'
	], cb);
});

gulp.task('default', ['dev']);
gulp.task('serve', ['dev']);
gulp.task('d', ['dev']);
gulp.task('p', ['prod']);
gulp.task('f', ['ftp']);