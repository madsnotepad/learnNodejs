/**
 * This is a sub class of FeedFileProcessor to handle if the requirement is to
 * process all the files and remove duplicates before making the RESTful service
 * call.
 */
var FeedFileProcessor = require('./FeedFileProcessor.js');

//Takes an additional parameter previousFileList that contains object from the previous
//feeds processor. fileObjectList is initialized with this list.
var CumulativeFeedFileProcessor = function(file, delimiter, previousFileList) {
	console.log('-------------CumulativeHandleFeedFile constructor-------------', previousFileList);
	this.file = file;
	if (!delimiter) {
		this.delimiter = " ";
	} else {
		this.delimiter = delimiter;
	}
	if (!previousFileList) {
		this.fileObjectList = new List();
	} else {
		this.fileObjectList = previousFileList;
	}
}

//Inherit the EventEmitter Class so that this class could trigger events
CumulativeFeedFileProcessor.prototype = new FeedFileProcessor();

//Exports the functionality so that it could be imported as a module in another js script
module.exports = CumulativeFeedFileProcessor;
