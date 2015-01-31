'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = gulp.config.path;

gulp.task('ftp:upload', function() { //TODO create ftp.json on fly with user input
    var ftp;
    try {
        ftp = require('./ftp.json');
    } catch (e) {
        console.error('Define ./ftp.json with host, port, user, pass and remotePath fields.');
    }
    var conn = require('vinyl-ftp').create(gulp.ftpConfig);
    return gulp.src([
            path.dist + '/**/*.*',
            'server/.htaccess'
        ])
        .pipe($.changed(path.tmp + '/ftp', {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest(path.tmp + '/ftp'))
        .pipe($.debug({
            title: "ftp:"
        }))
        .pipe(conn.dest('/public_html'))
});

gulp.task('heroku', function() {
    //TODO
});