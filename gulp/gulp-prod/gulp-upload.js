'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path,
    vinylFtp = require('vinyl-ftp');

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

/*
    return gulp.src(path.heroku.src)
        .pipe($.changed(path.heroku.dist, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest(path.heroku.dist))
        .pipe($.shell([
            'git init'
            //'heroku create ' + path.heroku.appName //optional: 'heroku ps:scale web=1'
        ], {cwd: path.heroku.dist}));
*/

gulp.task('heroku:upload', ['heroku:config'], $.shell.task([
    'git add -A .',
    'git commit -m update',
    'git push heroku master'
], {cwd: path.heroku.dist, env: {Path: ''}}));

gulp.task('heroku:config', function(cb) {
    if(!require('fs').existsSync(path.heroku.git)){
        console.error('You need to be logged in Heroku first: heroku auth:whoami | heroku login');
        require('run-sequence')('heroku:config:copy', 'heroku:config:shell', cb);
    } else cb();
});

gulp.task('heroku:config:copy', function() {
    return gulp.src(path.heroku.src)
        .pipe($.changed(path.heroku.dist, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest(path.heroku.dist));
});

gulp.task('heroku:config:shell', $.shell.task([
    'git init',
    'heroku apps:create ' + path.heroku.appName //optional: 'heroku ps:scale web=1'
], {cwd: path.heroku.dist}));