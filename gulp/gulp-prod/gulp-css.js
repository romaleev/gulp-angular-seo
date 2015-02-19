'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('css:vendor', function() {//TODO add sourcemaps when uncss will be supported
    return gulp.src(path.css.vendor)
        .pipe($.concat('vendor.css'))
        .pipe($.uncss(path.css.uncss))
        .pipe($.minifyCss())
        .pipe(gulp.dest(path.css.dist));
});

gulp.task('css:user', function() {
    return gulp.src(path.css.user)
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe($.concat('styles.css'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.css.dist));
});

//TODO for generator
//    .pipe($.if('*.less', $.less()))
//    .pipe($.if('*.scss', $.sass()))