/**
 * A simple http server that will respond back with the
 * same requested data as response. This is only for testing
 * the feed files handling and there are no routers or other
 * functionality
 */
var http = require("http");
var server = http.createServer(function(request, response) {
	var requestContent = '';
	request.on('data', function(data) {
		console.log('received', data);
		requestContent = requestContent.concat(data);
	});
	request.on('end', function() {
		console.log('received full --- ', requestContent);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(requestContent);
		response.end();
	});
});

server.listen(80);
console.log("Server is listening");