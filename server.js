var http = require('http');
var url = require("url");
var moment = require('moment');

//var AnnoncePortal = require('./impl/portal-impls/AnnoncePortal.js');
//var BazosPortal = require('./impl/portal-impls/BazosPortal.js');
//var AvizoPortal = require('./impl/portal-impls/AvizoPortal.js');
var SBazarPortal = require('./impl/portal-impls/SBazarPortal.js');


function inferPath(req) {
	var reqUrl = url.parse(req.url, true);
  var reqPath = reqUrl.pathname;
	return reqPath;
}

function inferQueryKeyword(req) {
	var reqUrl = url.parse(req.url, true);
  var reqQuery = reqUrl.query;
  var keyword = reqQuery.query;
	return keyword;
}

function doTheQuery(keyword, responseHandler) {
	var portal = new SBazarPortal.SBazarPortal();
	//new AvizoPortal.AvizoPortal();
	//new BazosPortal.BazosPortal();
	//new AnnoncePortal.AnnoncePortal();
	
	var result = [];
	var handler = function(items) {
		result = result.concat(items);
		responseHandler(result);	//TODO what with this
	}
	
	portal.query(keyword, handler);
}

function itemsToJSON(keyword, items) {
	return JSON.stringify(items, null, 2);	
}

function itemsToHTML(keyword, items) {
	var html = "";
	html += "<html>";
	html += "<head><title>Search results for " + keyword + "</title></head>\n";
	html += "<body><h1>Search results for " + keyword + "</h1>\n<ul>\n\n";
	
	for (var i = 0; i < items.length; i++) {
	  var item = items[i];
  	
  	html += "<li>\n";
  	html += "<h2>" + item.title + "</h2>\n";
	  html += "<img src='" + item.image + "' alt='[preview]'>\n";
	  html += "<span>" + item.portal + "</span>, \n";
	  html += "<a href='" + item.url + "'>link</a>, \n";
	  html += "<span>" + item.type + "</span>, \n";
	  html += "<span>" + moment(item.date).format("D.M.YYYY") + "</span>, \n";
	  html += "<span>" + item.place + "</span>, \n";
	  html += "<span>" + item.cost + "</span>\n";
	  html += "<div>" + item.desc + "</div>\n";
  	html += "</li>\n\n";
	}
	
	html += "</ul></body>\n";
	html += "</html>";
	
	return html;
}

function makeHandler(res, keyword, itemsToStringFun) {
	return function(items) {
		var str = itemsToStringFun(keyword, items);
		res.write(str);
		res.end();
	}
}

var server = http.createServer(function(req, res) {
	var path = inferPath(req);
	var keyword = inferQueryKeyword(req);	
	var responseHandler;
	
	if (path == "/query.json") {
		responseHandler = makeHandler(res, keyword, itemsToJSON);
	} else if (path == "/query.html") {
		responseHandler = makeHandler(res, keyword, itemsToHTML);
	} else {
		res.writeHead(404);
		res.end("Use query.json or query.html\n");
		return;
	}
	

	console.log("Querying " + keyword + " ...");	
	res.writeHead(200);
	doTheQuery(keyword, responseHandler);
});
server.listen(8080);

console.log("Server ready");
