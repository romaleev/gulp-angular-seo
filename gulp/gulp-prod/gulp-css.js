'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('css:vendor', function() {//after html:tmp //TODO add sourcemaps when uncss will be supported
    return gulp.src([
            path.bower + '/bootstrap/dist/css/bootstrap.min.css',
            path.bower + '/bootstrap/dist/css/bootstrap-theme.min.css',
            path.bower + '/fontawesome/css/font-awesome.min.css'
        ])
        .pipe($.concat('vendor.css'))
        .pipe($.uncss({
            html: [path.dist + '/snapshots/*.html'] //path.tmp + '/html/**/*.html'
        }))
        .pipe($.minifyCss())
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
        .pipe($.concat('styles.css'))
        .pipe($.sourcemaps.write('.'))
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
            path.bower + '/bootstrap/dist/css/bootstrap-theme.min.css',
            path.bower + '/fontawesome/css/font-awesome.min.css'
        ]))
        .pipe($.concat('styles.css'))
        .pipe(gulp.dest(path.dist));
});