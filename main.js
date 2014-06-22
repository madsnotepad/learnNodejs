var fs = require('fs');
var HandleFeedFile = require('./FeedFileProcessor.js');
var RestClient = require('./RestClient.js');

if(process.argv.length != 4) {
	console.log('Usage node main.js <pathToProcess> <delimiter>');
	process.abort();
}
var pathToProcess = process.argv[2];
var feedDelimiter = process.argv[3];

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
	console.log(files.length);
	for(var i = 0; i < files.length; i++) {
		handleFile(files[i]);
	}
}

function handleFile(fileName) {
	console.log(fileName);
	var hFeedFile = new HandleFeedFile(pathToProcess.concat('\\').concat(fileName), feedDelimiter);
	hFeedFile.on("completedProcess", postValues);
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

function postValues(file, objList) {
	var rc = new RestClient('localhost', '/index.html', 'GET');
	rc.postRequest(JSON.stringify(objList), handleResponse);
	console.log('Submitted request for ' + file);
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
