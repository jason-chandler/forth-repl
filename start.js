const server =  require('ws');
const net = require("net");
const repl = require("repl");
const readline = require("readline");
const wss = new server.WebSocketServer({ port: 9000 });
const initForth = require('js-forth');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const forth = initForth();

var remote
var socketSend
wss.on('connection', function connection(ws) {
    socketSend = function(input) {
	ws.send(input.replace('ok',''));
	remote.write('');
    }
  ws.on('message', function message(data) {
      console.log(data.toString());
      remote.write(data.toString());
  });

});


const rl = readline.createInterface({
    input: process.stdin,
    output: null
});



net.createServer(function (socket) {
    function onForthOutput (error, text) {
	let response = '';
	if(error != undefined) {
	    response += ('Error: ' + error.toString());
	}
	if (text != undefined) {
	    response += text.toString();
	}
	socket.write(response);
    };
    function f (text) {forth.run(text, onForthOutput)};
    remote = repl.start({prompt: '> ',
			 input: socket,
			 output: process.stdout,
			 eval: socketSend})
	  .on('exit', () => {socket.end();});
}).listen(9001);




function loadForth(file) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				console.log("ready");
                forth.run(xmlhttp.responseText, console.log);
            }
        };
        xmlhttp.open("GET", file, true);
		console.log("opened " + xmlhttp.readyState);
		console.log(xmlhttp.responseText);
        xmlhttp.send();
}



// loadForth("forth/forth.fth");

