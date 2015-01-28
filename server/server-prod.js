'use strict';

//Init
var express = require('express'),
	app = express(),
	path = require('path'),
	clientPath = path.join(__dirname, '/../dist'),
	compress = require('compression');

app.set('views', clientPath);
//app.use(require('prerender-node').set('prerenderToken', 'pre'));
//app.use(require('prerender-node'));//?_escaped_fragment_=
//app.use(express.static(clientPath));
app.use(compress());

app.use('/', function(req, res){
    if(/_escaped_fragment_=/.test(req.url)){ // testing if url contains '_escaped_fragment_=' part
    	console.log('OK'+req.url);
        req.url = req.url.replace(/\?.*$/,'').replace(/\/+$/,''); // if it does, then strip it
        req.url += (req.url === '') ? '/index.html' : '.html';
        express.static(clientPath + '/snapshots').apply(this, arguments);
    } else {
    	express.static(clientPath).apply(this, arguments);
    }
});

app.get('/[^\.]+$', function(req, res){
    res.sendFile(clientPath + '/index.html');
});

//Start
app.listen(7997, function() {
	console.log('PROD server started http://localhost:7997');
});