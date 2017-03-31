var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var url = require("url");

//var AnnoncePortal = require('./impl/portal-impls/AnnoncePortal.js');
var MicroServerExecutor = require('./impl/server/MicroServerExecutor.js');


////////////////////////////////////////////////////////////////////////
var handler = function(response) {
	console.log(response);
};
var staticPathsRegex = /^\/resources\/(.+)$/;
var dynamicPathsRegex = /^\/(form)(\/.*)?$/;
var isStatic = function(url) {
	var path = url.pathname;
	return path.indexOf("/resources/") == 0;
}
var isDynamic = function(url) {
	var path = url.pathname;
	return path.indexOf("/form") == 0
		|| path.indexOf("/result") == 0;
}
var urlToStaticPath = function(url) {
	return "./" + url.pathname.replace("/resources/", "");
};
var urlToDynamicId = function(url) {
	return url.pathname.replace(/^\/([^\/]+)(\/.*)?$/, "$1");
};
idToDynamicTemplate = function(id) {
	return "./templates/" + id + ".ejs";
};
var processor = function(url, id,processHandler) {
	console.log("PROCESSING: " +  id);
	processHandler(id, "text/html", null, { title: "[some data]" });
};
var processors = {'form': processor };
var supl = new MicroServerExecutor.MicroServerExecutor(isStatic, isDynamic, urlToStaticPath, urlToDynamicId, idToDynamicTemplate, processors, handler);

var url1 = url.parse("/form");
var url2 = url.parse("/XXXform");
var url3 = url.parse("/resources/css/styles.css");
var url4 = url.parse("/resources/server.js");
var url5 = url.parse("/foo/bar/baz");

console.log(!!supl.isStatic(url1));
console.log(!!supl.isStatic(url3));
console.log(!!supl.isDynamic(url1));
console.log(!!supl.isDynamic(url3));

console.log("-------------------");

supl.executeStatic(url1);
supl.executeStatic(url3);
supl.executeStatic(url4);

console.log("-------------------");

supl.executeDynamic(url1);
supl.executeDynamic(url2);
supl.executeDynamic(url3);

console.log("-------------------");

supl.execute(url1);
supl.execute(url2);
supl.execute(url3);
supl.execute(url4);
supl.execute(url5);




/*
var processor = function(id, url, processHandler) {
	console.log("PROCESSING: " +  id);
	processHandler(id, null, { title: "[some data]" });
}
var processors = {'form': processor };
supl.renderHTMLTemplate(url.parse('/form'), processors);
supl.renderHTMLTemplate(url.parse('/form/input	'), processors);
supl.renderHTMLTemplate(url.parse('/XXXform'), processors);

console.log("-------------------");

supl.supplyStaticResource(url.parse('/css/styles.css'));
supl.supplyStaticResource(url.parse('/css/XXXstyles.css'));

console.log("-------------------");

//supl.supply('/resource/css/styles.css', {}, handler);
//supl.supply('/form', {}, handler);

console.log("-------------------");

supl.supplyStaticResource(url.parse('/resource/server.js'));

*/
/*

var portal = new AnnoncePortal.AnnoncePortal();

var handler = function(items) { console.log(items); };
portal.query("chleba", handler);
*/
/*






var errorHandler = function(error) {
	console.log('ERROR: ' + error);
}

var stock = 'Chleba';
var url = 'http://www.annonce.cz/vsechny-inzeraty$18-filter.html?q=' + stock;

var handler =
 function (error, response, body) {
  console.log('Respond: ', response && response.statusCode);
	var $ = cheerio.load(body);

	var $query = $('#search-q');
	console.log('Value: ' + $query.val());	//FIXME
		
	var $items = $('.box.q.ext-item');
	console.log('Items count: ' + $items.length);

	$items.each(function(i, $elem) {
		var $item = $(this);

		var $header = $item.find('h2 a');
		console.log('- item: ');
		console.log('   title: ' + $header.html());

		var $link = $item.find('h2 a');
		console.log('   url:   ' + $link.attr('href'));




	});	



};

request.get(url, handler);
//	.on('response', handler)
//	.on('error', errorHandler);
*/

////////////////////////////////////////////////////////////////////////



/*
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
*/



/*
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Hello Http');
});
server.listen(8080);
*/
console.log('Done.');


