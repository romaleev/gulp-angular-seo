'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    server;

require('require-dir')('./gulp-prod');

gulp.task('server:start', function(cb) {
    if(server) return cb();
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
    if(server){
        server.on('exit', cb);
        server.kill('SIGKILL');
    } else cb();
});

gulp.task('dist:clean', function(cb) {
    require('del')([
        path.dist + '/**/*.*'
    ], cb);
});

gulp.distTasks = [
    [
        ['server:start', 'js:vendor', ['html', 'js:user']],
        'seo',
        'css:vendor'
    ],
    'fonts',
    'image',
    'css:user'
];

gulp.task('dist', $.sync(gulp).async(gulp.distTasks, 'dist'));

gulp.task('prod', ['dist'], function() {
    console.log('Server is running: ' + gulp.config.url.server.prod);
    require('opn')(gulp.config.url.server.prod, gulp.config.browser);
});

gulp.task('ftp', ['dist'], function(cb){
    require('run-sequence')(['ftp:upload', 'server:stop'], cb);
});