
var AnnoncePortal = require('../portal-impls/AnnoncePortal.js');
var AvizoPortal = require('../portal-impls/AvizoPortal.js');
var BazosPortal = require('../portal-impls/BazosPortal.js');
var SBazarPortal = require('../portal-impls/SBazarPortal.js');

InzertorSearchEngineService = function (portals) {
	this.portals = portals;
}

InzertorSearchEngineService.ALL_PORTALS = [ //
	new AnnoncePortal.AnnoncePortal(),	//
	new AvizoPortal.AvizoPortal(),	//
	new BazosPortal.BazosPortal(),	//
	new SBazarPortal.SBazarPortal(),	//
]; //

module.exports.InzertorSearchEngineService = InzertorSearchEngineService;

////////////////////////////////////////////////////////////////////////////////

InzertorSearchEngineService.prototype.query = function(keyword, itemsHandler) {
	console.log("Querying:: " + keyword);
	var result = [];
	var remainingPortals = this.portals.length;
	
	for (i = 0; i < this.portals.length; i++) {
		var portal = this.portals[i];
		
		var portalHandler = function(items) {
			remainingPortals--;
			result.push.apply(result, items);
			
			if (remainingPortals == 0) {
				itemsHandler(result);
			}
		};
		
		portal.query(keyword, portalHandler);
	}
}

