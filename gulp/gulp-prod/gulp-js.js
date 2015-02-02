'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('js:vendor', function() {
    return gulp.src([
            path.bower + '/**/*.min.js',
            '!' + path.bower + '/angular/**',
            '!' + path.bower + '/bootstrap/**',
            '!' + path.bower + '/jquery/**'
        ])
        .pipe($.addSrc.prepend(path.bower + '/angular/angular.min.js'))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat('vendor.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.dist + '/scripts'));
});

gulp.task('js:user', function() {// after html:tmp
    var queue = require('streamqueue');
    var html = gulp.src([
            'client/**/*.js',
            '!' + path.bower + '/**'
        ])
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.concat('scripts'))
    var html2js = gulp.src([
                path.tmp + '/html/**/*.html',
                '!' + path.tmp + '/html/index.html'
            ])
            .pipe($.ngHtml2js({
                moduleName: "romaleev",
                prefix: ""
            }))
            .pipe($.concat("html2js"))

    return queue({objectMode: true}, html, html2js)
        .pipe($.uglify())
        .pipe($.concat('scripts.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.dist + '/scripts'));
});