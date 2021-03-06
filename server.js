/*

20130924
Live Web
Lottery Project
An improvement and exercise of WebSocket
with WebRTC and canvas

Kang Peng
ktp242@nyu.edu


20130930
1) set up username and receive it from client
2) set up a object users to store the userInfo

20131001
3) set up an array to store winnerNumber


20131002
4) tried to put timer and generate winnerNumber inside here

20131004
5) set an array winnerNumbers to store multiple winner numbers

20131007
6) set the getWinner function
7) set io.sockets.emit to client

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

// create an object to store the info of users
var users = {};

// create an array to store the winner number
var winnerNumbers = [];


// Register a callback function to run when we have an individual connection
// Once a new user has connected, the function will refresh and create a new socket object for him/her
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {
		console.log("v32 We have a new client: " + socket.id);



	    // This object is for sending number chosed back to HTML
	    // 'sendNumber' is the pair to the function named 'sendNumber' in HTML for showing numbers as data in 
	    // a div named 'numbers'
	    socket.on('sendInfo',
	        function (number, username) {
             
             // number and username mean the sent number and username from HTML
		     // add values to the object users 
             users[username]= number;
		     console.log("lottery user:" + username + "+" + number);
		     console.log(users);
             
             // send number and username back to the HTML
		     socket.broadcast.send(number, username);
	    });


	    
	    var getWinner = function() {
	    	   
	           var duration = 40;
	    	   var winnerNumber;

	    	   setInterval(function()
	    	   {
	     	       if (duration > 0)
	     	       { duration --; }        
	               else
	               {
		               winnerNumber = Math.floor(Math.random()*10);
		        	   winnerNumbers.push(winnerNumber);
		        	   console.log("winner number is " + winnerNumber);
		        	   duration = 40;
	               }                   
                   io.sockets.emit('getWinner', duration, winnerNumber);
               }
     	       ,1000);
	    	};

	    getWinner();



        // Once the client has left
	    socket.on ('disconnect', function() {
		console.log("One client has left");
	    });


  }
);