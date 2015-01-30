'use strict';

var gulp = require('gulp'),
    process = require('child_process'),
    path = gulp.config.path,
    server;

gulp.task('seo:server-start', function(cb) {
	server = process.spawn('node', ['server/server-dev.js']);
	server.stdout.setEncoding('utf8');
	server.stdout.on('data', function(text) {
		if(text.indexOf(gulp.config.url.dev) != -1){
			cb();
		} else {
			console.error('unexpected output: ' + text);
		}
	});
});

gulp.task('seo:phantom', ['seo:server-start'], function(cb) {
	var host = gulp.config.url.dev,
		urls = [
			'/',
			'/directory'
		],
		phantom = require('phantom'),
		fs = require('fs'),
		files = urls.length;

	urls.forEach(function(url, i, arr) {
		var file = path.dist + '/snapshots' + url + ((url === '/') ? 'index.html' : '.html');

		function ready() {
			if (--files === 0) cb();
		}
		phantom.create(function(ph) {
			ph.createPage(function(page) {
				page.open(host + url, function(status) {
					page.evaluate(function() {
						return document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
					}, function(result) {
						fs.writeFile(file, result, function(err) {
							console.log(file);
							if (err) console.log('err: ' + err);
							ready();
						});
						ph.exit();
					});
				});
			});
		}, {
			dnodeOpts: {
				weak: false
			}
		});
	});
});

gulp.task('seo', ['seo:phantom'], function(cb) {
	server.on('exit', cb)
	server.kill('SIGKILL');
});