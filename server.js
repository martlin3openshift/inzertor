var http = require('http');
var url = require("url");

var AnnoncePortal = require('./impl/portal-impls/AnnoncePortal.js');


function inferQueryKeyword(req) {
	var reqUrl = url.parse(req.url, true);
  var reqQuery = reqUrl.query;
  var keyword = reqQuery.query;
	return keyword;
}

function doTheQuery(keyword, responseHandler) {
	var portal = new AnnoncePortal.AnnoncePortal();
	var result = [];
	var handler = function(items) {
		result.push(items);
		responseHandler(result);	//TODO what with this
	}
	
	portal.query(keyword, handler);
}


var server = http.createServer(function(req, res) {
	var keyword = inferQueryKeyword(req);
	var responseHandler = function(items) {
		res.end(JSON.stringify(items, null, 2));	
	}

	console.log("Querying " + keyword + " ...");	
	doTheQuery(keyword, responseHandler);
	


  res.writeHead(200);
  //res.end('Hello Httpy\n');
});
server.listen(8080);

console.log("Server ready");
