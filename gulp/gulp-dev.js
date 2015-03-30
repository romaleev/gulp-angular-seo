'use strict';

var gulp = require('gulp'),
	$ = gulp.$,
	task = gulp.config.task,
	_browserSync = require('browser-sync');

gulp.task('nodemon', function(cb) {
	var called = false;

	return $.nodemon({
		script: task.server.dev,
		ext: 'js',
		watch: task.server.dev
	}).on('start', function() {
		if (!called) {
			called = true;
			_browserSync({
				proxy: gulp.config.url.server.dev,
				browser: gulp.config.browser,
				notify: false,
				logLevel: gulp.config.debug ? "debug" : "silent"
			}, cb);
		}
	}).on('restart', function() {
		_browserSync.reload();
	});
});

gulp.task('dev', ['html:inject', 'nodemon'], function() {
	console.warn('Server is running: ' + gulp.config.url.server.dev);

	$.watch(task.validate, {ignoreInitial: false})
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));

	$.watch(task.browserSync.reload, {events: ['change']}, _browserSync.reload);

	$.watch(task.browserSync.inject, {events: ['change']})
		.pipe($.rename(function(path) {
			path.extname = '.css';
		}))
		.pipe(_browserSync.reload({
			stream: true
		}));
});
