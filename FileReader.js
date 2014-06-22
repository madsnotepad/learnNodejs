var fs = require("fs");
var events = require('events');

function FileReader (fileName) {
	this.fileName = fileName;
	this.on('linesOccur', linesOccured);
}

FileReader.prototype = new events.EventEmitter;

function linesOccured(evFileName, lines) {
	if (evFileName == this.fileName) {
		var self = this;
		emitEachLine(self, evFileName, lines);
	}
}


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

function emitEachLine(self, fileName, lines) {
	for (var i = 0; i < lines.length; i++) {
		self.emit('line', fileName, lines[i]);
	}

}

FileReader.prototype.cleanUp = function() {
	this.removeAllListeners('linesOccur');
	this.removeAllListeners('eof');
	this.removeAllListeners('line');
	//self.removeListener('line');
	//self.removeListener('eof');
}


module.exports = FileReader;
