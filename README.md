# Gulp AngularJS SEO template

> Gulp AngularJS SEO template with fast development and production optimized builds.

## Example project

Built via FTP: http://romaleev.com

Built in Heroku: http://romaleev.herokuapp.com

Source code: https://github.com/romaleev/gulp-angular-seo

## Usage

### Checkout and install it:
```
git clone https://github.com/romaleev/gulp-angular-seo
cd gulp-angular-seo
npm install
bower install
```

### Run development build:
```
gulp dev
```

### Run production builds:
* `gulp dist[:opt]` - optimization [enchanced]
* `gulp prod[:opt]` - optimization [enchanced] and preview

### Run FTP upload builds:
* `gulp ftp:upload` - upload via FTP
* `gulp ftp[:opt]` - optimization [enchanced] and upload via FTP

You need to enter FTP credentials on first use: host, port, user, pass.

### Run Heroku upload builds:
* `gulp heroku:upload` - upload into Heroku
* `gulp heroku[:opt]` - optimization [enchanced] and upload into Heroku

You need to install Heroku with Toolbelt and login first: `heroku login`

## Optimizations

* Fast reload with nodemon, browser-sync and gulp-watch.
* Production optimizations: gulp-ng-html2js, gulp-uncss, gulp-changed caching, streamqueue, gulp-sync/run-sequence task ordering and others.
* AngularJS snapshots for SEO using Phantom.js

## TODOs

* `Yeoman` generator with options:
* `html/jade`
* `css/less/sass`
* `express+browserSync/connect+livereload`
* `Ftp/Heroku uploading`
* `html5mode/hashbang`

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)