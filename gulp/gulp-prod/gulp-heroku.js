'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    task = gulp.config.task;

gulp.task('heroku:upload', ['heroku:config'], $.shell.task([
    'git add -A .',
    'git commit -m update',
    'echo '+ $.clc.yellowBright('Wait until Heroku build is finished...'),
    'git push heroku master'
], { cwd: task.heroku.dist,
     ignoreErrors: !gulp.config.debug,
     env: {Path: ''} //fix to avoid error: 'git-helper for https not found'
}));


gulp.task('heroku:config', function(cb) {
    $.fs.open(task.heroku.git, 'r')
        .then(cb)
        .catch(function(err) {
            console.warn('You need to be logged in Heroku first: heroku auth:whoami | heroku login');
            $.runSequence('heroku:config:copy', 'heroku:config:shell', cb);
        });
});

gulp.task('heroku:config:copy', function() {
    return gulp.src(task.heroku.src)
        .pipe($.changed(task.heroku.dist, {
            hasChanged: $.changed.compareSha1Digest
        }))
        .pipe(gulp.dest(task.heroku.dist));
});

gulp.task('heroku:config:shell', $.shell.task([
    'git init',
    'heroku apps:create ' + task.heroku.appName, //optional: 'heroku ps:scale web=1'
    'heroku git:remote -a romaleev',
    'echo if you already have heroku app type: "cd tmp" and "git pull heroku master"'
], {cwd: task.heroku.dist, ignoreErrors: !gulp.config.debug}));
