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

gulp.task('dist', $.sync(gulp).sync([
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

gulp.task('dist', $.sync(gulp).sync([
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
    require('opn')(gulp.config.url.server.prod, 'chrome');
});


gulp.task('new', function(cb){
    var path = require('path'),
        extArr = [];
        /*data = [
            {
                modified: false,
                ext: ['js']
            }
        ]
        htmlExt = [],
        jsExt = [],
        cssExt = [],
        fontExt = [],
        imgExt = [],
        htaccessExt = [],*/
    gulp.src(['client/**/*.*','!client/bower_components/**'])
    .pipe($.changed('tmp/src', {
        hasChanged: $.changed.compareSha1Digest
    }))
    .pipe(gulp.dest('tmp/src'))
    .on('data', function(file){
        var ext = path.extname(file.history[0]);
        if(extArr.indexOf(ext) === -1) extArr.push(ext);
        //console.log();
    })
    .on('end',function(){
        console.log(extArr);
        cb();
    })
});

//gulp.task('ftp', $.sync(gulp).sync(['dist', ['ftp:upload', 'server:stop']], 'ftp'));
gulp.task('ftp', ['dist'], function(){
    gulp.start('ftp:upload');
    gulp.start('server:stop');
});