'use strict';

let express = require('express'),
	clientPath = require('path').join(__dirname, '/dist'),
    port = process.env.PORT || 5000;

express()
    .set('views', clientPath)
    .use(require('compression')())
    .use('/', (req, res, next)=> {
        if(/_escaped_fragment_=/.test(req.url)){
            req.url = req.url.replace(/\?.*$/,'').replace(/\/+$/,'');
            req.url += (req.url === '') ? '/index.html' : '.html';
            express.static(clientPath + '/snapshots').call(this, req, res, next);
        } else {
            if(/.(woff|woff2)/.test(req.url)) res.setHeader('Access-Control-Allow-Origin', '*');
        	express.static(clientPath).call(this, req, res, next);
        }
    })
    .get('/[^\.]+$', (req, res)=>
        res.sendFile(clientPath + '/index.html'))
    .listen(port, ()=>
    	console.log('HEROKU server started at port: ' + port));
