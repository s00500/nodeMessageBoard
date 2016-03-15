var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var debug = false;

var handle = {}
handle["/"] = requestHandlers.sendInterface;
handle["/interface"] = requestHandlers.sendInterface;
handle["/sprite/emoji.css"] = requestHandlers.sendCss;
handle["/sprite/emoji.png"] = requestHandlers.sendPng;

server.start(router.route,handle,debug);
