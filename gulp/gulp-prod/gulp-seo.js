import gulp from 'gulp';
import phantom from 'phantom';

let $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

let phantomHTML = (url, opt)=> {
    let _opt = opt || {},
        _verbose = _opt.verbose,
        _onConsoleMessage =_opt.onConsoleMessage || ((msg)=>
                console.log('[' + url + '] ' + msg)),
        _onError = _opt.onError || ((msg, trace)=> {
                let msgStack = [msg.match(/^.{0,200}/)[0] + '...:'];
                if (trace && trace.length) {
                    trace.forEach((t)=>
                        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : '')));
                }
                return '[' + url + '] ' + msgStack.join('\n');
            }),
        _onResourceError = _opt.onResourceError || ((resourceError)=>
                '[' + url + '] ' + resourceError.errorCode + ' ' + resourceError.errorString),
        _optPhantom = _opt.phantom || {};

    let ph, page = null;
    return new Promise((resolve, reject)=> {
        phantom.create(['--disk-cache=yes'], _optPhantom)
            .then((instance)=> {
                ph = instance;
                return instance.createPage();
            })
            .then((_page)=> {
                page = _page;
                if (_verbose)
                    page.setting('onConsoleMessage', _onConsoleMessage);
                page.setting('onError', (msg, trace)=>
                    reject(_onError(msg, trace)));
                page.setting('onResourceError', (resourceError)=>
                    reject(_onResourceError(resourceError)));
                return page.open(url);
            })
            .then((status)=> {
                if (status != 'success') reject('status: ' + status);
                page.evaluate(()=> //regexp: remove <script> tags
                        document.getElementsByTagName("html")[0].innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''))
                    .then((html)=> {
                        page.setting('onResourceError', undefined); //assert error fix
                        ph.exit(0);
                        resolve(html);
                    })
                    .catch((err)=> {
                        ph.exit(0);
                        reject(err);
                    });
            })
            .catch((error)=> {
                console.log(error);
                ph.exit();
            });
    });

    /*return new Promise(function(resolve, reject){ //v1
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
     });*/
}

gulp.task('seo', (cb)=> {
    let end = ()=> cb(),
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

    urls.forEach((url)=> {
        let file = task.seo.dist + (url == '/' ? '/index.html' : url.match(/^.*[^\/]/)[0] + '.html'), //regexp: avoid trailing slash
            html,
            phantom = phantomHTML(host + url, opt)
                .then((_html)=> {
                    html = _html;
                    return $.mkdirp(file.match(/^.*\//)[0]); //regexp: get folder path
                })
                .then(()=>
                    $.fs.writeFile(file, html));
        if(task.seo.testUrls.indexOf(url) != -1)
            phantom = phantom
                .then(()=>
                    phantomHTML(host + url + '?_escaped_fragment_=', opt))
                .then((_html)=>
                    //console.log(1, html.length, _html.length)
                    console.assert(html == _html,'[',url,']',"?_escaped_fragment_="));
        phantoms.push(phantom);
        if(gulp.config.debug) console.log('seo: ' + file);
    });
    Promise.all(phantoms)
        .then(end)
        .catch((err)=> {
            console.error(err);
            end();
        });
});

gulp.task('seo:sitemap', ()=>
    gulp.src(task.seo.dist + '/**/*.html')
        .pipe($.rename((path)=> {
            if(path.dirname != '.' && path.basename != 'index') path.extname = '';
        }))
        .pipe($.sitemap({
            siteUrl: conf.web,
            verbose: conf.debug
        }))
        .pipe(gulp.dest(task.common.dist)));
