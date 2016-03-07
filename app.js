var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var debug = false;

var handle = {}
handle["/"] = requestHandlers.sendInterface;
handle["/interface"] = requestHandlers.sendInterface;

server.start(router.route,handle,debug);




// old app.js
/*
console.log("hello world\r");
var port = 3000;
var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var serialPort = new SerialPort("/dev/tty.usbmodemFD121", {
  baudrate: 19200,
  parser: serialport.parsers.readline("\n")
});


serialPort.on("open", function () {
  console.log('open');
serialPort.on("data", function (data) {
  console.log("here: "+data);

  app.get('/', function (req, res) {
    res.send(data)
  })
});

serialPort.write("AT+CPIN?\r");
});
*/
