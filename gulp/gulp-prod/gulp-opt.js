'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    server;

gulp.task('dist:opt:clean', function(cb) {
    require('del')([
        path.dist_tmp + '/**/*.*'
    ], cb);
});

gulp.task('dist:opt', function(cb) {
    var match = require("multimatch"),
        tasks = gulp.distTasks,
        files = [],
        src = ['client/**/*.*'].concat(path.js.vendor).concat(path.css.vendor).concat('!client/bower_components/**');

    function no(patterns){
        return !match(files, patterns).length;
    }
    function cancel(name, tasks){
        var ind = tasks.indexOf(name);
        if(ind !== -1){
            return tasks.splice(ind, 1);
        } else {
            for(var i = 0; i < tasks.length; i++)
                if(Array.isArray(tasks[i])) cancel(name, tasks[i]);
        }
    }

    gulp.src(src)
        .pipe($.changed(path.dist_tmp, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe($.debug({title: 'dist:opt'}))
        .pipe(gulp.dest(path.dist_tmp))
        .on('data', function(file) {
            files.push(file.history[0].slice(file.cwd.length + 1));
        })
        .on('end', function() {
            if(no(path.html.index)) cancel('html', tasks);
            if(no(path.js.user) && no(path.html.partials)) cancel('js:user', tasks);
            if(no(path.js.vendor)) cancel('js:vendor', tasks);
            if(no(path.css.user)) cancel('css:user', tasks);
            if(no(path.fonts.src)) cancel('fonts', tasks);
            if(no(path.img.src)) cancel('image', tasks);
            if(tasks[0][0].length === 2 && Array.isArray(tasks[0][0][1]) && !tasks[0][0][1].length){// cancel server start
                tasks.splice(0, 1);
                tasks.push('server:start');
                if(match(files, path.css.vendor).length) tasks.push('css:vendor');
            }
            if(tasks.length){
                require('run-sequence')($.sync(gulp).async(tasks, 'dist:opt:tmp'), cb);
            } else cb();
        });
});

gulp.task('prod:opt', ['dist:opt'], function() {
    console.log('Server is running: ' + gulp.config.url.server.prod);
    require('opn')(gulp.config.url.server.prod, gulp.config.browser);
});

gulp.task('ftp:opt:clean', function(cb) {
    require('del')([
        path.ftp.tmp + '/**/*.*'
    ], cb);
});

gulp.task('ftp:opt:upload', ['ftp:config'], function() {
    var ProgressBar = require('progress'),
        size = 0,
        bar;

    return gulp.src(path.ftp.src)
        .pipe($.changed(path.ftp.tmp, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .on('data', function() {
            size++;
        })
        .on('end', function() {
            if (size) bar = new ProgressBar('Uploading [:bar] :percent', {
                complete: '#',
                incomplete: ' ',
                width: 20,
                total: size
            });
        })
        .pipe(gulp.dest(path.ftp.tmp))
        .pipe($.debug({
            title: "ftp:"
        }))
        .pipe(gulp.config.ftpConnection.dest(path.ftp.root))
        .on('data', function() {
            if (bar) bar.tick();
        });
});

gulp.task('ftp:opt', ['dist:opt'], function(cb){
    require('run-sequence')(['ftp:opt:upload', 'server:stop'], cb);
});