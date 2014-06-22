/**
 * This is a helper class for making REST API calls.
 * Supports POST and GET method. Callbacks to handle response
 * are with the caller of this class.
 */


var http = require('http');

//Constructor
var RestClient = function(hostname, path) {
	this.hostname = hostname;
	this.path = path;
}

/**
 * POST method. Takes the data to POST and response callback
 * method to be called.
 */
RestClient.prototype.postRequest = function(data, callback) {
	var options = {
		hostname: this.hostname,
		path: this.path,
		method: 'POST'
	};
	var requestHandle = http.request(options, function(res) {
		console.log("post request is submitted");
		callback(res);});
	requestHandle.write(data);
	requestHandle.end();
}

/**
 * GET method. Takes the response callback method to be called.
 */

RestClient.prototype.getRequest = function(callback) {
	var options = {
		hostname: this.hostname,
		path: this.path,
		method: 'GET'
	};
	var requestHandle = http.request(options, function(res) {
		console.log("get request is submitted");
		callback(res);});
	requestHandle.end();
}

//Exports the functionality so that it could be imported as a module in another js script
module.exports = RestClient;





