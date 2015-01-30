'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('js:html2js', function() {// after html:tmp
    return gulp.src([
            path.tmp + '/html/*.html',
            '!' + path.tmp + '/html/index.html',
        ])
        .pipe($.ngHtml2js({
            moduleName: "romaleev",
            prefix: ""
        }))
        .pipe($.concat("partials.min.js"))
        .pipe($.uglify())
        .pipe(gulp.dest(path.tmp));
});

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
        .pipe($.sourcemaps.write('/'))
        .pipe(gulp.dest(path.dist + '/scripts'));
});

gulp.task('js:user', ['js:html2js'], function() {// after js:html2js
    return gulp.src([
            'client/**/*.js',
            '!' + path.bower + '/**'
        ])
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.addSrc.append(path.tmp + '/partials.min.js'))
        .pipe($.concat('scripts.js'))
        .pipe($.sourcemaps.write('/'))
        .pipe(gulp.dest(path.dist + '/scripts'));
});