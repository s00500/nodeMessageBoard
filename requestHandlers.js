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

function sendEmojiCss(response) {
  console.log("Request handler 'Emojicss' was called.");
  response.writeHead(200, {"Content-Type": "text/css"});
  var html = fs.readFileSync(__dirname + "/served/emoji.css")
  response.end(html);
}

function sendEmojiPng(response) {
  console.log("Request handler 'Emojipng' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  var html = fs.readFileSync(__dirname + "/served/emoji.png")
  response.end(html);
}

function sendBootstrap(response) {
  console.log("Request handler 'css' was called.");
  response.writeHead(200, {"Content-Type": "text/css"});
  var html = fs.readFileSync(__dirname + "/served/bootstrap.min.css")
  response.end(html);
}

function sendJquery(response) {
  console.log("Request handler 'jquery' was called.");
  response.writeHead(200, {"Content-Type": "application/javascript"});
  var html = fs.readFileSync(__dirname + "/served/jquery-1.12.1.min.js")
  response.end(html);
}

function sendJqueryUI(response) {
  console.log("Request handler 'jqueryUI' was called.");
  response.writeHead(200, {"Content-Type": "application/javascript"});
  var html = fs.readFileSync(__dirname + "/served/jquery-ui.js")
  response.end(html);
}

function sendClear(response) {
  console.log("Request handler 'clear' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  var html = fs.readFileSync(__dirname + "/clear.html");
  response.end(html);
}

function sendDemo(response) {
  console.log("Request handler 'demo' was called.");
    response.writeHead(200, {"Content-Type": "text/html"});
    var html = fs.readFileSync(__dirname + "/demo.html");
    response.end(html);
}

exports.sendClear = sendClear;
exports.sendDemo = sendDemo;


exports.sendBootstrap = sendBootstrap;
exports.sendJqueryUI = sendJqueryUI;
exports.sendJquery = sendJquery;
exports.sendEmojiPng = sendEmojiPng;
exports.sendEmojiCss = sendEmojiCss;
exports.sendInterface = sendInterface;
