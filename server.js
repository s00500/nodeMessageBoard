var fs = require('fs'),
http = require('http'),
socketio = require('socket.io'),
url = require("url"),
serialport = require("serialport");
low = require('lowdb'),
storage = require('lowdb/file-async'),
db = low('db.json', { storage });

var convert = require('emojize').emojize;

var SerialPort = serialport.SerialPort;
var config = low('config.json', { storage });
var socketServer;
var port = config('mainConfig').chain().find({ param: 'port' }).value()['value'];
var serialPort;
var portName = config('mainConfig').chain().find({ param: 'serialport' }).value()['value'];

var numberStringRecieved = "";
var numberRecieved = "";
var timeRecieved = "";
var color = 0;

// utility function for ucs2 decode
function ucs2Parse(ucs2){
	codeArray = ucs2.match(/.{1,4}/g);
	var returnString = "";
	for(i=0;i<codeArray.length;i++){
		returnString += String.fromCharCode(parseInt(codeArray[i], 16));
	}
	return returnString;
}


// handle contains locations to browse to (vote and poll); pathnames.
function startServer(route,handle,debug)
{

  db('messages').size(); //call this once to establish the db if there is nothing in the json file
  var mynumber = config('mainConfig').chain().find({ param: 'mynumber' }).value()['value'];
  if(db('messages').size() == 0)db('messages').push({ numberString: "",number: mynumber, time: "now", message: "SMS MessageBoard",color: 0 });

	// on request event
	function onRequest(request, response) {
	  // parse the requested url into pathname. pathname will be compared
	  // in route.js to handle (var content), if it matches the a page will
	  // come up. Otherwise a 404 will be given.
	  var pathname = url.parse(request.url).pathname;
	  console.log("Request for " + pathname + " received");
	  var content = route(handle,pathname,response,request,debug);
	}

	var httpServer = http.createServer(onRequest).listen(port, function(){
		console.log("Listening at: http://localhost:"+port);
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
	socket.emit('onconnection');

	socket.on('getConfig', function(data) {
		var number = config('mainConfig').chain().find({ param: 'mynumber' }).value()['value'];
		socket.emit('config',number);
	});

	socket.on('sendAT', function(data) {
		serialPort.write('AT\r');
		console.log('sending AT...');
	});

	socket.on('getLastMessages', function(number) {
		console.log('retrieving messages');
	var times = db('messages').chain().takeRight(number).map('time').value();
	var numbers = db('messages').chain().takeRight(number).map('number').value();
	var messages = db('messages').chain().takeRight(number).map('message').value();
	var colors = db('messages').chain().takeRight(number).map('color').value();

	for(var i = 0; i < messages.length; i++){
	socket.emit('newMessage',times[i],numbers[i],convert(messages[i]),colors[i]);
  }
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

        serialPort.on('data', function(data) {
					console.log('Incomming serial data...\r');
					console.log(data);
					console.log("\r"); //+data.length
				 // send the incoming data to clients using the socket.
		    if(data.startsWith("+CMT:")){ // if message ok
					numberStringRecieved = data;
					numberRecieved = data.substring(data.indexOf('+CMT: "') + 7, data.indexOf('",'));
					numberRecieved = ucs2Parse(numberRecieved);
					timeRecieved = data.substring(data.indexOf('","","') + 15, data.indexOf('+04'));
				} else if (data.length > 1) {

					if(numberRecieved){
						//console.log("emit");
						var color = db('messages').chain().takeRight(1).map('color').value();
						console.log(JSON.stringify(color));
						if (color == null)color = 0;//no messages yet
						color++;
						if(color > 4) color = 0;
          var messageRecieved = ucs2Parse(data);
					 db('messages').push({ numberString: numberStringRecieved,number: numberRecieved, time: timeRecieved, message: messageRecieved,color: color });
					 //add a new message to the board directly
           socketServer.emit('newMessage', timeRecieved, numberRecieved, messageRecieved,color);
					 numberStringRecieved = null;
					 numberRecieved = null;
					 timeRecieved = null;
				  }
				  else {
          //console.log("nothing");
				  }
        } else {
					//debugMessages trigger an alert on the clients
		 	    //socketServer.emit('debugMessage', data);
		      }
        });
			var pincode = config('mainConfig').chain().find({ param: 'pincode' }).value()['value'];
			serialPort.write('AT+CPIN='+pincode+'\r');
			console.log("Sent Pincode...");
    });
}


exports.start = startServer;
