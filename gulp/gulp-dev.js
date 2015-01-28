'use strict';

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')();

	$.browserSync = require('browser-sync');

gulp.task('validate', function() {
	return gulp.src(['./server/*.js',
			'./client/{app,components,directives,services}/**/*.js'
		]).pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
});


gulp.task('wiredep', function() {
	return require('wiredep')({
		src: 'client/index.jade',
		exclude: ['bootstrap.js', 'jquery.js']
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

gulp.task('nodemon:dev', function(cb) {
	var called = false;
	return $.nodemon({
		script: 'server/server-dev.js',
		ext: 'js',
		watch: 'server/server-dev.js'	//ignore:[]
	}).on('start', function() {
		if (!called) {
			called = true;
			cb();
		}
	}).on('restart', function() {
		$.browserSync.reload({
			stream: false
		});
	});
});

gulp.task('livereload', function() {
    //TODO
});

gulp.task('browser-sync', ['nodemon:dev'], function() {
	return $.browserSync.init({
		proxy: "http://localhost:8000",
		files: [
			"client/**/*.{js,jade,less}",
			"client/{!bower_components}"
		],
		browser: "chrome",
		port: 8001,
		notify: false
		//logLevel: 'silent'
	});
});

gulp.task('livereload', ['nodemon:dev'], function() {
	return $.browserSync.init({
		proxy: "http://localhost:8000",
		files: [
			"client/**/*.{js,jade,less}",
			"client/{!bower_components}"
		],
		browser: "chrome",
		port: 8001,
		notify: false
		//logLevel: 'silent'
	});
});

gulp.task('dev', ['watch', 'browser-sync']);
gulp.task('d', ['dev']);