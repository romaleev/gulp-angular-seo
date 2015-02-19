'use strict';

var express = require('express'),
    path = require('path'),
    clientPath = path.join(__dirname, '/../client'),
    bowerPath = path.join(__dirname, '/../bower_components'),
    less = require('less'),
    fs = require('fs'),
    url = require('../config.json').url.server.dev,
    port = url.slice(-4);

express()
    .set('views', clientPath)
    .set('view engine', 'jade')
    .use(express.static(clientPath))
    .use('/bower_components', express.static(bowerPath))
    .use(require('morgan')('combined', {
        skip: function(req, res) {
            return res.statusCode < 400;
        }
    }))
    .use(require('errorhandler')({
        dumpExceptions: true,
        showStack: true
    }))
    .get("/*.html", function(request, response) {
        response.render('./' + request.params[0] + '.jade', {
            pretty: true
        });
    })
    .get("/*.css", function(request, response) {
        fs.readFile(clientPath + '/' + request.params[0] + '.less', 'utf8', function(err, data) {
            if (err) throw new Error(err.toString());
            less.render(data, function(e, css) {
                response.set('Content-Type', 'text/css');
                response.send(css.css);
            });
        });
    })
    .get("*", function(request, response) {
        response.render("./index.jade", {
            pretty: true
        });
    })
    .listen(port, function() {
        console.log('DEV ' + url);
    });