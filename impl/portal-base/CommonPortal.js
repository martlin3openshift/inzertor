var BasePortal = require('./../portal-base/BasePortal.js');


var CommonPortal = function(name, urlPattern) {
	BasePortal.BasePortal.call(this, name);

	this.urlPattern = urlPattern;
}

module.exports.CommonPortal = CommonPortal;

CommonPortal.KEYWORD_NEEDLE = "$keyword";
CommonPortal.prototype = BasePortal.BasePortal.prototype;

////////////////////////////////////////////////////////////////////////////////

CommonPortal.prototype.findItems = function($) {
	var selector = this.selectorOfItems();
	return $(selector);
}

CommonPortal.prototype.selectorOfItems = function() { throw new Exception("Implement me!"); }


CommonPortal.prototype.parseItem = function($item) {
	var $title = $item.find(this.selectorOfTitle());
	var $link = $item.find(this.selectorOfLink());
	var $image = $item.find(this.selectorOfImage());
	var $type = $item.find(this.selectorOfType());
	var $date = $item.find(this.selectorOfDate());
	var $place = $item.find(this.selectorOfPlace())
	var $cost = $item.find(this.selectorOfCost());
	
	//TODO create custom methods
	var title = $title.html();
	var url = $link.attr('href');
	var image = $image.attr('src');
	var type = $type.html();
	var date = $date.html();	//TODO parse
	var place = $place.html();
	var cost = $cost.html();
	
	return { title: title, url: url, image: image, type: type, date: date, place: place, cost: cost, portal: this.name };
}


CommonPortal.prototype.selectorOfItems = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfTitle = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfLink = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfImage = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfType = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfDate = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfPlace = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfCost = function() { throw new Exception("Implement me!"); }



CommonPortal.prototype.createQueryURL = function(keyword) {
	//TODO url encoding
	return this.urlPattern.replace(CommonPortal.KEYWORD_NEEDLE, keyword);
}

