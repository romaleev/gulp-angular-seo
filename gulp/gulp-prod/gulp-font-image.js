'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

gulp.task('fonts', function() {
    return gulp.src(task.fonts.src)
        .pipe($.if(conf.debug, $.debug({
            title: "fonts:"
        })))
        .pipe(gulp.dest(task.fonts.dist));
});

gulp.task('images', function() {
    return gulp.src(task.images.src)
        .pipe($.if(conf.debug, $.debug({
            title: "images:"
        })))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(task.images.dist));
});
