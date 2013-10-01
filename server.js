/*

20130924
Live Web
Lottery Project
An improvement and exercise of WebSocket
with WebRTC and canvas

Kang Peng

*/


// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {
		console.log("v3 We have a new client: " + socket.id);



	    // // This object is for sending number chosed back to HTML
	    // // 'sendNumber' is the pair to the function named 'sendNumber' in HTML for showing numbers as data in 
	    // // a div named 'numbers'
	    socket.on('sendNumber',
	        function (number) {
     //        // number means the sent number from HTML named number and is broadcast by 
     //        // a socket fuction named broadcast.send
		     console.log("lottery number:" + number);
		     socket.broadcast.send(number);
	    });

		

        // Once the client has left
	    socket.on ('disconnect', function() {
		console.log("One client has left");
	    });


  }
);