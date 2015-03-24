'use strict';

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')();

	$.requireDir = require('require-dir');
	$.clc = require("cli-color");
	$.runSequence = require('run-sequence');
	$.opn = require('opn');
	$.multimatch = require("multimatch");
	$.promisify = promisify;
	$.mkdirp = promisify(require('mkdirp'), {inPipe: true});
	$.fs = promisifyAll(require('fs'), ['open', 'writeFile'], {inPipe: true});

	gulp.config = require('./config.json');
	gulp.$ = $;
	$.requireDir('./gulp');

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

function promisify(func, _opt){
	var opt = _opt || {};
	return function(){
		var _args = arguments;
		return new Promise(function(resolve, reject){
			func.apply(null, Array.prototype.slice.call(_args).concat(function(err, rez){
				err ? reject(err) : resolve(opt.inPipe ? null : rez);
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
	return gulp.$.clc.greenBright(val);
});
decorator(console, 'warn', function(val){
	return gulp.$.clc.yellowBright(val);
});
decorator(console, 'error', function(val){
	return gulp.$.clc.redBright(val);
});
