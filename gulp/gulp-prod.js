'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    server;

require('require-dir')('./gulp-prod');

gulp.task('server:start', function(cb) {
    server = require('child_process').spawn('node', [path.server.prod]);
    server.stdout.setEncoding('utf8');
    server.stdout.on('data', function(text) {
        if(text.indexOf(gulp.config.url.server.prod) != -1){
            cb();
        } else {
            console.error('unexpected output: ' + text);
        }
    });
});

gulp.task('server:stop', function(cb) {
    server.on('exit', cb)
    server.kill('SIGKILL');
});

gulp.task('dist', $.sync(gulp).async([
    [
        ['server:start', 'js:vendor', ['html', 'js:user']],
        'seo:phantom',
        'css:vendor'
    ],
    'fonts',
    'image',
    'css:user'
], 'dist'));

gulp.task('prod', ['dist'], function() {
    require('opn')(gulp.config.url.server.prod, 'chrome');
});

gulp.task('check', function(cb) {
    var path = require('path'),
        extArr = [];
    gulp.src(['client/**/*.*', '!client/bower_components/**'])
        .pipe($.changed('tmp/src', {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest('tmp/src'))
        .pipe($.if())
        .on('data', function(file) {
            console.log(file, file.history[0]);
            var ext = path.extname(file.history[0]);
            if (extArr.indexOf(ext) === -1) extArr.push(ext);
        })
        .on('end', function() {
            console.log(extArr);
            //console.log(gulp.tasks['seo:phantom']);
            //if(gulp.tasks['seo:phantom'].dep.length > 0) console.log('aa')
            //gulp.tasks['seo:phantom'].dep.push('server:start');
            //console.log(gulp.tasks['seo:phantom']);
            cb();
        })
});

gulp.task('check1', function(cb) {
    var path = require('path'),
        extArr = [];
    gulp.src(['client/**/*.*', '!client/bower_components/**'])
        .pipe($.changed('tmp/src', {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest('tmp/src'))
        .on('data', function(file) {
            console.log(file, file.history[0]);
            var ext = path.extname(file.history[0]);
            if (extArr.indexOf(ext) === -1) extArr.push(ext);
        })
        .on('end', function() {
            console.log(extArr);
            //console.log(gulp.tasks['seo:phantom']);
            //if(gulp.tasks['seo:phantom'].dep.length > 0) console.log('aa')
            //gulp.tasks['seo:phantom'].dep.push('server:start');
            //console.log(gulp.tasks['seo:phantom']);
            cb();
        })
});

//gulp.task('ftp', $.sync(gulp).sync(['dist', ['ftp:upload', 'server:stop']], 'ftp'));
gulp.task('ftp', ['dist'], function(){
    gulp.start('ftp:upload');
    gulp.start('server:stop');
});