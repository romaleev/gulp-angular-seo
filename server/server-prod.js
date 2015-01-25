'use strict';

//Init
var express = require('express'),
	app = express(),
	path = require('path'),
	clientPath = path.join(__dirname, '/../dist'),
	compress = require('compression');

app.set('views', clientPath);
app.use(express.static(clientPath));
app.use(compress());

app.get("/", function(request, response) {
	response.sendFile("index.html");
});

//Start
app.listen(7997, function() {
	console.log('PROD server started http://localhost:7997');
});