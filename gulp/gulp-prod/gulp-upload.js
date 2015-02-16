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
        console.log('No "./ftp.json" config, creating:');
        var prompt = require('prompt');
        prompt.message = 'ftp.json';
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

    //TODO heroku
    //download & install Heroku with toolbelt
    //> heroku login
    //> 1. heroku create %appname%
    //> 1. heroku ps:scale web=1
    //> 1. git init
    //> 2. git add -A
    //> 2. git commit -m "update"
    //> 2. git push heroku master

/*
    return $.shell.task([
        'git init',
        'git add -A', //reuse
        'git commit -m "init"',// reuse
        'heroku login', //optional
        'heroku create ' + path.heroku.appName,
        'git push heroku master', //reuse
        'heroku ps:scale web=1'
    ], {cwd: path.heroku.tmp})();
*/

gulp.task('heroku:config', function() {
    require('fs').stat(path.heroku.git, function(err, stats) {
        if (err && err.code !== 'ENOENT') console.error(err);

        if (!err && stats.isDirectory()) return; //cancel if tmp git already initialized

        return gulp.src(path.heroku.src)
            .pipe($.changed(path.heroku.dist, {
                hasChanged: $.changed.compareSha1Digest
            }))
            .pipe(gulp.dest(path.heroku.dist))
            .pipe($.shell([
                '/WAIT git init'//,
                //'heroku create ' + path.heroku.appName, //optional: 'heroku ps:scale web=1'
            ], {cwd: path.heroku.dist}));
    });
});

gulp.task('heroku:upload', ['heroku:config'], function() {
    return gulp.src('')
            .pipe($.shell([
                'git add -A .'//,
                //'heroku create ' + path.heroku.appName, //optional: 'heroku ps:scale web=1'
            ], {cwd: path.heroku.dist}));
    //console.log(1);
    //return $.shell.task([
        //'git add -A .'
        //'git commit',
        //'git push heroku master'
    //], {cwd: path.heroku.dist})();
});