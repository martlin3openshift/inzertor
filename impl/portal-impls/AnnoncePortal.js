
var CommonPortal = require('./../portal-base/CommonPortal.js');


var AnnoncePortal = function() {	
	CommonPortal.CommonPortal.call(this, "Annonce", "D.M.YYYY", //
		"http://www.annonce.cz/vsechny-inzeraty$18-filter.html?q=" + CommonPortal.CommonPortal.KEYWORD_NEEDLE, //
		"http://www.anonce.cz" + CommonPortal.CommonPortal.PATH_NEEDLE); //
}

AnnoncePortal.prototype = CommonPortal.CommonPortal.prototype;
module.exports.AnnoncePortal = AnnoncePortal;

////////////////////////////////////////////////////////////////////////////////

AnnoncePortal.prototype.selectorOfItems = function() {
	return '.box.q.ext-item';
}
AnnoncePortal.prototype.selectorOfTitle = function() {
	return 'h2 a';
}
AnnoncePortal.prototype.selectorOfLink = function() {
	return 'h2 a';
}
AnnoncePortal.prototype.selectorOfImage = function() {
	return 'a.thumbnail img';
}
AnnoncePortal.prototype.selectorOfType = function() {
	return 'div.request-type';
}
AnnoncePortal.prototype.selectorOfDesc = function() {
	return 'div.description p a';
}
AnnoncePortal.prototype.selectorOfDate = function() {
	return 'div.ad-date';
}
AnnoncePortal.prototype.selectorOfPlace = function() {
	return 'div.data table.attrs td[colspan="2"]';
}
AnnoncePortal.prototype.selectorOfCost = function() {
	return 'div.data strong.mini-sticker span';
}

////////////////////////////////////////////////////////////////////////////////

