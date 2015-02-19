'use strict';

var gulp = require('gulp'),
    $ = gulp.$,
    path = gulp.config.path;

gulp.task('heroku:upload', ['heroku:config'], $.shell.task([
    'git add -A .',
    'git commit -m update',
    'git push heroku master'
], { cwd: path.heroku.dist,
     ignoreErrors: !gulp.config.debug,
     env: {Path: ''} //fix to avoid git-helper for https not found
}));


gulp.task('heroku:config', function(cb) {
    if(!require('fs').existsSync(path.heroku.git)){
        console.log('You need to be logged in Heroku first: heroku auth:whoami | heroku login');
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
], {cwd: path.heroku.dist, ignoreErrors: !gulp.config.debug}));