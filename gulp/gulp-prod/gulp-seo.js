'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    mkdirp = require('mkdirp');

gulp.task('seo', function(cb) {
	var host = gulp.config.url.server.prod,
		fs = require('fs'),
		phantom = require('phantom'),
		urls = path.seo.urls,
		files = urls.length;

	urls.forEach(function(url, i, arr) {
		var preUrl = url.replace(/\/+$/, ''),
			fileName = preUrl === '' ? 'index.html' : preUrl + '.html';
		function ready() {
			if (--files === 0) cb();
		}
		phantom.create(function(ph) {
			ph.createPage(function(page) {
				page.open(host + url, function(status) {
					page.evaluate(function() {
						return document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
					}, function(result) {
						var filePath = path.seo.dist + fileName;
						mkdirp(filePath.match(/^.*\//)[0], function (err) {
						    if (err) console.error(err);
							fs.writeFile(filePath, result, function(err) {
								if (err) console.log(err);
								if(path.debug) console.log('seo: ' + filePath);
								ready();
							});
						});
						ph.exit(0);
					});
				});
			});
		}, {
			path: path.phantomjs,
			dnodeOpts: {
				weak: false
			}
		});
	});
});