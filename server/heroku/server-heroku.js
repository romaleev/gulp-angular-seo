'use strict';

var express = require('express'),
	app = express(),
	path = require('path'),
	clientPath = path.join(__dirname, '/../dist');

app.set('port', (process.env.PORT || 5000));

app.set('views', clientPath);
app.use(require('compression')());

app.use('/', function(req, res){
    if(/_escaped_fragment_=/.test(req.url)){//?_escaped_fragment_=
        req.url = req.url.replace(/\?.*$/,'').replace(/\/+$/,'');
        req.url += (req.url === '') ? '/index.html' : '.html';
        express.static(clientPath + '/snapshots').apply(this, arguments);
    } else {
        if(/.(woff|woff2)/.test(req.url)) res.setHeader('Access-Control-Allow-Origin', '*');
    	express.static(clientPath).apply(this, arguments);
    }
});

app.get('/[^\.]+$', function(req, res){
    res.sendFile(clientPath + '/index.html');
});

app.listen(app.get('port'), function() {
	console.log('HEROKU ' + url);
});