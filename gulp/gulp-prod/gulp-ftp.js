import gulp from 'gulp';
import _vinylFtp from 'vinyl-ftp';
import _progress from 'progress';

let $ = gulp.$,
    conf = gulp.config,
    task = conf.task;

gulp.task('ftp:upload', ['ftp:config'], ()=> {
    let ProgressBar = _progress,
        size = 0,
        bar;

    return gulp.src(task.ftp.src)
        .pipe($.if(gulp.config.cache, $.changed(task.ftp.cache, { hasChanged: $.changed.compareSha1Digest })))
        .on('data', ()=> size++)
        .on('end', ()=>
            size && (bar = new ProgressBar('Uploading [:bar] :percent', {
                complete: '#',
                incomplete: ' ',
                width: 20,
                total: size
            })))
        .pipe($.if(gulp.config.cache, gulp.dest(task.ftp.cache)))
        .pipe($.debug({
            title: "ftp:"
        }))
        .pipe(gulp.config.ftpConnection.dest(task.ftp.root))
        .on('data', ()=>
            bar && bar.tick());
});

gulp.task('ftp:config', (cb)=> {
    let end = ()=> cb();
    try {
        gulp.config.ftpConnection = _vinylFtp.create(require('../../ftp.json'));
        cb();
    } catch (e) {
        console.warn('No "./ftp.json" config, creating:');
        let prompt = require('prompt');
        prompt.message = 'ftp.json';
        prompt.start();
        prompt.get(['host', 'port', 'user', 'pass'], (err, result)=> {
            if (err) return console.error(err);
            let ftp = JSON.stringify(result);
            gulp.config.ftpConnection = _vinylFtp.create(ftp);
            $.fs.writeFile('./ftp.json', ftp)
                .then(end)
                .catch(console.error);
        });
    }
});

gulp.task('ftp:htaccess', (cb)=>
    gulp.src(task.ftp.htaccess)
        .pipe($.concat('.htaccess'))
        .pipe(gulp.dest(task.common.dist)));
