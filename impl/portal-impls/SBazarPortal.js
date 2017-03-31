
var CommonPortal = require('./../portal-base/CommonPortal.js');


var SBazarPortal = function() {	
	CommonPortal.CommonPortal.call(this, "SBAZAR", null, //
		"https://www.sbazar.cz/hledej/" + CommonPortal.CommonPortal.KEYWORD_NEEDLE, //
		"https://www.sbazar.cz" + CommonPortal.CommonPortal.PATH_NEEDLE); //
}

SBazarPortal.prototype = CommonPortal.CommonPortal.prototype;
module.exports.SBazarPortal = SBazarPortal;

////////////////////////////////////////////////////////////////////////////////

SBazarPortal.prototype.selectorOfItems = function() {
	return 'div#mrEggsResults div.mrEgg';
}
SBazarPortal.prototype.selectorOfTitle = function() {
	return 'div.frame a span.description span.foggy span.descText span.title';
}
SBazarPortal.prototype.selectorOfLink = function() {
	return 'div.frame a.mrEggPart';
}
SBazarPortal.prototype.selectorOfImage = function() {
	return 'div.frame a span.image img.foggy';
}
SBazarPortal.prototype.selectorOfType = function() {
	return null;
}
SBazarPortal.prototype.selectorOfDesc = function() {
	return 'div.frame a span.description span.foggy span.descText';
}
SBazarPortal.prototype.selectorOfDate = function() {
	return null;
}
SBazarPortal.prototype.selectorOfPlace = function() {
	return 'div.frame a span.description span.foggy span.data span.datarow span.location.cell';
}
SBazarPortal.prototype.selectorOfCost = function() {
	return 'div.frame a span.description span.foggy span.data span.datarow strong.price.cell';
}

////////////////////////////////////////////////////////////////////////////////


SBazarPortal.prototype.inferImage = function($item) { 
	var $image = this.select$Image($item);
	
	var path = $image.attr('data-origin');
	if (path) {
		return path;
	} else {
		return null;
	}
}
