'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('clean:prod', function(cb) {
    require('del')([
        path.dist + '/{scripts,styles,snapshots}/*.*',
        path.tmp + '/html/*.html'
    ], cb); //return gulp.src('tmp/**/*.*', {read: false}).pipe(vinylPaths(del));
});

gulp.task('nodemon:prod', function(cb) {
    var called = false;
    return $.nodemon({
        script: 'server/server-prod.js',
        ext: 'js',
        watch: 'server/server-prod.js' //ignore:[]
    }).on('start', function() {
        if (!called) {
            require('opn')(gulp.config.url.prod, 'chrome');
            called = true;
            cb();
        }
    });
});

gulp.task('dist', $.sync(gulp).sync([
    ['clean:prod', 'wiredep'],
    [
        ['html:tmp', ['html', 'css:vendor', 'js:user', 'sitemap']],
        'fonts',
        'image',
        'css:user',
        'js:vendor',
        'seo'
    ],
], 'dist'));

gulp.task('prod', ['dist'], function() {
    gulp.start('nodemon:prod');
});

gulp.task('ftp', ['dist'], function() {
    gulp.start('ftp:upload');
});