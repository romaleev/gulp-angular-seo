'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    task = gulp.config.task,
    _phantom = require('phantom'),
    _clc = require("cli-color");

gulp.task('seo', function(cb) {
    var end = function(){cb();};
    var phantomHTML = $.promisify(_phantomHTML),
        host = gulp.config.url.server.prod,
        urls = task.seo.urls,
        threads = urls.length,
        phantoms = [];

    urls.forEach(function(url){
        var html,
            file = task.seo.dist + (url == '/' ? '/index.html' : url.match(/^.*[^\/]/)[0] + '.html'); //regexp: avoid trailing slash
        if(gulp.config.debug) console.log('seo: ' + file);
        var phantom = phantomHTML(host, url)
            .then(function(_html){
                html = _html;
                return $.mkdirp(file.match(/^.*\//)[0]); //regexp: get folder path
            })
            .then(function(){
                return $.fs.writeFile(file, html);
            });
        if(task.seo.testUrls.indexOf(url) != -1)
            phantom = phantom.then(function(){
                return phantomHTML(host, url + '?_escaped_fragment_=');
            })
            .then(function(_html){
                console.assert(html == _html,'[',url,']',"?_escaped_fragment_=");
            });
        phantoms.push(phantom);
    });
    Promise.all(phantoms)
        .then(end)
        .catch(console.error);
});

function _phantomHTML(host, url, cb) {
    _phantom.create(function(ph) {
        ph.createPage(function(page) {
            if (gulp.config.debug)
                page.set('onConsoleMessage', function(msg) {
                    console.log(_clc('[' + url + ']'), msg);
                });
            page.set('onError', function(msg, trace) {
                var msgStack = [msg.match(/^.{0,200}/)[0] + '...:'];
                if (trace && trace.length) {
                    trace.forEach(function(t) {
                        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
                    });
                }
                cb(_clc.inverse('[' + url + ']') + ' ' + msgStack.join('\n'));
            });
            page.set('onResourceError', function(resourceError) {
                cb(_clc.inverse('[' + url + ']') + ' ' + resourceError.errorCode + ' ' + resourceError.errorString);
            });
            page.open(host + url, function(status) {
                if (status != 'success') cb('status: ' + status);
                page.evaluate(function() { //regexp: remove <script> tags
                    return document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                }, function(html) {
                    cb(null, html);
                    page.set('onResourceError', undefined); //assert error fix
                    ph.exit(0);
                });
            });
        });
    }, {
        path: task.seo.phantomjs,
        dnodeOpts: {
            weak: false
        } //fix to avoid error: 'cannot find module "weak"'
    });
}
