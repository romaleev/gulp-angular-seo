'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('html:tmp', function() {
    return gulp.src('client/**/*.jade')
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.flatten())
        .pipe(gulp.dest(path.tmp + '/html'))
});

gulp.task('sitemap', function() {// after html:tmp
    return gulp.src([
            path.tmp + '/html/*.html',
            '!' + path.tmp + '/html/home.html',
    	])
        .pipe($.sitemap({
            siteUrl: 'http://www.romaleev.com'
        }))
        .pipe(gulp.dest(path.dist));
});

gulp.task('html', function() {// after html:tmp
    var assets = $.useref.assets({
        searchPath: '{' + path.tmp + '/html}' // noconcat: true
    });

    return gulp.src(path.tmp + '/html/index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(path.dist));
});//TODO fix useref index.html