# Gulp AngularJS SEO template

> Gulp AngularJS SEO template with fast development and production optimized builds.

## Example project

Built with defaults: http://romaleev.com.

Source code: https://github.com/romaleev/gulp-angular-seo

## Usage

Checkout and install it:
```
git clone https://github.com/romaleev/gulp-angular-seo
cd gulp-angular-seo
npm install
bower install
```

Run development build:
```
gulp dev
```

Run production builds:
* `gulp dist` - optimization
* `gulp prod` - optimization and preview
* `gulp ftp` - optimization and upload to ftp
* `gulp dist:opt` - enchanced optimization
* `gulp prod:opt` - enchanced optimization and preview
* `gulp ftp:opt` - enchanced optimization and upload to ftp


## Optimizations

* Low latency auto-reload with nodemon, browser-sync and gulp-watch.
* Production optimizations: gulp-ng-html2js, gulp-uncss, gulp-changed caching, streamqueue, gulp-sync/run-sequence task ordering and others.
* AngularJS snapshots for SEO using Phantom.js

## TODOs

* `Heroku` upload, `Yeoman` generator with options:
* `html/jade`
* `css/less/sass`
* `html5mode/hashbang`
* `Ftp/Heroku uploading`

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)