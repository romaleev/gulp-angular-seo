'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    conf = gulp.config,
    task = conf.task,
    _del = require('del'),
    server;

$.requireDir('./gulp/gulp-prod');

gulp.distTasks = [
    [
        ['server:start', 'js:vendor', 'css:vendor_init', ['html', 'js:user']],
        'seo',
        'css:vendor'
    ],
    'fonts',
    'images',
    'css:user'
];

gulp.task('_dist', $.sync(gulp).async(gulp.distTasks, 'dist'));

gulp.task('dist', ['_dist'], function(cb) {
    $.runSequence(['server:stop'], cb);
});

gulp.task('prod', ['_dist'], function() {
    console.warn('Server is running: ' + gulp.config.url.server.prod);
    $.opn(gulp.config.url.server.prod, gulp.config.browser);
});

gulp.task('ftp', ['_dist'], function(cb){
    $.runSequence(['ftp:upload', 'server:stop'], cb);
});

gulp.task('heroku', ['_dist'], function(cb){
    $.runSequence(['heroku:upload', 'server:stop'], cb);
});

gulp.task('server:start', function(cb) {
    if(server) return cb();
    server = require('child_process').spawn('node', [task.server.prod]);
    server.stderr.setEncoding('utf8');
    server.stderr.on('data', function(text) {
        console.error('Server: ' + text);
        cb();
    });
    server.stdout.setEncoding('utf8');
    server.stdout.on('data', function(text) {
        if(text.indexOf(conf.url.server.prod) != -1){
            cb();
        } else console.warn('Server: ' + text);
    });
});

gulp.task('server:stop', function(cb) {
    if(server){
        server.on('exit', cb);
        server.kill('SIGKILL');
    } else cb();
});

gulp.task('clean', function(cb) {
    _del([
        task.common.dist,
        task.common.dist_cache,
        task.common.ftp.cache
    ], cb);
});
