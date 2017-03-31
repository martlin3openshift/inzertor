
var CommonPortal = require('./../portal-base/CommonPortal.js');


var BazosPortal = function() {	
	CommonPortal.CommonPortal.call(this, "Bazos", "D.M.YYYY", //
		"https://www.bazos.cz/search.php?hledat=" + CommonPortal.CommonPortal.KEYWORD_NEEDLE, //
		CommonPortal.CommonPortal.PATH_NEEDLE); //
}

BazosPortal.prototype = new CommonPortal.CommonPortal();
module.exports.BazosPortal = BazosPortal;

////////////////////////////////////////////////////////////////////////////////

BazosPortal.prototype.selectorOfItems = function() {
	return 'span.vypis table.inzeraty';
}
BazosPortal.prototype.selectorOfTitle = function() {
	return 'td[width="63%"] span.nadpis a';
}
BazosPortal.prototype.selectorOfLink = function() {
	return 'td[width="63%"] span.nadpis a';
}
BazosPortal.prototype.selectorOfImage = function() {
	return 'td[width="63%"] a img.obrazek';
}
BazosPortal.prototype.selectorOfType = function() {
	return null;
}
BazosPortal.prototype.selectorOfDesc = function() {
	return 'td[width="63%"] div.popis';
}
BazosPortal.prototype.selectorOfDate = function() {
	return 'td[width="63%"] span.velikost10';
}
BazosPortal.prototype.selectorOfPlace = function() {
	return 'td[width="15%"]:nth-child(3)';	//TODO second one
}
BazosPortal.prototype.selectorOfCost = function() {
	return 'td[width="15%"] span.cena b';
}

////////////////////////////////////////////////////////////////////////////////

