
var CommonPortal = require('./../portal-base/CommonPortal.js');


var AvizoPortal = function() {	
	CommonPortal.CommonPortal.call(this, "Avízo", "D.M.YYYY h:mm", //
		"https://www.avizo.cz/fulltext/?searchfor=ads&keywords=" + CommonPortal.CommonPortal.KEYWORD_NEEDLE, //
		CommonPortal.CommonPortal.PATH_NEEDLE); //
}

AvizoPortal.prototype = new CommonPortal.CommonPortal();
module.exports.AvizoPortal = AvizoPortal;

////////////////////////////////////////////////////////////////////////////////

AvizoPortal.prototype.selectorOfItems = function() {
	return 'div.content div.ailist.ft-ailist article.deflist';
}
AvizoPortal.prototype.selectorOfTitle = function() {
	return 'div.box h2 a';
}
AvizoPortal.prototype.selectorOfLink = function() {
	return 'div.box h2.typeinzSQR a';
}
AvizoPortal.prototype.selectorOfImage = function() {
	return 'p.photo a img';
}
AvizoPortal.prototype.selectorOfType = function() {
	return 'div.box p.info em';
}
AvizoPortal.prototype.selectorOfDesc = function() {
	return 'div.box p.text';
}
AvizoPortal.prototype.selectorOfDate = function() {
	return 'div.box p.info time';
}
AvizoPortal.prototype.selectorOfPlace = function() {
	return 'div.box p.region b';
}
AvizoPortal.prototype.selectorOfCost = function() {
	return 'div.box p.price strong';
}

////////////////////////////////////////////////////////////////////////////////

