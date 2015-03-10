'use strict';

var gulp = require('gulp'),
	$ = gulp.$,
	path = gulp.config.path,
	devPath = gulp.config.devPath,
	browserSync = require('browser-sync');

gulp.task('nodemon', function(cb) {
	var called = false;

	return $.nodemon({
		script: path.server.dev,
		ext: 'js',
		watch: path.server.dev,
		verbose: gulp.config.debug
	}).on('start', function() {
		if (!called) {
			called = true;
			browserSync.init({
				proxy: gulp.config.url.server.dev,
				browser: gulp.config.browser,
				notify: false,
				logLevel: gulp.config.debug ? "debug" : "silent"
			});
			cb();
		}
	}).on('restart', function() {
		browserSync.reload();
	});
});

gulp.task('dev', ['html:inject', 'nodemon'], function() {
	$.watch(devPath.validate, {ignoreInitial: false})
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));

	$.watch(devPath.browserSync.reload, {events: ['change']}, browserSync.reload);

	$.watch(devPath.browserSync.inject, {events: ['change']})
		.pipe($.rename(function(path) {
			path.extname = '.css';
		}))
		.pipe(browserSync.reload({
			stream: true
		}));
});