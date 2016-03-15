// functions that will be executed when
// typeoff handle[pathname] === a function in requestHandlers.
// the handle and function are discribed in index.js

var fs = require('fs'),
server = require('./server');

function sendInterface(response) {
  console.log("Request handler 'interface' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var html = fs.readFileSync(__dirname + "/board.html")
  response.end(html);
}

function sendCss(response) {
  console.log("Request handler 'css' was called.");
  response.writeHead(200, {"Content-Type": "text/css"});
  var html = fs.readFileSync(__dirname + "/served/emoji.css")
  response.end(html);
}
function sendPng(response) {
  console.log("Request handler 'png' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  var html = fs.readFileSync(__dirname + "/served/emoji.png")
  response.end(html);
}

exports.sendPng = sendPng;
exports.sendCss = sendCss;
exports.sendInterface = sendInterface;
