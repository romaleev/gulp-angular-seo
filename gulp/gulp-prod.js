'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')(),
    // vinylPaths = require('vinyl-paths'),
    del = require('del'),
    opn = require('opn'),
    ftp = require('../ftp.json'),
    dist = 'dist',
    tmp = 'tmp',
    bower = 'client/bower_components';

gulp.task('clean:prod', function(cb) {
    del([
        dist + '/**/*.*',
        '!' + dist + '/font/**',
        '!' + dist + '/img/**'
    ], cb); //return gulp.src('tmp/**/*.*', {read: false}).pipe(vinylPaths(del));
});

gulp.task('html', function() {
    return gulp.src('client/index.jade')
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest(dist))
});

gulp.task('html:partials', function() {
    return gulp.src([
            'client/**/*.jade',
            '!client/index.jade'
        ])
        .pipe($.jade())
        .pipe($.ngHtml2js({
            moduleName: "romaleev",
            prefix: ""
        }))
        .pipe($.concat("partials.min.js"))
        .pipe($.uglify())
        .pipe(gulp.dest(tmp));
});

gulp.task('js', function() {
    return gulp.src([
            'client/**/*.js',
            '!' + bower + '/**'
        ])
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe($.addSrc.append(tmp + '/partials.min.js'))
        .pipe($.addSrc.prepend([
            bower + '/**/*.min.js',
            '!' + bower + '/bootstrap/**',
            '!' + bower + '/jquery/**'
            //'client/bower_components/angular/angular.min.js',
            //'client/bower_components/angular-route/angular-route.min.js',
            //'client/bower_components/angular-sanitize/angular-sanitize.min.js'
        ]))
        // .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat('scripts.js'))
        // .pipe($.sourcemaps.write())
        .pipe(gulp.dest(dist));
});

gulp.task('css', function() {
    return gulp.src([
            'client/**/*.less',
            '!' + bower + '/**'
        ])
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe($.addSrc([
            bower + '/bootstrap/dist/css/bootstrap.min.css',
            bower + '/fontawesome/css/font-awesome.min.css'
        ]))
        .pipe($.concat('styles.css'))
        .pipe(gulp.dest(dist));
});

gulp.task('fonts', function() {
    return gulp.src([
            'client/fonts/*.woff2',
            bower + '/fontawesome/fonts/fontawesome-webfont.woff2'
        ])
        .pipe($.newer(dist + '/fonts'))
        .pipe(gulp.dest(dist + '/fonts'));
});

gulp.task('image', function() {
    return gulp.src('client/img/**/*.*')
        .pipe($.newer(tmp + '/img'))
        .pipe(gulp.dest(tmp + '/img'))
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(dist + '/img'));
});

gulp.task('useref', function() {
    var assets = $.useref.assets({
        searchPath: '{' + dist + '}' // noconcat: true
    });

    return gulp.src(dist + '/index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(dist));
});

gulp.task('nodemon:prod', function(cb) {
    var called = false;
    return $.nodemon({
        script: 'server/server-prod.js',
        ext: 'js',
        watch: 'server/server-prod.js' //ignore:[]
    }).on('start', function() {
        if (!called) {
            opn('http://localhost:7997', 'chrome');
            called = true;
            cb();
        }
    });
});

gulp.task('sitemap', function() {
    return gulp.src(dist + '/index.html')
        .pipe($.sitemap({
            siteUrl: 'http://www.romaleev.com'
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('ftp:prod', function() {
    return gulp.src(dist + '/**/*.*')
        .pipe($.newer(tmp + '/ftp'))
        .pipe(gulp.dest(tmp + '/ftp'))
        .pipe($.ftp(ftp));
});

gulp.task('dist', $.sync(gulp).sync([
    ['clean:prod', 'wiredep'],
    [
        ['html:partials', 'js'],
        ['html', 'sitemap'],
        'css',
        'fonts',
        'image'
    ],
    'useref'
]));

gulp.task('prod', ['dist'], function(){
    gulp.start('nodemon:prod');
});

gulp.task('ftp', ['dist'], function(){
    gulp.start('ftp:prod');
});