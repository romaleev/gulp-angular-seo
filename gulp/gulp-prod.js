'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path,
    process = require('child_process'),
    server;

require('require-dir')('./gulp-prod');

gulp.task('clean:prod', function(cb) {
    require('del')([
        path.dist + '/{scripts,styles,snapshots}/*.*',
        path.tmp + '/html/*.html'
    ], cb); //return gulp.src('tmp/**/*.*', {read: false}).pipe(vinylPaths(del));
});

gulp.task('server:start', function(cb) {
    server = process.spawn('node', ['server/server-prod.js']);
    server.stdout.setEncoding('utf8');
    server.stdout.on('data', function(text) {
        if(text.indexOf(gulp.config.url.prod) != -1){
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

gulp.task('dist', $.sync(gulp).sync([
    ['clean:prod', 'wiredep'],
    [
        [
            ['html:tmp', 'server:start'],
            ['html', 'js:user', 'js:vendor'],
            'seo:phantom',
            'css:vendor'
        ],
        'fonts',
        'image',
        'css:user',
        'js:vendor'
    ],
], 'dist'));

gulp.task('prod', ['dist'], function() {
    require('opn')(gulp.config.url.prod, 'chrome');
});

gulp.task('ftp', $.sync(gulp).sync(['dist', ['ftp:upload', 'server:stop']], 'ftp'));