var fs = require('fs'),
http = require('http'),
socketio = require('socket.io'),
url = require("url"),
serialport = require("serialport");

var SerialPort = serialport.SerialPort;

var socketServer;
var serialPort;
var portName = '/dev/tty.usbmodemFD121'; //change this to your Arduino port
var sendData = "";

// handle contains locations to browse to (vote and poll); pathnames.
function startServer(route,handle,debug)
{
	// on request event
	function onRequest(request, response) {
	  // parse the requested url into pathname. pathname will be compared
	  // in route.js to handle (var content), if it matches the a page will
	  // come up. Otherwise a 404 will be given.
	  var pathname = url.parse(request.url).pathname;
	  console.log("Request for " + pathname + " received");
	  var content = route(handle,pathname,response,request,debug);
	}

	var httpServer = http.createServer(onRequest).listen(1337, function(){
		console.log("Listening at: http://localhost:1337");
		console.log("Server is up");
	});
	serialListener(debug);
	initSocketIO(httpServer,debug);
}

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);
	if(debug == false){
		socketServer.set('log level', 1); // socket IO debug off
	}
	socketServer.on('connection', function (socket) {
	console.log("user connected");
	socket.emit('onconnection', {pollOneValue:sendData});
	socketServer.on('update', function(data) {
	socket.emit('updateData',{pollOneValue:data});
	});
	socket.on('sendAT', function(data) {
		serialPort.write('AT\r');
		console.log('sending AT...');
	});
 });
}

// Listen to serial port
function serialListener(debug)
{
    var receivedData = "";
    serialPort = new SerialPort(portName, {
        baudrate: 19200,
				parser: serialport.parsers.readline("\n")
    });

    serialPort.on("open", function () {
      console.log('opened serial communication');

            // Listens to incoming data
        serialPort.on('data', function(data) {
             //receivedData += data.toString();
          //if (receivedData .indexOf('E') >= 0 && receivedData .indexOf('B') >= 0) {
           sendData = data; //.substring(receivedData .indexOf('B') + 1, receivedData .indexOf('E'));
           receivedData = '';
					 console.log('server event happening..' + data + '.\r');
         //}
         // send the incoming data to browser with websockets.
       //socketServer.emit('update', sendData);

			 //if is message and is parsed
			 socketServer.emit('newMessage', sendData);
      });
			//setTimeout(sendPin,500);
			serialPort.write('AT+CPIN=3797\r');
			console.log("Sent Pincode...");
    });
}

function sendPin(){
serialPort.write('AT+CPIN=3797\r');
console.log("Sent Pincode...");
}


exports.start = startServer;
