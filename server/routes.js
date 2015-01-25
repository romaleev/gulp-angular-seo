'use strict';

/*module.exports = function(app) {

	app.get("/*.html", function(request, response) {
		response.render('./' + request.params[0] + '.jade', {
			pretty: true
		});
	});

	var less = require('less');
	var fs = require('fs');
	app.get("/*.css", function(request, response) {
		fs.readFile('./client/' + request.params[0] + '.less', 'utf8', function(err, data) {
			if (err) throw new Error(err.toString());
			less.render(data, function(e, css) {
				response.set('Content-Type', 'text/css');
				response.send(css.css);
			});
		});
	});

	app.get("*", function(request, response) {
		response.render("./index.jade", {
			pretty: true
		});
	});

};*/