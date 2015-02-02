'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('html:tmp', function() {
    return gulp.src('client/**/*.jade')
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.tmp + '/html'))
});

gulp.task('html', function() {// after html:tmp
/*    var assets = $.useref.assets({
        searchPath: '{' + path.tmp + '/html}' // noconcat: true
    });
*/
    var assets = $.useref.assets();
    return gulp.src(path.tmp + '/html/index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(path.dist));
});