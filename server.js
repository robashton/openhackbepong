http = require('http'),  
path = require('path'),
io = require('socket.io'), 
fs = require('fs');
paperboy = require('paperboy'),

WEBROOT = path.join(path.dirname(__filename), 'home');

server = http.createServer(function(req, res){ 
	paperboy
	.deliver(WEBROOT, req, res)
	.addHeader('Cache-Control', 'no-cache');
});
server.listen(8090);
  
// socket.io 
var socket = io.listen(server); 


var games = [];

var waitingClient = null;

socket.on('connection', function(client){ 

	if(waitingClient == null){ waitingClient = client; return; }
	
	var game = {
		clientOne: waitingClient,
		clientTwo: client
	};	

	games.push(game);
	waitingClient = null;

	setupTheGame(game);

  	client.on('message', function(data){
	
	});
	client.on('disconnect', function(){

	} ); 
}); 


function setupTheGame(game)
{
	game.clientOne.clientId = 1;
	game.clientTwo.clientId = 2;

	game.clientOne.game = game;
	game.clientTwo.game = game;

	game.clientOne.send({
		message: 'start'
	});
	game.clientTwo.send({
		message: 'start'
	});
}
