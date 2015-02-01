'use strict';

var gulp = require('gulp'),
    process = require('child_process'),
    $ = require('gulp-load-plugins')(),
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

gulp.task('seo:phantom', function(cb) {
	var host = gulp.config.url.dev,
		urls = [
			'/',
			'/directory'
		],
		phantom = require('phantom'),
		fs = require('fs'),
		files = urls.length;

//console.log(fs.stat(path.dist + '/snapshots'));
	//if (!fs.exists(path.dist + '/snapshots')) 
	fs.mkdir(path.dist + '/snapshots', function(e) {
		if(e && e.code !== 'EEXIST') console.log(e);
	});
	urls.forEach(function(url, i, arr) {
		var fileName = url + ((url === '/') ? 'index.html' : '.html');
		function ready() {
			if (--files === 0) cb();
		}
		phantom.create(function(ph) {
			ph.createPage(function(page) {
				page.open(host + url, function(status) {
					page.evaluate(function() {
						return document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
					}, function(result) {
						fs.writeFile(path.dist + '/snapshots' + fileName, result, function(err) {
							console.log('seo: ' + fileName.substring(1));
							if (err) console.log(err);
							ready();
						});
						ph.exit(0);
					});
				});
			});
		}, {
			path: 'node_modules/phantomjs/lib/phantom/',
			dnodeOpts: {
				weak: false
			}
		});
	});
});

gulp.task('seo:useref', function() {
    var assets = $.useref.assets({
        searchPath: '{' + path.dist + '/snapshots}' // noconcat: true
    });

    return gulp.src(path.dist + '/snapshots/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(path.dist + '/snapshots'));
});

gulp.task('seo:server-stop', function(cb) {
	server.on('exit', cb)
	server.kill('SIGKILL');
});

gulp.task('seo', $.sync(gulp).sync([
	'seo:server-start',
    'seo:phantom',
    [
        'seo:useref',
        'seo:server-stop'
    ]
], 'seo'));