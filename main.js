/**
 * The wrapper script to perform the functionality of scanning a directory
 * for feed files and processing it. This script will POST the data once each file
 * is processed. To process all the files together to eliminate duplicated across
 * the files before making the POST refer cmain.js.
 */

var fs = require('fs');
var FeedFileProcessor = require('./FeedFileProcessor.js');
var RestClient = require('./RestClient.js');

//Usage validation
if(process.argv.length != 5) {
	console.log('Usage node main.js <pathToProcess> <delimiter> <feedFileExtn>');
	process.abort();
}

//Initialize the path and feed file delimiter
var pathToProcess = process.argv[2];
var feedDelimiter = process.argv[3];
var feedFileExtn = process.argv[4];

//scan the directory, iterate and process the feed file one by one
function processDirectory() {
	fs.readdir(pathToProcess, function(err, files) {
		iteratateFileNHandleFile(err, files);
	});
}

//Iterate files and handle each file
function iteratateFileNHandleFile(err, files) {
	if(err) {
		console.log('Error occured during file scan. Error is ', err);
		process.abort();
	}
	console.log(files.length);
	for(var i = 0; i < files.length; i++) {
		var fileExtn = getFileExtension(files[i]);
		if (fileExtn) {
			if (fileExtn == feedFileExtn) {
				handleFile(files[i]);
			} else {
				console.log('----Skipping file since extension does not match. File name - ', files[i]);
			}
		} else {
				console.log('----Skipping file since extension does not match. File name - ', files[i]);
		}
	}
}

/**
 *Handle the file using FeedFileProcessor. Register for 'completedProcess' event to POST
 * request to the REST API
 */
function handleFile(fileName) {
	console.log(fileName);
	var hFeedFile = new FeedFileProcessor(pathToProcess.concat('\\').concat(fileName), feedDelimiter);
	hFeedFile.on('completedProcess', postValues);
	hFeedFile.on('invalidFeedItem', logInvalidItem);
	hFeedFile.processFile();
	hFeedFile.cleanUp();
}

//Callback method of 'completedProcess' event. This will make a POST request to
//REST API. We may have to implement pagination if the data is going to be large.
function postValues(file, objList) {
	var rc = new RestClient('localhost', '/index.html');
	rc.postRequest(JSON.stringify(objList), handleResponse);
	console.log('Submitted request for ' + file);
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

function logInvalidItem(fileName, line) {
	console.log('Detected invalid line item in ', fileName, ' item is - ', line);
}

function getFileExtension(fileName) {
	return fileName.substr(fileName.lastIndexOf('.') + 1);
}

//Start the process
processDirectory();
