
var url = require("url");
var querystring = require('querystring');
var NodeSession = require('node-session');


var InzertorSearchEngineService = require('../inzertor-service/InzertorSearchEngineService.js');
var MicroServerExecutor = require('../base-server/MicroServerExecutor.js');


InzertorServer = function() {
	this.session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
	//TODO use me!

}

module.exports.InzertorServer = InzertorServer;
InzertorServer.MAIN_PAGE_NAME = "hledej";

////////////////////////////////////////////////////////////////////////

InzertorServer.prototype.handleRequest = function(req, res) {
		var executor = this.createExecutor(req, res);

		var path = url.parse(req.url);
		executor.execute(path);		
};
////////////////////////////////////////////////////////////////////////


InzertorServer.prototype.createExecutor = function(req, res) {
	var server = this;
	
	
		var callback = function() { console.log(arguments); }	//TODO callback
		server.session.startSession(req, res, callback);
	
	var isStatic = this.isStatic = function(url) {
		var path = url.pathname;
		return path.indexOf("/resources/") == 0;
	};

	var isDynamic = function(url) {
		var path = url.pathname;
		return (path == "") || (path == "/")
			|| (path.indexOf("/" + InzertorServer.MAIN_PAGE_NAME) == 0)
			|| (path.indexOf("/prihlaseni") == 0) 
			|| (path.indexOf("/registrace") == 0)
			|| (path.indexOf("/odhlaseni") == 0);
	};

	var urlToStaticPath = function(url) {
		return "./" + url.pathname.replace("/resources/", "");
	};

	var urlToDynamicId = function(url) {
		var path = url.pathname;
		if ((path == "") || (path == "/")) {
			return InzertorServer.MAIN_PAGE_NAME;
		} else {
			return url.pathname.replace(/^\/([^\/]+)(\/.*)?$/, "$1");
		}
	};

	var idToDynamicTemplate = function(id) {
		return "./templates/" + id + ".ejs";
	};

	var hledejProcessor =  function(url, id, processHandler) {
		var params = server.parseParams(url);
	
		if (params.keyword) {
			var service = new InzertorSearchEngineService.InzertorSearchEngineService(params.portals);

			var itemsHandler = function(items) {
				var data = { keyword: params.keyword, items: items, login: { login: req.session.get("login") } };
				processHandler(id, "text/html", null, data);		
			};
	
			service.query(params.keyword, itemsHandler);
		} else {
			var data = { keyword: null, items: null, login: { login: req.session.get("login") } };	
			processHandler(id, "text/html", null, data);		
		}
	};
	
	var prihlaseniProcessor = function(url, id, processHandler) {
		
		//TODO login
		req.session.put("login", "user");	//TODO put real username
		
		var data = { keyword: null, login: { loginSucessful: true, login: req.session.get("login")} };

		processHandler("hledej", "text/html", null, data);
	};


	var odhlaseniProcessor = function(url, id, processHandler) {
		
		//TODO login
		req.session.forget("login");	//TODO put real username
		
		var data = { keyword: null, login: { login: null} };

		processHandler("hledej", "text/html", null, data);
	};

	var registraceProcessor = function(url, id, processHandler) {
		//TODO register
		
		var data = { keyword: null, login: { registerSucessful: true, login: null} };
		
		processHandler("hledej", "text/html", null, data);
	};
	


	var processors = {'hledej': hledejProcessor, 
		'prihlaseni': prihlaseniProcessor, 'odhlaseni': odhlaseniProcessor,'registrace': registraceProcessor};
	
	var responseHandler = function(response) {
		res.writeHead(response.status, {"Content-Type": response.type});
		res.end(response.content);
	};
	
	return new MicroServerExecutor.MicroServerExecutor(//
		isStatic, isDynamic, urlToStaticPath, urlToDynamicId, idToDynamicTemplate, processors, responseHandler);
};

////////////////////////////////////////////////////////////////////////

InzertorServer.prototype.parseParams = function(url) {
	var query = url.pathname.replace("/" + InzertorServer.MAIN_PAGE_NAME, "");
	if (query.indexOf("/" == 0)) {
		query = query.substr(1);
	}
	var keyword = querystring.unescape(query);
	var portals = InzertorSearchEngineService.InzertorSearchEngineService.ALL_PORTALS;	//TODO

	return {keyword: keyword, portals: portals};
};


