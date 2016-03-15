var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var debug = false;

var handle = {}
handle["/"] = requestHandlers.sendInterface;
handle["/interface"] = requestHandlers.sendInterface;
handle["/sprite/emoji.css"] = requestHandlers.sendEmojiCss;
handle["/sprite/emoji.png"] = requestHandlers.sendEmojiPng;
handle["/js/jquery-1.12.1.min"] = requestHandlers.sendJquery;
handle["/js/jquery-ui.js"] = requestHandlers.sendJqueryUI;
handle["/css/bootstrap.min.css"] = requestHandlers.sendBootstrap;

server.start(router.route,handle,debug);
