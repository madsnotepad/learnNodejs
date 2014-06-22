var http = require('http');

var RestClient = function(hostname, path, methodType) {
	this.hostname = hostname;
	this.path = path;
	this.methodType = methodType;
}

/*
var options = {
	hostname: 'google.co.in',
	path: '/index.html'
};
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
	console.log("DATA******************* ", data);
	requestHandle.write(data);
	requestHandle.end();
}

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


module.exports = RestClient;





