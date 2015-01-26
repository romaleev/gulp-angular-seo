'use strict';

var gulp = require('gulp');
var del = require('del');

require('require-dir')('./gulp');

gulp.task('clean', function(cb) {
	del([
		'node_modules',
		'client/bower_components',
		'dist/**/*.*',
		'tmp/**/*.*'
	], cb);
});

gulp.task('serve', ['dev']);

gulp.task('default', ['dev']);