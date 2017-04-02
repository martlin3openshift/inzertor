var BasePortal = require('./../portal-base/BasePortal.js');
var moment = require('moment');

var CommonPortal = function(name, dateFormat, queryUrlPattern, relativeUrlPattern) {
	BasePortal.BasePortal.call(this, name);
	
	this.dateFormat = dateFormat;
	this.queryUrlPattern = queryUrlPattern;
	this.relativeUrlPattern = relativeUrlPattern;
}

module.exports.CommonPortal = CommonPortal;

CommonPortal.KEYWORD_NEEDLE = "$keyword";
CommonPortal.PATH_NEEDLE = "$path";
CommonPortal.prototype = BasePortal.BasePortal.prototype;

////////////////////////////////////////////////////////////////////////////////

CommonPortal.prototype.findItems = function($) {
	var selector = this.selectorOfItems();
	return $(selector);
}

CommonPortal.prototype.selectorOfItems = function() { throw new Exception("Implement me!"); }


CommonPortal.prototype.parseItem = function($item) {
	var title = this.inferTitle($item);
	var url = this.inferUrl($item);
	var image = this.inferImage($item);
	var type = this.inferType($item);
	var desc = this.inferDesc($item);
	var date = this.inferDate($item);
	var place = this.inferPlace($item);
	var cost = this.inferCost($item);
	
	return { title: title, url: url, image: image, type: type, desc: desc, date: date, place: place, cost: cost, portal: this.name };
}


////////////////////////////////////////////////////////////////////////////////
// infer*

CommonPortal.prototype.inferTitle = function($item) { 
	var $title = this.select$Title($item);
	if (!$title || $title.lenght == 0) throw new Error("Missing title");
	
	return $title.text();
}
CommonPortal.prototype.inferUrl = function($item) {
	var $link = this.select$Link($item);
	if (!$link || $link.lenght == 0) throw new Error("Missing link");
	
	var path = $link.attr('href');
	return this.postprocesURL(path);
}
CommonPortal.prototype.inferImage = function($item) { 
	var $image = this.select$Image($item);
	if (!$image || $image.length == 0) return null;
	
	var path = $image.attr('src');
	return this.postprocesURL(path);
}
CommonPortal.prototype.inferType = function($item) { 
	var $type = this.select$Type($item);
	if (!$type || $type.lenght == 0) return null;
	
	return $type.text();

}
CommonPortal.prototype.inferDesc = function($item) { 
	var $desc = this.select$Desc($item);
	if (!$desc) return null;
	
	return $desc.html();
}
CommonPortal.prototype.inferDate = function($item) { 
	var $date = this.select$Date($item);
	if (!$date || $date.lenght == 0) return null;
	
	var str = $date.text();
	return this.parseDate(str);	
}
CommonPortal.prototype.inferPlace = function($item) { 
	var $place = this.select$Place($item);
	if (!$place) return null;

	return $place.text();
}
CommonPortal.prototype.inferCost = function($item) { 	
	var $cost = this.select$Cost($item);
	if (!$cost) return null;

	return $cost.text();
}


////////////////////////////////////////////////////////////////////////////////
// select$*

CommonPortal.prototype.select$Items = function($item) { 
	var selector = this.selectorOfItems();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Title = function($item) { 
	var selector = this.selectorOfTitle();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Link = function($item) {
	var selector = this.selectorOfLink();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Image = function($item) { 
	var selector = this.selectorOfImage();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Type = function($item) { 
	var selector = this.selectorOfType();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Desc = function($item) { 
	var selector = this.selectorOfDesc();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Date = function($item) { 
	var selector = this.selectorOfDate();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Place = function($item) { 
	var selector = this.selectorOfPlace();
	return this.applySelector($item, selector);
}
CommonPortal.prototype.select$Cost = function($item) { 	
	var selector = this.selectorOfCost();
	return this.applySelector($item, selector);
}

////////////////////////////////////////////////////////////////////////////////
// selectorOf*

CommonPortal.prototype.selectorOfItems = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfTitle = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfLink = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfImage = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfType = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfDesc = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfDate = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfPlace = function() { throw new Exception("Implement me!"); }
CommonPortal.prototype.selectorOfCost = function() { throw new Exception("Implement me!"); }

////////////////////////////////////////////////////////////////////////////////
// misc

CommonPortal.prototype.createQueryURL = function(keyword) {
	//TODO url encoding ?
	return this.queryUrlPattern.replace(CommonPortal.KEYWORD_NEEDLE, keyword);
}


CommonPortal.prototype.parseDate = function(string) {
	return moment(string, this.dateFormat);
}

CommonPortal.prototype.postprocesURL = function(url) {
	return this.relativeUrlPattern.replace(CommonPortal.PATH_NEEDLE, url);
}


CommonPortal.prototype.applySelector = function($target, selector) {
	if (selector == null) {
		return null;
	} else  {
		return $target.find(selector);
	}
}
