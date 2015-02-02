'use strict';

var gulp = require('gulp');
gulp.$ = require('gulp-load-plugins')(),
gulp.config = require('./config.json');

require('require-dir')('./gulp');

gulp.task('clean', function(cb) {
	require('del')([
		dist + '/**/*.*',
		tmp + '/**/*.*'
	], cb);
});

gulp.task('default', ['dev']);
gulp.task('serve', ['dev']);
gulp.task('d', ['dev']);
gulp.task('p', ['prod']);
gulp.task('f', ['ftp']);