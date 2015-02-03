'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('html:tmp', function() {
    return gulp.src(path.html.src)
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.html.tmp))
});

gulp.task('html', function() {// after html:tmp
    var assets = $.useref.assets();
    return gulp.src(path.html.tmp + '/index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(path.dist));
});