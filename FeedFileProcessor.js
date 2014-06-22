var List = require('./List.js');
var FileReader = require('./FileReader.js');
var fs = require('fs');
var events = require('events');
var fileReader = null;


function HandleFeedFile(file, delimiter) {
	console.log('-----------------HandleFeedFile Const--------------');
	this.file = file;
	if (!delimiter) {
		this.delimiter = " ";
	} else {
		this.delimiter = delimiter;
	}
	this.fileObjectList = new List();
	this.nameList = new List();
	console.log('-----------------HandleFeedFile--------------', this.fileObjectList);
}


HandleFeedFile.prototype = new events.EventEmitter;

/*
HandleFeedFile.prototype.init = function(file, delimiter) {
	this.file = file;
	if (!delimiter) {
		this.delimiter = " ";
	} else {
		this.delimiter = delimiter;
	}
	this.fileObjectList = new List();
	this.nameList = new List();
	console.log('-----------------HandleFeedFile--------------', this.fileObjectList);
	this.on('newListener', function(name) {
		console.log('hf Event : ' + name);
		});

}
*/


HandleFeedFile.prototype.processFile = function() {
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


function handleContent(line, self) {
	console.log('line ', line);
	var parts = line.split(self.delimiter);
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
	}
}

function FeedContent(fname, lname, age, email) {
	var json = {};
	json.fname = fname;
	json.lname = lname;
	json.age = age;
	json.email = email;
	return json;
}

function completedProcess(self) {
	console.log('completedProcess called');
	self.emit('completedProcess', self.file, self.fileObjectList.getAll());
	console.log("Finished processing ", self.file);
	console.log("Contents are ", self.fileObjectList.getAll());

}

HandleFeedFile.prototype.close = function() {
	fileReader.cleanUp();
	this.removeAllListeners('completedProcess');
}

module.exports = HandleFeedFile;