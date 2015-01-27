'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')(),
    // vinylPaths = require('vinyl-paths'),
    del = require('del'),
    opn = require('opn'),
    ftp = require('vinyl-ftp'),
    path = gulp.path;

gulp.task('clean:prod', function(cb) {
    del([
        path.dist + '/**/*.*',
        '!' + path.dist + '/fonts/*',
        '!' + path.dist + '/img/*'
    ], cb); //return gulp.src('tmp/**/*.*', {read: false}).pipe(vinylPaths(del));
});

gulp.task('html', function() {
    return gulp.src('client/index.jade')
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.dist))
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
        .pipe(gulp.dest(path.tmp));
});

gulp.task('js', function() {
    return gulp.src([
            'client/**/*.js',
            '!' + path.bower + '/**'
        ])
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe($.addSrc.append(path.tmp + '/partials.min.js'))
        .pipe($.addSrc.prepend([
            path.bower + '/**/*.min.js',
            '!' + path.bower + '/bootstrap/**',
            '!' + path.bower + '/jquery/**'
            //'client/bower_components/angular/angular.min.js',
            //'client/bower_components/angular-route/angular-route.min.js',
            //'client/bower_components/angular-sanitize/angular-sanitize.min.js'
        ]))
        // .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.concat('scripts.js'))
        // .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.dist));
});

gulp.task('css', function() {
    return gulp.src([
            'client/**/*.less',
            '!' + path.bower + '/**'
        ])
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe($.addSrc([
            path.bower + '/bootstrap/dist/css/bootstrap.min.css',
            path.bower + '/fontawesome/css/font-awesome.min.css'
        ]))
        .pipe($.concat('styles.css'))
        .pipe(gulp.dest(path.dist));
});

gulp.task('fonts', function() {
    return gulp.src([
            'client/fonts/*.woff2',
            path.bower + '/fontawesome/fonts/fontawesome-webfont.woff2'
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

gulp.task('useref', function() {
    var assets = $.useref.assets({
        searchPath: '{' + path.dist + '}' // noconcat: true
    });

    return gulp.src(path.dist + '/index.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(path.dist));
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
    return gulp.src(path.dist + '/index.html')
        .pipe($.sitemap({
            siteUrl: 'http://www.romaleev.com'
        }))
        .pipe(gulp.dest(path.dist));
});

gulp.task('ftp:prod', function() {
    var conn = ftp.create(gulp.ftpConfig);
    return gulp.src(path.dist + '/**/*.*')
        .pipe(conn.newer('/public_html')) //TODO content change instead of time
        .pipe(conn.dest('/public_html'))
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
], 'dist'));

gulp.task('prod', ['dist'], function() {
    gulp.start('nodemon:prod');
});

gulp.task('ftp', ['dist'], function() {
    gulp.start('ftp:prod');
});