var ejs = require("ejs");
var fs = require('fs');
var mime = require('mime-types')

ServerContentSupplier = function() {
	// nothing
}

module.exports.ServerContentSupplier = ServerContentSupplier;

////////////////////////////////////////////////////////////////////////////////
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


ServerContentSupplier.prototype.supplyStaticResource = function(path, type, handler) {
	console.log("Suplying static resource: " + path);
	var fullPath = "./" + path;	//TODO FIXME avoid directory traversal !
	
	var response;
	try {
		var content =	fs.readFileSync(fullPath);
		response = this.makeResponse(200, type, content);
	} catch (e) {
		response = this.makeResponse(404, 'text/plain', "Static resource file not found\n");
	}
	
	handler(response);
}


ServerContentSupplier.prototype.renderHTMLTemplate = function(id, data, handler) {
	console.log("Rendering html template: " + id);
	var path = "templates/" + id + ".ejs";
	var options = {};
	var supplier = this;

	var renderHandler = function (err, str) {
		var response;
		if (err) {
			response = supplier.makeResponse(404, 'text/plain', "Template file not found\n");
		} else {
			response = supplier.makeResponse(200, 'text/html', str);
		}

		handler(response);
	};
	
	ejs.renderFile(path, data, options, renderHandler);
}

ServerContentSupplier.prototype.makeResponse = function(status, type, content) {
	return { status: status, type: type, content: content };
}
