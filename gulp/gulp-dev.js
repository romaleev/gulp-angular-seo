'use strict';

var gulp = require('gulp'),
	$ = gulp.$,
	task = gulp.config.task,
	_browserSync = require('browser-sync');

gulp.task('html:inject', function() {
	return gulp.src(task.html.index)
		.pipe($.inject(gulp.src(task.js.vendor, {read: false}), {
			name: 'vendorJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe($.inject(gulp.src(task.css.vendor, {read: false}), {
			name: 'vendorCSS',
			addRootSlash: false,
			relative: true
		}))
		.pipe($.inject(
			gulp.src(task.js.user, {read: false})
				.pipe($.sort(function (a, b) {
				    return a.path.match(task.js.user_order) ? -1 : 1;
				})), {
			name: 'userJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe($.inject(gulp.src(task.css.user, {read: false}), {
			name: 'userCSS',
			addRootSlash: false,
			relative: true,
			transform: function(filepath) {
				if (filepath.slice(-5) === '.less') {
					return 'link(rel="stylesheet", href="' + filepath.slice(0, -4) + 'css")';
				}
				return $.inject.transform.apply($.inject.transform, arguments);
			}
		}))
		.pipe(gulp.dest(task.common.client));
});

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
