import gulp from 'gulp';
import _del from 'del';
import _requireDir from 'require-dir';
import _runSequence from 'run-sequence';
import _opn from 'opn';
import child_process from 'child_process';

let $ = gulp.$,
    conf = gulp.config,
    task = conf.task,
    server;

_requireDir('./gulp-prod');

gulp.distTasks = [
    [
        [
            ['server:start', 'js:vendor', 'css:vendor_init', ['html', 'js:user']],
            'seo',
            ['seo:sitemap', 'css:vendor']
        ],
        'assets',
        'css:user',
        'ftp:htaccess'
    ],
    'manifest'
];

gulp.task('_dist', $.sync(gulp).sync(gulp.distTasks, 'dist'));

gulp.task('dist', ['_dist'], (cb)=>
    _runSequence(['server:stop'], cb));

gulp.task('prod', ['_dist'], ()=> {
    console.warn('Server is running: ' + gulp.config.url.server.prod);
    _opn(gulp.config.url.server.prod, gulp.config.browser);
});

gulp.task('ftp', ['_dist'], (cb)=>
    _runSequence(['ftp:upload', 'server:stop'], cb));

gulp.task('heroku', ['_dist'], (cb)=>
    _runSequence(['heroku:upload', 'server:stop'], cb));

gulp.task('server:start', (cb)=> {
    if(server) return cb();
    let called = false;
    server = child_process.spawn('node', [task.server.prod]);
    server.stderr.setEncoding('utf8');
    server.stderr.on('data', (text)=> {
        console.error(text);
        !called && cb();
        called = true;
    });
    server.stdout.setEncoding('utf8');
    server.stdout.on('data', (text)=> {
        if(text.trim()) console.info(text);
        !called && cb();
        called = true;
    });
});

gulp.task('server:stop', (cb)=> {
    if(server){
        server.on('exit', cb);
        server.kill('SIGKILL');
    } else cb();
});

gulp.task('clean', (cb)=>
    _del([
        task.common.dist,
        task.common.dist_cache,
        task.ftp.cache
    ], cb));

gulp.task('manifest', ()=>
    gulp.src(task.manifest.src, {base: task.common.dist})
        .pipe($.manifest({
            hash: true,
            preferOnline: true,
            network: task.manifest.network,
            filename: task.manifest.name,
            cache: task.manifest.cache
        }))
        .pipe(gulp.dest(task.common.dist)));
