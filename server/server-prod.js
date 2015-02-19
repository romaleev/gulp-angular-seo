'use strict';

var express = require('express'),
    path = require('path'),
    clientPath = path.join(__dirname, '/../tmp/dist'),
    url = require('../config.json').url.server.prod,
    port = url.slice(-4);

express()
    .set('views', clientPath)
    .use(require('compression')())
    .use('/', function(req, res) {
        if (/_escaped_fragment_=/.test(req.url)) { //?_escaped_fragment_=
            req.url = req.url.replace(/\?.*$/, '').replace(/\/+$/, '');
            req.url += (req.url === '') ? '/index.html' : '.html';
            express.static(clientPath + '/snapshots').apply(this, arguments);
        } else {
            if (/.(woff|woff2)/.test(req.url)) res.setHeader('Access-Control-Allow-Origin', '*');
            express.static(clientPath).apply(this, arguments);
        }
    })
    .get('/[^\.]+$', function(req, res) {
        res.sendFile(clientPath + '/index.html');
    })
    .listen(port, function() {
        console.log('PROD ' + url);
    });
