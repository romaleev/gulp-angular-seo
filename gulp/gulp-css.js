'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('css:vendor', function() {//after html:tmp
    return gulp.src([
            //path.bower + '/**/*.{min.css|css.map}'
            path.bower + '/bootstrap/dist/css/bootstrap.min.css',
            path.bower + '/fontawesome/css/font-awesome.min.css'
        ])
        //.pipe($.sourcemaps.init())
        .pipe($.concat('vendor.css'))
        .pipe($.uncss({
            html: [path.tmp + '/html/*.html']
        }))
        //.pipe($.sourcemaps.write('/'))
        .pipe(gulp.dest(path.dist + '/styles'));
});

gulp.task('css:user', function() {
    return gulp.src([
            'client/**/*.less',
            '!' + path.bower + '/**'
        ])
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe($.sourcemaps.write('/'))
        .pipe($.concat('styles.css'))
        .pipe(gulp.dest(path.dist + '/styles'));
});

//TODO for generator
gulp.task('css:sass', function() {
    gulp.src([
            'client/**/*.sass',
            '!' + path.bower + '/**'
        ])
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.minifyCss())
        .pipe($.sourcemaps.write())
        .pipe($.addSrc([
            path.bower + '/bootstrap/dist/css/bootstrap.min.css',
            path.bower + '/fontawesome/css/font-awesome.min.css'
        ]))
        .pipe($.concat('styles.css'))
        .pipe(gulp.dest(path.dist));
});