var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var debug = false; // todo move this to configfile

var handle = {}
handle["/"] = requestHandlers.sendInterface;
handle["/interface"] = requestHandlers.sendInterface;
handle["/sprite/emoji.css"] = requestHandlers.sendEmojiCss;
handle["/sprite/emoji.png"] = requestHandlers.sendEmojiPng;
handle["/js/jquery-1.12.1.min"] = requestHandlers.sendJquery;
handle["/js/jquery-ui.js"] = requestHandlers.sendJqueryUI;
handle["/css/bootstrap.min.css"] = requestHandlers.sendBootstrap;

handle["/clear"] = requestHandlers.sendClear;
if(server.demoMode==1){
handle["/demo"] = requestHandlers.sendDemo;
}else{
  console.log("ERROR: Demo mode not active");
}


server.start(router.route,handle,debug);
