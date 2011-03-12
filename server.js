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
   game.id = games.length();
	games.push(game);
	waitingClient = null;

	setupTheGame(game);

  	client.on('message', function(data){
		
	});
	client.on('disconnect', function(){
      var game = client.game;
      if (game.disconnected) return;

		if(game.clientOne == client) 
        game.clientTwo.send({ message: "otherdisconnected" });
      else 
        game.clientOne.send({ message: "otherdisconnected" });

      game.disconnected = true;
      games.splice(game.id, 1);
	} ); 
}); 


function setupTheGame(game)
{
	game.clientOne.game = game;
	game.clientTwo.game = game;

	game.clientOne.send({
		message: 'start'
	});
	game.clientTwo.send({
		message: 'start'
	});
}
