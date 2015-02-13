'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    vinylFtp = require('vinyl-ftp');

gulp.task('ftp:config', function(cb) {
    try {
        gulp.config.ftpConnection = vinylFtp.create(require('../../ftp.json'));
        cb();
    } catch (e) {
        console.log('Creating ftp.config, enter properties:');
        var prompt = require('prompt');
        prompt.message = 'ftp.config';
        prompt.start();
        prompt.get(['host', 'port', 'user', 'pass'], function(err, result) {
            if (err) return console.error(err);
            var ftp = JSON.stringify(result);
            gulp.config.ftpConnection = vinylFtp.create(ftp);
            require('fs').writeFile('./ftp.json', ftp, function(err) {
                if (err) console.error(err);
                cb();
            });
        });
    }
});

gulp.task('ftp:upload', ['ftp:config'], function() {
    var ProgressBar = require('progress'),
        size = 0,
        bar;

    return gulp.src(path.ftp.src)
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
        .pipe($.debug({
            title: "ftp:"
        }))
        .pipe(gulp.config.ftpConnection.dest(path.ftp.root))
        .on('data', function() {
            if (bar) bar.tick();
        });
});

gulp.task('heroku', function() {
    //TODO
    //download & install Heroku with toolbelt
    //> heroku login
    //> 1. heroku create %appname%
    //> 1. heroku ps:scale web=1
    //> 1. git init
    //> 2. git add -A
    //> 2. git commit -m "update"
    //> 2. git push heroku master
    var run = require('gulp-run');
    return gulp.src(path.heroku.tmp)
            .pipe($.shell([
        'git diff'
//        'git add .',
//        "git commit -am 'commit for #{process.env.TAG} push'",
    ]));


});