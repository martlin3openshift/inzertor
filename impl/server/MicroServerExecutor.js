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

MicroServerExecutor.prototype.isStatic = function(url) {
	return this.checkPathRegex(url, this.staticPathsRegex);
}

MicroServerExecutor.prototype.isDynamic = function(url) {
	return this.checkPathRegex(url, this.dynamicPathsRegex);
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
			executor.respondError(404, "Dynamic content template not found");
			return false;
		} 
		
		var response = executor.makeResponse(200, type, str);
		executor.responseHandler(response);
		return true;
	};
	
	return ejs.renderFile(template, data, options, renderHandler);
}

/*
//XXX: Deprecated
MicroServerExecutor.prototype.supply = function(path, data, handler) {
	var isResource = path.indexOf("/resource/") == 0;
	
	if (isResource) {
		var subPath = path.replace("/resource/", "");
		var type = mime.lookup(subPath);
		this.supplyStaticResource(subPath, type, handler); 
	} else {
		var id = path.substr(1);
		this.renderHTMLTemplate(id, data, handler);
	}
}

MicroServerExecutor.prototype.supplyStaticResource = function(url) {
	var path = url.pathname;
	var resPath = path.replace("/resource/", "");
	
	console.log("Suplying static resource: " + resPath);
	var fullPath = "./" + resPath;	//TODO FIXME avoid directory traversal !
	var type = mime.lookup(resPath);
	
	var response;
	try {
		var content =	fs.readFileSync(fullPath);
		response = this.makeResponse(200, type, content);
	} catch (e) {
		response = this.makeResponse(404, 'text/plain', "Static resource file not found\n");
	}
	
	this.responseHandler(response);
}


MicroServerExecutor.prototype.renderHTMLTemplate = function(url, processors) {
	var path = url.pathname;
	var id = path.replace(/^\/([^\/]+)(.*)$/, "$1");
	
	console.log("Rendering html template: " + id);
	var supplier = this;
	var processor = processors[id];
	if (!processor) {
		var response = this.makeResponse(404, 'text/plain', "Processor not found\n");
		this.responseHandler(response);
		return;
	}
	
	var procesHandler = function(id, error, output) {
		supplier.renderTemplate(id, error, output);
	};
	
	processor(id, url, procesHandler);
}

MicroServerExecutor.prototype.renderTemplate = function(id, error, output) {
	var path = "templates/" + id + ".ejs";
	var data;
	if (error) {
		data = error;
	} else {
		data = output;
	}
	
	var options = {};
	var supplier = this;
	var renderHandler = function (err, str) {
		var response;
		if (err) {
			response = supplier.makeResponse(404, 'text/plain', "Template file not found\n");
		} else {
			response = supplier.makeResponse(200, 'text/html', str);
		}

		supplier.responseHandler(response);
	};
	
	
	ejs.renderFile(path, data, options, renderHandler);
}
*/
////////////////////////////////////////////////////////////////////////////////

MicroServerExecutor.prototype.checkPathRegex = function (url, regex) {
	var path = url.pathname;
	return path.match(regex);
}

MicroServerExecutor.prototype.respondError = function(status, message) {
	var response = this.makeResponse(status, 'text/plain', message + "\n");
	this.responseHandler(response);
}

MicroServerExecutor.prototype.makeResponse = function(status, type, content) {
	return { status: status, type: type, content: content };
}
