/**
 * Purpose of this js is to process a feed file. It uses the FileReader.js to read
 * the file. It listens for 'line' event emiited by FileReader and handles the line.
 * It converts it to a json object and stores it in a List. Duplicates are identified
 * using fname, lname combination. A List is maintained for this combination to avoid
 * iterating the List again and again for duplicate check. Have to figure out if an
 * equivalent of equals method is available in Javascript. FileReader.eof is Listened
 * to trigger the event 'completedProcess'
 *
 * Events Listened 	- FileReader.line, FileReader.eof
 * Events Emitted 	- completedProcess. This denotes the processing of the file has been
 *					  completed
 *					- invalidFeedItem. This is emitted when the number of parts or fname
 *					  or lname is not found
 */

var List = require('./List.js');
var FileReader = require('./FileReader.js');
var events = require('events');
var fileReader = null;


function FeedFileProcessor(file, delimiter) {
	this.file = file;
	if (!delimiter) {
		this.delimiter = " ";
	} else {
		this.delimiter = delimiter;
	}
	this.fileObjectList = new List();
	this.nameList = new List();
	console.log('-----------------HandleFeedFile--------------');
}

//Inherit the EventEmitter Class so that this class could trigger events
FeedFileProcessor.prototype = new events.EventEmitter;

/**
 * This will read the file using FileReader and handle events 'line' and 'eof'
 * on 'line' the content is processed
 * on 'eof' emits the completedProcess with list of objects processed for the file.
 */
FeedFileProcessor.prototype.processFile = function() {
	fileReader = new FileReader(this.file);
	var self = this;
	fileReader.on('line', function (evFileName, line) {
		handleContent(line, self)
	});
	fileReader.on('eof', function(evFileName) {
		completedProcess(self)
	});
	fileReader.readFile(1024);
}

/**
 * Splits the line based on the delimiter and checks for duplicates
 * before adding it to the object list.
 */
function handleContent(line, self) {
	//console.log('line ', line);
	var parts = line.split(self.delimiter);
	//console.log('parts.length ', parts.length, parts);
	if (parts.length != 5) {
		self.emit('invalidFeedItem', self.file, line);
		return;
	}
	var fname = parts[0];
	var lname = parts[1];
	var age = parts[2];
	var email = parts[3];
	if (fname || lname) {
		if (!self.nameList.exists(fname.concat(lname))) {
			var feedContent = FeedContent(fname, lname, age, email);
			self.fileObjectList.add(JSON.stringify(feedContent));
			self.nameList.add(fname.concat(lname));
		}
	} else {
		self.emit('invalidFeedItem', self.file, line);
		return;
	}
}

/**
 * Constructs the json object
 */
function FeedContent(fname, lname, age, email) {
	var json = {};
	json.fname = fname;
	json.lname = lname;
	json.age = age;
	json.email = email;
	return json;
}

/**
 * Emits 'completedProcess' event with file name and list of processed objects
 */
function completedProcess(self) {
	console.log('completedProcess called');
	self.emit('completedProcess', self.file, self.fileObjectList.getAll());
	console.log("Finished processing ", self.file);
	console.log("Contents are ", self.fileObjectList.getAll());

}

/**
 * This is a bit annoying. We have to remove the listeners after completion else
 * this keeps alive and gets triggered for events when a new object of this class
 * is created. For example, if an object of this class is created for the second time
 * the listeners FileReader.line, FileReader.eof of the previous objects are still
 * alive and will conflict with the new objects operation.
 */
FeedFileProcessor.prototype.cleanUp = function() {
	fileReader.cleanUp();
	this.removeAllListeners('completedProcess');
}

//Exports the functionality so that it could be imported as a module in another js script
module.exports = FeedFileProcessor;