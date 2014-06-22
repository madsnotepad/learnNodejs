/**
 * This class will read a file and emit event for every line of the file.
 * This will read a block of file based on the required buffer size and
 * will split at new line ('\n'). When there are partial lines read into
 * the buffer complete lines are emitted as 'lines' event. Partial line is
 * added to the next read and handled.
 * For convenience 'line' event is emitted which will emit each line. Client
 * can use any of these as per their requirement. 'eof' is emitted when the
 * file reaches its end.
 *
 * Events Listened	- this.linesOccur, this is listened to emit each line event
 * Events Emitted 	- 'linesOccur', this is emitted along with an array of lines
 					  read equivalent to the passed buffer size
 					- 'line', this is emitted for each line along with the line
 					  content
 */
var fs = require("fs");
var events = require('events');

//Constructor
function FileReader (fileName) {
	this.fileName = fileName;
	this.on('linesOccur', linesOccured);
}

//Inherits EventEmitter so that this class could emit events
FileReader.prototype = new events.EventEmitter;

/**
 * Callback method for 'linesOccur' event. It will call emitEachLine
 * which will iterate the lines emiited by 'linesOccur' to emit 'line'
 * event.
 */
function linesOccured(evFileName, lines) {
	if (evFileName == this.fileName) {
		var self = this;
		emitEachLine(self, evFileName, lines);
	}
}

/**
 * This will read the file based on passed buffer size. Lines are identified
 * using '\n' and is emitted along with 'linesOccur' event. Partial line is
 * preserved and is added to the next buffer read. After the end of file
 * 'eof' event is emiited.
 */
FileReader.prototype.readFile = function(bufferSize) {
	console.log(this.fileName);
	var buf = new Buffer(bufferSize);
	var fd = fs.openSync(this.fileName, 'r');
	var offset = 0;
	var pointer = 0;
	var bytesRead = 1;
	var previousReadLastChunk = '';
	while (bytesRead > 0) {
		bytesRead = fs.readSync(fd, buf, offset, bufferSize, pointer);
		pointer = pointer + bytesRead;
		var bufRead = buf.toString("ascii", 0, bytesRead);
		var readLines = previousReadLastChunk.concat(bufRead);
		var lines = readLines.split("\n");
		var lastLine = lines[lines.length-1];
		if (lastLine.indexOf("\n") != -1) {
			previousReadLastChunk = '';
			this.emit('linesOccur', this.fileName, lines);
		} else if (lines.length == 1) {
			//last line
			previousReadLastChunk = '';
			this.emit('linesOccur', this.fileName, lines);
		} else if (lines.length == 0) {
			//skip
			console.log("lines is 0");
		} else {
			previousReadLastChunk = lines[lines.length-1];
			//console.log('partial lines', lines.slice(0, (lines.length - 1)), '\n');
			this.emit('linesOccur', this.fileName, lines.slice(0, (lines.length - 1)));
		}
	}
	console.log(">>>>>>>>>>>>>>>>Emitted EOF>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
	this.emit('eof', this.fileName);
};

/**
 * This will iterate the lines emitted and emit 'line' event for each line.
 */
function emitEachLine(self, fileName, lines) {
	for (var i = 0; i < lines.length; i++) {
		self.emit('line', fileName, lines[i]);
	}
}

/**
 * This is a bit annoying. We have to remove the listeners after completion else
 * this keeps alive and gets triggered for events when a new object of this class
 * is created. Refer example of the problem in FeedFileProcessor.js
 */
FileReader.prototype.cleanUp = function() {
	this.removeAllListeners('linesOccur');
	this.removeAllListeners('eof');
	this.removeAllListeners('line');
}

//Exports the functionality so that it could be imported as a module in another js script
module.exports = FileReader;
