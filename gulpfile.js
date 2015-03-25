'use strict';

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	_requireDir = require('require-dir'),
	_clc = require("cli-color");

$.promisify = promisify;
$.mkdirp = promisify(require('mkdirp'));
$.fs = promisifyAll(require('fs'), ['open', 'writeFile']);

gulp.config = require('./config.json');
gulp.$ = $;
_requireDir('./gulp');

gulp.task('default', ['dev']);
gulp.task('serve', ['dev']);
gulp.task('d', ['dev']);

gulp.task('di', ['dist']);
gulp.task('p', ['prod']);
gulp.task('f', ['ftp']);
gulp.task('h', ['heroku']);

gulp.task('do', ['dist:opt']);
gulp.task('po', ['prod:opt']);
gulp.task('fo', ['ftp:opt']);
gulp.task('ho', ['heroku:opt']);

function promisify(func){
	return function(){
		var _args = arguments;
		return new Promise(function(resolve, reject){
			func.apply(null, Array.prototype.slice.call(_args).concat(function(err, rez){
				err ? reject(err) : resolve(rez);
			}));
		});
	};
}
function promisifyAll(obj, methods, _opt){
	var rez = {};
	methods.forEach(function(method){
		rez[method] = promisify(obj[method], _opt);
	});
	return rez;
}

function decorator(object, prop, callback){
	var old = object[prop];
	object[prop] = function(){
		var arr = [];
		for(var i = 0; i < arguments.length; i++)
			arr.push(callback(arguments[i]));
		old.apply(object, arr);
	};
}
decorator(console, 'info', function(val){
	return _clc.greenBright(val);
});
decorator(console, 'warn', function(val){
	return _clc.yellowBright(val);
});
decorator(console, 'error', function(val){
	return _clc.redBright(val);
});
