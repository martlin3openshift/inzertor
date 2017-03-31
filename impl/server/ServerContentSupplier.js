var ejs = require("ejs");
var fs = require('fs');
var mime = require('mime-types')

ServerContentSupplier = function(responseHandler) {
	this.responseHandler = responseHandler;
}

module.exports.ServerContentSupplier = ServerContentSupplier;

////////////////////////////////////////////////////////////////////////////////
ServerContentSupplier.prototype.isResource = function(url) {
	return url.path.indexOf("/resource/") == 0;
}

//XXX: Deprecated
ServerContentSupplier.prototype.supply = function(path, data, handler) {
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

ServerContentSupplier.prototype.supplyStaticResource = function(url) {
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


ServerContentSupplier.prototype.renderHTMLTemplate = function(url, processors) {
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

ServerContentSupplier.prototype.renderTemplate = function(id, error, output) {
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

ServerContentSupplier.prototype.makeResponse = function(status, type, content) {
	return { status: status, type: type, content: content };
}
