	

var request = require('request');
var cheerio = require('cheerio');


var SomeAnnoncePortal = function(name) {
	this.name = name;

}

SomeAnnoncePortal.prototype.query = function(keyword, resultHandler) {
	console.log("Searching: " + keyword);
	var query = this.createQuery(keyword);
	
	var handler = this.createHandler(resultHandler); 
	if (query.method == "GET") {
		request.get(query.url, handler);
	} else {
		throw new Error("Unsupported method " + query.method);
	}
}

SomeAnnoncePortal.prototype.createHandler = function(resultHandler) {
	var portal = this;
	return function(error, response, body) {
		console.log(response.statusCode);	//TODO check status code
		var $ = cheerio.load(body);
		var $items = portal.findItems($);

		var result = [];
		$items.each(function(i, $elem) {
			var $item = $(this);

			var item = portal.parseItem($item);
			result.push(item);
		});

		resultHandler(result);
	}
}
SomeAnnoncePortal.prototype.findItems = function($) {
	return $('.box.q.ext-item');
}


SomeAnnoncePortal.prototype.parseItem = function($item) {
	var $title = $item.find('h2 a');
	var $link = $item.find('h2 a');

	var title = $title.html();
	var url = $link.attr('href');
	
	return { title: title, url: url };
}

SomeAnnoncePortal.prototype.createQuery = function(keyword) {
	var url = this.createQueryURL(keyword);
	return { method: "GET", url: url };
}

SomeAnnoncePortal.prototype.createQueryURL = function(keyword) {
	return "http://www.annonce.cz/vsechny-inzeraty$18-filter.html?q=" + keyword;	//TODO url encoding
}



module.exports.SomeAnnoncePortal = SomeAnnoncePortal;
