'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('html', function() {
    var assets = $.useref.assets();
    return gulp.src(path.html.index)
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.useref())
        .pipe(gulp.dest(path.dist));
});