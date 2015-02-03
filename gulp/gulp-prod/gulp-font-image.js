'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('fonts', function() {
    return gulp.src(path.fonts.src)
        .pipe($.newer(path.fonts.dist))
        .pipe($.debug({
            title: "fonts:"
        }))
        .pipe(gulp.dest(path.fonts.dist));
});

gulp.task('image', function() {
    return gulp.src(path.img.src)
        .pipe($.newer(path.img.tmp))
        .pipe($.debug({
            title: "images:"
        }))
        .pipe(gulp.dest(path.img.tmp))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.img.dist));
});