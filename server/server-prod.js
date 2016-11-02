'use strict';

let express = require('express'),
    clientPath = require('path').join(__dirname, '/../tmp/dist'),
    conf = require('../config.json'),
    url = conf.url.server.prod,
    port = url.slice(-4);

express()
    .set('views', clientPath)
    .use(require('compression')())
    .use('/', (req, res, next)=> {
        if (/_escaped_fragment_=/.test(req.url)) { //?_escaped_fragment_=
            req.url = req.url.replace(/\?.*$/, '').replace(/\/+$/, ''); //cut everything after last '?' [0...] and '/' [1...] till the end
            req.url += (req.url === '') ? '/index.html' : '.html';
            express.static(clientPath + '/snapshots').call(this, req, res, next);
        } else {
            if (/.(woff|woff2)/.test(req.url)) res.setHeader('Access-Control-Allow-Origin', '*');
            express.static(clientPath).call(this, req, res, next);
        }
    })
    .get('/[^\.]+$/', (req, res)=> //match all except containing '.' [1...] till the end
        res.sendFile(clientPath + '/index.html'))
    .listen(port, ()=>
        console.log(conf.debug ? 'PROD server started: ' + url : ''));
