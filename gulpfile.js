'use strict';

var gulp = require('gulp');
gulp.$ = require('gulp-load-plugins')();
gulp.config = require('./config.json');

require('require-dir')('./gulp');

gulp.task('default', ['dev']);
gulp.task('serve', ['dev']);
gulp.task('d', ['dev']);

gulp.task('p', ['prod']);
gulp.task('f', ['ftp']);
gulp.task('h', ['heroku']);

gulp.task('po', ['prod:opt']);
gulp.task('fo', ['ftp:opt']);
gulp.task('ho', ['heroku:opt']);

var clc = require("cli-color");
function decorator(object, prop, callback){
	var old = object[prop];
	object[prop] = function(){
		var arr = [];
		for(var i = 0; i < arguments.length; i++)
			arr.push(callback(arguments[i]));
		old.apply(object, arr);
	};
}
decorator(console, 'warn', function(val){
	return clc.yellowBright(val);
});
decorator(console, 'error', function(val){
	return clc.redBright(val);
});
