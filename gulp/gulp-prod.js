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
    var match = require("multimatch"),
        files = [];

    gulp.src(['client/**/*.*'].concat(path.js.vendor).concat(path.css.vendor))
        .pipe($.changed('tmp/src', {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest('tmp/src'))
        .on('data', function(file) {
            files.push(file.history[0].slice(file.cwd.length + 1));
        })
        .on('end', function() {
            if(!match(files, path.html.index).length) console.log('no html');
            if(!match(files, path.js.user).length) console.log('no js user');
            if(!match(files, path.js.vendor).length) console.log('no js vendor');
            if(!match(files, path.css.user).length) console.log('no css user');
            if(!match(files, path.css.vendor).length) console.log('no css vendor');
            if(!match(files, path.fonts.src).length) console.log('no fonts');
            if(!match(files, path.img.src).length) console.log('no img');
            console.log('end');
            cb();
        })
});

//gulp.task('ftp', $.sync(gulp).sync(['dist', ['ftp:upload', 'server:stop']], 'ftp'));
gulp.task('ftp', ['dist'], function(){
    gulp.start('ftp:upload');
    gulp.start('server:stop');
});