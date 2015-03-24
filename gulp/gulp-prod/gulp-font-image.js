'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    task = gulp.config.task;

gulp.task('fonts', function() {
    return gulp.src(task.fonts.src)
        .pipe($.debug({
            title: "fonts:"
        }))
        .pipe(gulp.dest(task.fonts.dist));
});

gulp.task('images', function() {
    return gulp.src(task.images.src)
        .pipe($.debug({
            title: "images:"
        }))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(task.images.dist));
});
