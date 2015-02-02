'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('fonts', function() {
    return gulp.src([
            'client/fonts/*.{woff,woff2}',
            path.bower + '/fontawesome/fonts/fontawesome-webfont.{woff,woff2}',
        ])
        .pipe($.newer(path.dist + '/fonts'))
        .pipe($.debug({
            title: "fonts:"
        }))
        .pipe(gulp.dest(path.dist + '/fonts'));
});

gulp.task('image', function() {
    return gulp.src('client/img/**/*.*')
        .pipe($.newer(path.tmp + '/img'))
        .pipe($.debug({
            title: "images:"
        }))
        .pipe(gulp.dest(path.tmp + '/img'))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist + '/img'));
});