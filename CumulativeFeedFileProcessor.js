var HandleFeedFile = require('./FeedFileProcessor.js');

var CumulativeHandleFeedFile = function(file, delimiter, previousFileList) {
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


CumulativeHandleFeedFile.prototype = new HandleFeedFile();


module.exports = CumulativeHandleFeedFile;
