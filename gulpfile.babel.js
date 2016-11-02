import gulp from 'gulp';
import _requireDir from 'require-dir';
import _clc from 'cli-color';
import fs from 'fs';
import mkdirp from 'mkdirp';
import Config from './config.json';
let $ = require('gulp-load-plugins')();

$.promisify = (func)=>
    (...args)=>
        new Promise((resolve, reject)=> {
            func.apply(null, Array.prototype.slice.call(args).concat((err, rez)=>
                err ? reject(err) : resolve(rez)));
        });
$.promisifyAll = (obj, methods, _opt)=> {
    let rez = {};
    methods.forEach((method)=>
        rez[method] = $.promisify(obj[method], _opt));
    return rez;
};

$.mkdirp = $.promisify(mkdirp);
$.fs = $.promisifyAll(fs, ['open', 'writeFile']);

gulp.config = Config;
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

let decorate = (object, prop, callback)=> {
	let old = object[prop];
	object[prop] = (...args)=> {
		let arr = [];
		for(let i = 0; i < args.length; i++)
			arr.push(callback(args[i]));
		old.apply(object, arr);
	};
};
let colorify = (color)=>
	(val)=> {
		let inversed = val && val.toString().match(/(^\[.*\])(.*$)/),
			rez = inversed ? (_clc.inverse(inversed[1]) + inversed[2]) : val;
		return color ? _clc[color](rez) : rez;
	};

decorate(console, 'info', colorify('greenBright'));
decorate(console, 'warn', colorify('yellowBright'));
decorate(console, 'error', colorify('redBright'));
