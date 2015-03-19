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

    function ready() {
        if (--files === 0) cb();
    }
    urls.forEach(function(url, i, arr) {
        var fileName = url == '/' ? '/index.html' : url.match(/^.*[^\/]/)[0] + '.html'; //regexp: avoid trailing slash

        phantom.create(function(ph) {
            ph.createPage(function(page) {
                if(gulp.config.debug)
                    page.set('onConsoleMessage', function(msg) {
                        console.log('[', url, ']', msg);
                    });
                page.set('onError', function(msg, trace) {
                    var msgStack = [msg.match(/^.{0,200}/)[0] + '...:'];
                    if (trace && trace.length) {
                        trace.forEach(function(t) {
                            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
                        });
                    }
                    console.error('[', url, ']', msgStack.join('\n'));
                });
                page.set('onResourceError', function(resourceError) {
                    console.error('[', url, ']', resourceError.errorCode, resourceError.errorString);
                });
                page.open(host + url, function(status) {
                    if(status != 'success') console.error('status:', status);
                    page.evaluate(function() { //regexp: remove <script> tags
                        return document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    }, function(result) {
                        var filePath = path.seo.dist + fileName;
                        mkdirp(filePath.match(/^.*\//)[0], function(err) { //regexp: get folder path
                            if (err) console.error(err);
                            fs.writeFile(filePath, result, function(err) {
                                if (err) console.error(err);
                                if (path.debug) console.log('seo: ' + filePath);
                                ready();
                            });
                        });
                        page.set('onResourceError', undefined); //assert error fix
                        ph.exit(0);
                    });
                });
            });
        }, {
            path: path.phantomjs,
            dnodeOpts: { weak: false } //fix to avoid error: 'cannot find module "weak"'
        });
    });
});
