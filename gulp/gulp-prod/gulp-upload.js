'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    vinylFtp = require('vinyl-ftp'),
    conn;

gulp.task('ftp:config', function(cb) {
    try {
        conn = vinylFtp.create(require('../../ftp.json'));
        cb();
    } catch (e) {
        console.log('Creating ftp.config, enter properties:');
        var prompt = require('prompt');
        prompt.message = 'ftp.config';
        prompt.start();
        prompt.get(['host', 'port', 'user', 'pass'], function(err, result) {
            if (err) return console.error(err);
            var ftp = JSON.stringify(result);
            conn = vinylFtp.create(ftp);
            require('fs').writeFile('./ftp.json', ftp, function(err) {
                if (err) console.error(err);
                cb();
            });
        });
    }
});

gulp.task('ftp:upload', ['ftp:config'], function() {
    return gulp.src(path.ftp.src)
        .pipe($.changed(path.ftp.tmp, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest(path.ftp.tmp))
        .pipe($.debug({
            title: "ftp:"
        }))
        .pipe(conn.dest('/public_html'));
});

gulp.task('heroku', function() {
    //TODO
});