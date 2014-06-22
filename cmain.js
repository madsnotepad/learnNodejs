/**
 * The wrapper script to perform the functionality of scanning a directory
 * for feed files and processing them together. This script will POST the data after
 * all the files are processed. To process files individually to eliminate duplicated
 * items and making the POST refer main.js.
 */
var fs = require('fs');
var CumulativeFeedFileProcessor = require('./CumulativeFeedFileProcessor.js');
var RestClient = require('./RestClient.js');
var List = require('./List.js');

//Usage validation
if(process.argv.length != 4) {
	console.log('Usage node main.js <pathToProcess> <delimiter>');
	process.abort();
}

//Initialize the path and feed file delimiter
var pathToProcess = process.argv[2];
var feedDelimiter = process.argv[3];

var cumObjList = new List();
var fileList = new List();
var numberOfFiles = 0;

//scan the directory, iterate and process the feed files
function processDirectory() {
	fs.readdir(pathToProcess, function(err, files) {
		iteratateFileNHandleFile(err, files);
	});
}

//Iterate files and handle each file
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

/**
 * Handle the file using CumulativeFeedFileProcessor. Register for 'completedProcess' event to accumulate
 * the object list from the previous file process. updateObjectList is called to accumulate the object list
 * Note : the objectList contains only unique values as populated by the Feed file processor. The accumulated
 * object list is passed each time to the processor for it maintain unique values.
 */

function handleFile(fileName) {
	console.log(fileName);
	var hFeedFile = new CumulativeFeedFileProcessor(pathToProcess.concat('\\').concat(fileName), feedDelimiter, cumObjList);
	hFeedFile.on("completedProcess", updateObjectList);
	hFeedFile.processFile();
	hFeedFile.cleanUp();
}

//Add to the previous completed list.
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

//Callback method of 'completedProcess' event. This will make a POST request to
//REST API. We may have to implement pagination if the data is going to be large.
function postValues(objList) {
	console.log('post called');
	var rc = new RestClient('localhost', '/index.html', 'GET');
	rc.postRequest(JSON.stringify(objList), handleResponse);
	console.log('Submitted request');
}

//Callback method of REST API response
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


//Start the process
processDirectory();
