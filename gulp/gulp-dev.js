'use strict';

var gulp = require('gulp'),
	$ = gulp.$,
	path = gulp.config.path,
	devPath = gulp.config.devPath,
	browserSync = require('browser-sync');

gulp.task('inject', function() {
	return gulp.src(path.html.index)
		.pipe(gulp.$.inject(gulp.src(path.js.vendor, {read: false}), {
			name: 'vendorJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(path.css.vendor, {read: false}), {
			name: 'vendorCSS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(path.js.user, {read: false}), {
			name: 'userJS',
			addRootSlash: false,
			relative: true
		}))
		.pipe(gulp.$.inject(gulp.src(path.css.user, {read: false}), {
			name: 'userCSS',
			addRootSlash: false,
			relative: true,
			transform: function(filepath) {
				if (filepath.slice(-5) === '.less') {
					return 'link(rel="stylesheet", href="' + filepath.slice(0, -4) + 'css")';
				}
				return gulp.$.inject.transform.apply(gulp.$.inject.transform, arguments);
			}
		}))
		.pipe(gulp.dest('client'));
});

gulp.task('validate', function() {
	return gulp.src(devPath.validate)
			.pipe($.jshint())
			.pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('nodemon', function(cb) {
	var called = false;
	return $.nodemon({
		script: path.server.dev,
		ext: 'js',
		watch: path.server.dev,
		verbose: false
	}).on('start', function() {
		if (!called) {
			called = true;
			cb();
		}
	}).on('restart', function() {
		browserSync.reload();
	});
});

gulp.task('livereload', function() {
    //TODO
});

gulp.task('browserSync', ['inject', 'nodemon'], function() {
	return browserSync.init({
		proxy: gulp.config.url.server.dev,
		browser: "chrome",
		notify: false,
		logLevel: "silent"
	});
});

gulp.task('dev', ['validate', 'browserSync'], function() {
	$.watch(devPath.validate)
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