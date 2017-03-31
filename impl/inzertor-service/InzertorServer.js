
var url = require("url");


var InzertorSearchEngineService = require('../inzertor-service/InzertorSearchEngineService.js');
var MicroServerExecutor = require('../base-server/MicroServerExecutor.js');


InzertorServer = function() {
	//nothing
}

module.exports.InzertorServer = InzertorServer;


////////////////////////////////////////////////////////////////////////

InzertorServer.prototype.handleRequest = function(req, res) {
		var executor = this.createExecutor(req, res);

		var path = url.parse(req.url);
		executor.execute(path);		
};
////////////////////////////////////////////////////////////////////////


InzertorServer.prototype.createExecutor = function(req, res) {
	
	var isStatic = this.isStatic;
	var isDynamic = this.isDynamic;
	var urlToStaticPath = this.urlToStaticPath;
	var urlToDynamicId = this.urlToDynamicId;
	var idToDynamicTemplate = this.idToDynamicTemplate;
	var processor = this.process;
	var processors = {'form': processor };
	
	var responseHandler = function(response) {
		res.writeHead(response.status, {"Content-Type": response.type});
		res.end(response.content);
	};
	
	return new MicroServerExecutor.MicroServerExecutor(//
		isStatic, isDynamic, urlToStaticPath, urlToDynamicId, idToDynamicTemplate, processors, responseHandler);
};

InzertorServer.prototype.isStatic = function(url) {
	var path = url.pathname;
	return path.indexOf("/resources/") == 0;
};

InzertorServer.prototype.isDynamic =function(url) {
	var path = url.pathname;
	return path.indexOf("/form") == 0
		|| path.indexOf("/result") == 0;
};

InzertorServer.prototype.urlToStaticPath = function(url) {
	return "./" + url.pathname.replace("/resources/", "");
};

InzertorServer.prototype.urlToDynamicId = function(url) {
	return url.pathname.replace(/^\/([^\/]+)(\/.*)?$/, "$1");
};

InzertorServer.prototype.idToDynamicTemplate = function(id) {
	return "./templates/" + id + ".ejs";
};

InzertorServer.prototype.process = function(url, id, processHandler) {

	var params = this.parseParams(url);
	
	if (params.keyword) {
		var service = new InzertorSearchEngineService.InzertorSearchEngineService(params.portals);
	
		var itemsHandler = function(items) {
			var data = { keyword: params.keyword, items: items };
			processHandler(id, "text/html", null, data);		
		};
	
		service.query(params.keyword, itemsHandler);
	} else {
		var data = { keyword: null, items: null };	
		processHandler(id, "text/html", null, data);		
	}
};

////////////////////////////////////////////////////////////////////////

InzertorServer.prototype.parseParams = function(url) {
	var keyword = url.pathinfo.replace(/\/([^\/]+)\/(.+)/, "$2");
	console.log("???" + keyword);	//XXX
	var portals = InzertorSearchEngineService.InzertorSearchEngineService.ALL_PORTALS;	//TODO
	
	return {keyword: keyword, portals: portals};
};


