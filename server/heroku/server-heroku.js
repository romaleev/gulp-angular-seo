'use strict';

var express = require('express'),
	clientPath = require('path').join(__dirname, '/dist'),
    port = process.env.PORT || 5000;

express()
    .set('views', clientPath)
    .use(require('compression')())
    .use('/', function(req, res){
        if(/_escaped_fragment_=/.test(req.url)){
            req.url = req.url.replace(/\?.*$/,'').replace(/\/+$/,'');
            req.url += (req.url === '') ? '/index.html' : '.html';
            express.static(clientPath + '/snapshots').apply(this, arguments);
        } else {
            if(/.(woff|woff2)/.test(req.url)) res.setHeader('Access-Control-Allow-Origin', '*');
        	express.static(clientPath).apply(this, arguments);
        }
    })
    .get('/[^\.]+$', function(req, res){
        res.sendFile(clientPath + '/index.html');
    })
    .listen(port, function() {
    	console.log('HEROKU server started at port: ' + port);
    });
