'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    conf = gulp.config,
    task = conf.task,
    _vinylFtp = require('vinyl-ftp'),
    _progress = require('progress');

gulp.task('ftp:upload', ['ftp:config'], function() {
    var ProgressBar = _progress,
        size = 0,
        bar;

    return gulp.src(task.ftp.htaccess)
        .pipe($.concat('.htaccess'))
        .pipe($.addSrc(task.ftp.src))
        .pipe($.if(gulp.config.cache, $.changed(task.ftp.cache, { hasChanged: $.changed.compareSha1Digest })))
        .on('data', function() {
            size++;
        })
        .on('end', function() {
            if (size) bar = new ProgressBar('Uploading [:bar] :percent', {
                complete: '#',
                incomplete: ' ',
                width: 20,
                total: size
            });
        })
        .pipe($.if(gulp.config.cache, gulp.dest(task.ftp.cache)))
        .pipe($.debug({
            title: "ftp:"
        }))
        .pipe(gulp.config.ftpConnection.dest(task.ftp.root))
        .on('data', function() {
            if (bar) bar.tick();
        });
});

gulp.task('ftp:config', function(cb) {
    var end = function(){cb();};
    try {
        gulp.config.ftpConnection = _vinylFtp.create(require('../../ftp.json'));
        cb();
    } catch (e) {
        console.warn('No "./ftp.json" config, creating:');
        var prompt = require('prompt');
        prompt.message = 'ftp.json';
        prompt.start();
        prompt.get(['host', 'port', 'user', 'pass'], function(err, result) {
            if (err) return console.error(err);
            var ftp = JSON.stringify(result);
            gulp.config.ftpConnection = _vinylFtp.create(ftp);
            $.fs.writeFile('./ftp.json', ftp)
                .then(end)
                .catch(console.error);
        });
    }
});
