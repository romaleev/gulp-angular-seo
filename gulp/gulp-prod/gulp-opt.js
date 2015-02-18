'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    runSequence = require('run-sequence');

gulp.task('dist:opt', function(cb) {
    var match = require("multimatch"),
        tasks = gulp.distTasks,
        files = [],
        src = [path.client + '/**/*.*'].concat(path.js.vendor).concat(path.css.vendor);

    function no(patterns){
        return !match(files, patterns).length;
    }
    function cancel(name, _tasks, _index){
        var tasks = (_index !== undefined) ? _tasks[_index] : _tasks;
        var ind = tasks.indexOf(name);
        if(ind !== -1){
            tasks.splice(ind, 1);
            if(tasks.length === 0 && _index !== undefined)
                _tasks.splice(_index, 1);
        } else {
            for(var i = 0; i < tasks.length; i++)
                if(Array.isArray(tasks[i])) cancel(name, tasks, i);
        }
    }

    gulp.src(src)
        .pipe($.changed(path.dist_cache, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe($.debug({title: 'dist:opt'}))
        .pipe(gulp.dest(path.dist_cache))
        .on('data', function(file) {
            files.push(file.history[0].slice(file.cwd.length + 1));
        })
        .on('end', function() {
            if(no(path.html.index)) cancel('html', tasks);
            if(no(path.js.user) && no(path.html.partials)) cancel('js:user', tasks); //js:user dependent on both js:user and html.partials htat are injected into js.
            if(no(path.js.vendor)) cancel('js:vendor', tasks);
            if(no(path.css.user)) cancel('css:user', tasks);
            if(no(path.fonts.src)) cancel('fonts', tasks);
            if(no(path.img.src)) cancel('image', tasks);
            if(Array.isArray(tasks[0][0]) && tasks[0][0].length === 1){
                cancel('seo', tasks); //cancel if no 'js:vendor', 'html' and 'js:user' changes
                if(no(path.css.vendor)) cancel('css:vendor', tasks); //cancel if no 'seo' and 'path.css.vendor' changes
            }
            runSequence($.sync(gulp).async(tasks, 'dist:opt:tmp'), cb);
        });
});

gulp.task('prod:opt', ['dist:opt'], function() {
    console.log('Server is running: ' + gulp.config.url.server.prod);
    require('opn')(gulp.config.url.server.prod, gulp.config.browser);
});

gulp.task('ftp:opt', ['dist:opt'], function(cb){
    gulp.config.cache = true;
    runSequence(['ftp:upload', 'server:stop'], cb);
});

gulp.task('heroku:opt', ['dist:opt'], function(cb){
    runSequence(['heroku:upload', 'server:stop'], cb);
});