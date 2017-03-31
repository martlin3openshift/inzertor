	

var request = require('request');
var cheerio = require('cheerio');


var BasePortal = function(name) {
	this.name = name;

}

module.exports.BasePortal = BasePortal;

////////////////////////////////////////////////////////////////////////////////

BasePortal.prototype.query = function(keyword, resultHandler) {
	//console.log("Searching: " + keyword);
	var query = this.createQuery(keyword);
	
	var handler = this.createHandler(resultHandler); 
	if (query.method == "GET") {
		// console.log("Loading URL: " + query.url);
		request.get(query.url, handler);
	} else {
		throw new Error("Unsupported method " + query.method);
	}
}

BasePortal.prototype.createHandler = function(resultHandler) {
	var portal = this;
	return function(error, response, body) {
		//TODO handle error
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
BasePortal.prototype.findItems = function($) { throw new Exceptio("Implement me!"); }


BasePortal.prototype.parseItem = function($item) { throw new Exception("Implement me!"); }

BasePortal.prototype.createQuery = function(keyword) {
	var url = this.createQueryURL(keyword);
	return { method: "GET", url: url };
}

BasePortal.prototype.createQueryURL = function(keyword) { throw new Exception("Implement me!"); }

