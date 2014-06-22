/**
 * This is a helper class around an array, with methods to add
 * element, check existence of an element, etc.
 */

var List = function() {
	this.list = [];
}

List.prototype.add = function(value) {
	if (this.list.push(value) > 0) {
		return true;
	} else {
		return false;
	}
}

List.prototype.exists = function(value) {
	if (this.list.indexOf(value) == -1) {
		return false;
	} else {
		return true;
	}
}

List.prototype.getAll = function() {
	return this.list;
}

List.prototype.addIfNotExists = function(value) {
	if(!this.exists(value)) {
		return this.add(value);
	} else {
		return false;
	}
}

List.prototype.addAllUnique = function(anotherList) {
	console.log(anotherList, ' ' ,anotherList.length);
	for(var i = 0; i < anotherList.length; i++) {
		this.addIfNotExists(anotherList[i]);
	}
}


module.exports = List;