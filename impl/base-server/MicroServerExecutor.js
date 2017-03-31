var ejs = require("ejs");
var fs = require('fs');
var mime = require('mime-types')

MicroServerExecutor = function(isStatic, isDynamic, urlToStaticPath, urlToDynamicId, idToDynamicTemplate, dynamicProcessors, responseHandler) {
	this.isStatic = isStatic;
	this.isDynamic = isDynamic;
	this.urlToStaticPath = urlToStaticPath;
	this.urlToDynamicId = urlToDynamicId;
	this.idToDynamicTemplate = idToDynamicTemplate;
	this.dynamicProcessors = dynamicProcessors;
	this.responseHandler = responseHandler;
}

module.exports.MicroServerExecutor = MicroServerExecutor;

////////////////////////////////////////////////////////////////////////////////

MicroServerExecutor.prototype.execute = function(url) {
	if (this.isStatic(url)) {
		this.executeStatic(url);
		return true;
	}
	if (this.isDynamic(url)) {
		this.executeDynamic(url);
		return true;
	}
	
	this.respondError(404, "Unsupported request");
}

////////////////////////////////////////////////////////////////////////////////

MicroServerExecutor.prototype.executeStatic = function(url) {
	var path = this.urlToStaticPath(url);
	var type = mime.lookup(path);
	
	var content;
	try {
		content =	fs.readFileSync(path);		
	} catch (e) {
		this.respondError(404, "Static content not found");
		return false;
	}
	
	var response = this.makeResponse(200, type, content);
	this.responseHandler(response);
	return true;
}

MicroServerExecutor.prototype.executeDynamic = function(url) {
	var id = this.urlToDynamicId(url);
	
	var processor = this.dynamicProcessors[id];
	if (!processor) {
		this.respondError(404, "Dynamic content processor not found");
		return false;
	}
	
	return this.runProcessor(url, id, processor);
}

MicroServerExecutor.prototype.runProcessor = function(url, id, processor) {
	var executor = this;
	var processorHandler = function(id, type, error, outcome) {	
		if (error) {
			executor.respondError(500, "Dynamic content proces failed: " + error);
			return false;
		}
		return executor.renderTemplate(id, type, outcome);
	};
	
	return processor(url, id, processorHandler);
}

MicroServerExecutor.prototype.renderTemplate = function(id, type, data) {
	var executor = this;
	var template = this.idToDynamicTemplate(id);
	var options = {};
	var renderHandler = function (err, str) {
		if (err) {
			if (err.code) {
				executor.respondError(404, "Dynamic content template not found");
			}  else  {
				executor.respondError(500, "Error in dynamic content template");
			} 			
			//console.log(JSON.stringify(err));
			return false;
		} 
		
		var response = executor.makeResponse(200, type, str);
		executor.responseHandler(response);
		return true;
	};
	
	return ejs.renderFile(template, data, options, renderHandler);
}

////////////////////////////////////////////////////////////////////////////////


MicroServerExecutor.prototype.makeResponse = function(status, type, content) {
	return { status: status, type: type, content: content };
}

MicroServerExecutor.prototype.respondError = function(status, message) {
	var response = this.makeResponse(status, 'text/plain', message + "\n");
	this.responseHandler(response);
}

