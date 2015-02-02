'use strict';

var gulp = require('gulp'),
	$ = gulp.$;

gulp.task('validate', function() {
	return gulp.src(['./server/*.js',
			'./client/{app,components,directives,services}/**/*.js'
		]).pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('wiredep', function() {
	return require('wiredep')({
		src: 'client/index.jade'
		//exclude: ['bootstrap.js', 'jquery.js']
	});
});

gulp.task('watch', ['validate', 'wiredep'], function() {
	gulp.watch([
		'./server/*.js',
		'./client/**/*.js',
		'./client/{!bower_components}'
	], ['validate']);

	return gulp.watch('bower.json', ['wiredep']);
});

gulp.task('nodemon', function(cb) {
	var called = false;
	return $.nodemon({
		script: 'server/server-dev.js',
		ext: 'js',
		watch: 'server/server-dev.js'
	}).on('start', function() {
		if (!called) {
			called = true;
			cb();
		}
	}).on('restart', function() {
		browserSync.reload({
			stream: false
		});
	});
});

gulp.task('livereload', function() {
    //TODO
});

gulp.task('browser-sync', ['nodemon'], function() {
	return require('browser-sync').init({
		proxy: gulp.config.url.dev,
		files: [
			"client/**/*.{js,jade,less}",
			"client/{!bower_components}"
		],
		browser: "chrome",
		notify: false,
		logLevel: "silent"
	});
});

gulp.task('dev', ['watch', 'browser-sync']);