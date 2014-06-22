var fs = require('fs');
var CumulativeFeedFileProcessor = require('./CumulativeFeedFileProcessor.js');
var RestClient = require('./RestClient.js');
var List = require('./List.js');

if(process.argv.length != 4) {
	console.log('Usage node main.js <pathToProcess> <delimiter>');
	process.abort();
}
var pathToProcess = process.argv[2];
var feedDelimiter = process.argv[3];

var cumObjList = new List();
var fileList = new List();
var numberOfFiles = 0;

function processDirectory() {
	fs.readdir(pathToProcess, function(err, files) {
		iteratateFileNHandleFile(err, files);
	});
}

function iteratateFileNHandleFile(err, files) {
	if(err) {
		console.log(err);
		process.abort();
	}
	numberOfFiles = files.length;
	console.log(files.length);
	for(var i = 0; i < files.length; i++) {
		handleFile(files[i]);
	}
}

function handleFile(fileName) {
	console.log(fileName);
	var hFeedFile = new CumulativeFeedFileProcessor(pathToProcess.concat('\\').concat(fileName), feedDelimiter, cumObjList);
	hFeedFile.on("completedProcess", updateObjectList);
	hFeedFile.processFile();
	hFeedFile.close();
}

function printValues(file, objList) {
	console.log(file);
	console.log("obj", objList);
	for(var i = 0; i < objList.length; i++) {
		console.log("obj " + objList[i]);
	}
}

function updateObjectList(file, objList) {
	cumObjList.addAllUnique(objList);
	console.log('before fileList ', fileList);
	fileList.add(file);
	console.log('after fileList ', fileList);
	console.log(numberOfFiles, ' ', fileList.getAll().length);
	if(numberOfFiles == fileList.getAll().length) {
		console.log('post values');
		postValues(cumObjList);
	}
}

function postValues(objList) {
	console.log('post called');
	var rc = new RestClient('localhost', '/index.html', 'GET');
	rc.postRequest(JSON.stringify(objList), handleResponse);
	console.log('Submitted request');
}

function handleResponse(response) {
	console.log('---------response---------------');
	response.setEncoding('utf8');
	response.on('data', function (chunk) {
	    console.log('=========BODY========: ' + chunk);
  	});
    response.on("end", function () {
        console.log('end');
    });
};



console.log(pathToProcess);

processDirectory();

//handleFile('test');
