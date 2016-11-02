'use strict';

let express = require('express'),
    path = require('path'),
    clientPath = path.join(__dirname, '/../client'),
    bowerPath = path.join(__dirname, '/../bower_components'),
    configPath = path.join(__dirname, "/../config.json"),
    less = require('less'),
    fs = require('fs'),
    conf = require('../config.json'),
    url = conf.url.server.dev,
    port = url.slice(-4);

express()
    .set('views', clientPath)
    .set('view engine', 'jade')
    .use(express.static(clientPath))
    .use('/bower_components', express.static(bowerPath))
    .use(require('morgan')('combined', {
        skip: (req, res)=>
            res.statusCode < 400
    }))
    .use(require('errorhandler')({
        dumpExceptions: true,
        showStack: true
    }))
    .get("/*.html", (request, response)=>
        response.render('./' + request.params[0] + '.jade', {
            pretty: true
        }))
    .get("/*.css", (request, response)=>
        fs.readFile(clientPath + '/' + request.params[0] + '.less', 'utf8', (err, data)=> {
            if (err) throw new Error(err.toString());
            less.render(data, (e, css)=> {
                response.set('Content-Type', 'text/css');
                response.send(css.css);
            });
        }))
    .get("/config.json", (request, response)=>
        response.sendFile(configPath))
    .get("*", (request, response)=>
        response.render("./index.jade", {
            pretty: true
        }))
    .listen(port, ()=>
        console.log(conf.debug ? 'DEV server started: ' + url : ''));
