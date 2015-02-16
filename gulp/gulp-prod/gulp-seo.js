'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('seo', function(cb) {
	var host = gulp.config.url.server.prod,
		fs = require('fs'),
		phantom = require('phantom'),
		urls = path.seo.urls,
		files = urls.length;

	fs.mkdir(path.seo.dist, function(e) {
		if(e && e.code !== 'EEXIST') console.log(e);

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
							fs.writeFile(path.seo.dist + fileName, result, function(err) {
								if (err) console.log(err);
								ready();
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
});