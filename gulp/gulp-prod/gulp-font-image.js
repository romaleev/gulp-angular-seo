'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('fonts', function() {
    return gulp.src(path.fonts.src)
        .pipe($.debug({
            title: "fonts:"
        }))
        .pipe(gulp.dest(path.fonts.dist));
});

gulp.task('image', function() {
    return gulp.src(path.img.src)
        .pipe($.debug({
            title: "images:"
        }))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.img.dist));
});