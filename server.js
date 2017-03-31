var http = require('http');
var url = require("url");

var InzertorServer = require("./impl/inzertor-service/InzertorServer.js");


var is = new InzertorServer.InzertorServer();

var server = http.createServer(function(req, res) {
	is.handleRequest(req, res);	
});

server.listen(8080);

console.log("Server ready");
