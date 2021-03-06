import gulp from 'gulp';
import _multimatch from 'multimatch';
import _runSequence from 'run-sequence';
import _opn from 'opn';

let $ = gulp.$,
    task = gulp.config.task;

gulp.task('dist:opt', ['_dist:opt'], (cb)=>
    _runSequence(['server:stop'], cb));

gulp.task('prod:opt', ['_dist:opt'], ()=> {
    console.warn('Server is running: ' + gulp.config.url.server.prod);
    _opn(gulp.config.url.server.prod, gulp.config.browser);
});

gulp.task('ftp:opt', ['_dist:opt'], (cb)=> {
    gulp.config.cache = true;
    _runSequence(['ftp:upload', 'server:stop'], cb);
});

gulp.task('heroku:opt', ['_dist:opt'], (cb)=>
    _runSequence(['heroku:upload', 'server:stop'], cb));

gulp.task('_dist:opt', (cb)=> {
    let tasks = gulp.distTasks,
        files = [],
        src = [task.common.client + '/**/*.*']
                .concat(task.common.config)
                .concat(task.ftp.htaccess)
                .concat(task.js.vendor)
                .concat(task.css.vendor);

    let no = (patterns)=>
        !_multimatch(files, patterns).length;

    let cancel = (name, _tasks, _index)=> {
        let tasks = (_index === undefined) ? _tasks : _tasks[_index];
        let ind = tasks.indexOf(name);
        if(ind !== -1){
            tasks.splice(ind, 1);
            if(tasks.length === 0 && _index !== undefined)
                _tasks.splice(_index, 1);
        } else {
            for(let i = 0; i < tasks.length; i++)
                if(Array.isArray(tasks[i])) cancel(name, tasks, i);
        }
    };

    gulp.src(src, {base: '.'})
        .pipe($.changed(task.common.dist_cache, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe($.debug({title: 'dist:opt'}))
        .pipe(gulp.dest(task.common.dist_cache))
        .on('data', (file)=>
            files.push(file.history[0].slice(file.cwd.length + 1)))
        .on('end', ()=> {
            if(no(task.common.config)){ //decline cancelling if config.json changed
                if(no(task.html.index)) cancel('html', tasks);
                if(no(task.js.user) && no(task.html.partials)) cancel('js:user', tasks); //js:user dependent on both js:user and html.partials htat are injected into js.
                if(no(task.js.vendor)) cancel('js:vendor', tasks);
                if(no(task.css.user)) cancel('css:user', tasks);
                if(no(task.assets.fonts.src)) cancel('fonts', tasks);
                if(no(task.assets.images.src)) cancel('images', tasks);
                if(no(task.ftp.htaccess)) cancel('ftp:htaccess', tasks);
                if(tasks[0] && tasks[0][0] && tasks[0][0][0] && tasks[0][0][0].length === 2){ // == ['server:start', 'css:vendor_init']
                    cancel('seo', tasks); //because no 'js:vendor', 'html' and 'js:user' changes
                    cancel('seo:sitemap', tasks); //because no 'seo' changes
                    cancel('css:vendor_init', tasks); //because no 'seo' changes
                    if(no(task.css.vendor)){ //because no 'seo' and 'path.css.vendor' changes
                        cancel('css:vendor', tasks);
                        cancel('manifest', tasks);
                    }
                }
            }
            _runSequence($.sync(gulp).sync(tasks, 'dist:opt:tmp'), cb);
        });
});
