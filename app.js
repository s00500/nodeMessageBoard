console.log("hello world\r");

var http = require("http");
var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<!DOCTYPE 'html'>");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>Hello World Page</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("Hello World!");
  response.write("</body>");
  response.write("</html>");
  response.end();
});

server.listen(5000);
console.log("Server is listening");

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
});

serialPort.write("AT+CPIN?\r");
});
