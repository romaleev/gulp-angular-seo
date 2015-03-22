'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    fs = require('fs'),
    mkdirp = require('mkdirp');

gulp.task('seo', function(cb) {
    var host = gulp.config.url.server.prod,
        urls = path.seo.urls;

    phantomSnapshots(urls.map(function(item, i, arr) {
        return {
            href: item,
            url: host + item,
            file: path.seo.dist + (item == '/' ? '/index.html' : item.match(/^.*[^\/]/)[0] + '.html') //regexp: avoid trailing slash
        };
    }), cb);
});

function phantomSnapshots(data, cb) {
    var phantom = require('phantom'),
        files = data.length;

    function ready() {
        if (--files === 0) cb();
    }
    data.forEach(function(item) {
        phantom.create(function(ph) {
            ph.createPage(function(page) {
                if (gulp.config.debug)
                    page.set('onConsoleMessage', function(msg) {
                        console.log('[', item.href, ']', msg);
                    });
                page.set('onError', function(msg, trace) {
                    var msgStack = [msg.match(/^.{0,200}/)[0] + '...:'];
                    if (trace && trace.length) {
                        trace.forEach(function(t) {
                            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
                        });
                    }
                    console.error('[', item.href, ']', msgStack.join('\n'));
                });
                page.set('onResourceError', function(resourceError) {
                    if (!/vendor.css/.test(resourceError.errorString))
                        console.error('[', item.href, ']', resourceError.errorCode, resourceError.errorString);
                });
                page.open(item.url, function(status) {
                    if (status != 'success') console.error('status:', status);
                    page.evaluate(function() { //regexp: remove <script> tags
                        return document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    }, function(result) {
                        mkdirp(item.file.match(/^.*\//)[0], function(err) { //regexp: get folder path
                            if (err) console.error(err);
                            fs.writeFile(item.file, result, function(err) {
                                if (err) console.error(err);
                                if (path.debug) console.log('seo: ' + item.file);
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
            dnodeOpts: {
                weak: false
            } //fix to avoid error: 'cannot find module "weak"'
        });
    });
}
