'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

gulp.task('seo', function(cb) {
    var end = function(){cb();},
        host = gulp.config.url.server.prod,
        urls = task.seo.urls,
        threads = urls.length,
        phantoms = [],
        opt = {
            verbose: conf.debug,
            phantom: {
                path: task.seo.phantomjs,
                dnodeOpts: { weak: false } //fix to avoid error: 'cannot find module "weak"'
            }
        };

    urls.forEach(function(url){
        var file = task.seo.dist + (url == '/' ? '/index.html' : url.match(/^.*[^\/]/)[0] + '.html'), //regexp: avoid trailing slash
            html,
            phantom = phantomHTML(host + url, opt)
                .then(function(_html){
                    html = _html;
                    return $.mkdirp(file.match(/^.*\//)[0]); //regexp: get folder path
                })
                .then(function(){
                    return $.fs.writeFile(file, html);
                });
        if(task.seo.testUrls.indexOf(url) != -1)
            phantom = phantom
                .then(function(){
                    return phantomHTML(host + url + '?_escaped_fragment_=', opt);
                })
                .then(function(_html){
                    console.assert(html == _html,'[',url,']',"?_escaped_fragment_=");
                });
        phantoms.push(phantom);
        if(gulp.config.debug) console.log('seo: ' + file);
    });
    Promise.all(phantoms)
        .then(end)
        .catch(function(err){
            console.error(err);
            end();
        });
});

gulp.task('seo:sitemap', function() {
    return gulp.src(task.seo.dist + '/**/*.html')
        .pipe($.rename(function(path) {
            if(path.dirname != '.' && path.basename != 'index') path.extname = '';
        }))
        .pipe($.sitemap({
            siteUrl: conf.web,
            verbose: conf.debug
        }))
        .pipe(gulp.dest(task.common.dist));
});

function phantomHTML(url, opt) {
    var _opt = opt || {},
        _verbose = _opt.verbose,
        _onConsoleMessage =_opt.onConsoleMessage || function(msg) {
            console.log('[' + url + '] ' + msg);
        },
        _onError = _opt.onError || function(msg, trace) {
            var msgStack = [msg.match(/^.{0,200}/)[0] + '...:'];
            if (trace && trace.length) {
                trace.forEach(function(t) {
                    msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
                });
            }
            return '[' + url + '] ' + msgStack.join('\n');
        },
        _onResourceError = _opt.onResourceError || function(resourceError) {
            return '[' + url + '] ' + resourceError.errorCode + ' ' + resourceError.errorString;
        },
        _optPhantom = _opt.phantom || {};

    return new Promise(function(resolve, reject){
        require('phantom').create(function(ph) {
            ph.createPage(function(page) {
                if (_verbose)
                    page.set('onConsoleMessage', _onConsoleMessage);
                page.set('onError', function(msg, trace) {
                    reject(_onError(msg, trace));
                });
                page.set('onResourceError', function(resourceError) {
                    reject(_onResourceError(resourceError));
                });
                page.open(url, function(status) {
                    if (status != 'success') reject('status: ' + status);
                    page.evaluate(function() { //regexp: remove <script> tags
                        return document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    }, function(html) {
                        page.set('onResourceError', undefined); //assert error fix
                        ph.exit(0);
                        resolve(html);
                    });
                });
            });
        }, _optPhantom);
    });
}
