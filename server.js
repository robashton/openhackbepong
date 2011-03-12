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
var zombieClients = [];
var waitingClient = null;

socket.on('connection', function(client){ 
	startGameWithClient(client);
 
  	client.on('message', function(data){
		switch(data.message) {
			case 'startgame':
				startGameWithClient(client);
			break;
			default:
				routeMessageFromClient(data, client);
			break;
      }
	});
	client.on('disconnect', function(){
      console.log('disconnected callback called!');

      if (isClientZombie(client)) {
        removeFromZombieClients(client);
		  return;
		}

		if(client == waitingClient){
			waitingClient = null;
			return;
		}

      var game = client.game;

		if(game.clientOne == client) 
        notifyOtherPlayersLeft(game.clientTwo);
      else 
        notifyOtherPlayersLeft(game.clientOne);

      games.splice(game.id, 1);
	} ); 
});

function routeMessageFromClient(messageFromOtherClient, client){
	var game = client.game;
	if(game.clientOne == client)
		game.clientTwo.send(messageFromOtherClient);
	else
		game.clientOne.send(messageFromOtherClient);
}

function startGameWithClient(client){
	if(isClientZombie(client)) {
		removeFromZombieClients(client);
	}
	     
	if(waitingClient == null){ waitingClient = client; return; }
	
	var game = {
		clientOne: waitingClient,
		clientTwo: client
	};	
   game.id = games.length;
	games.push(game);
	waitingClient = null;

	setupTheGame(game);
}

function removeFromZombieClients(client) {
  zombieClients.splice(client.zombieId, 1);
}

function notifyOtherPlayersLeft(client) {
  client.send({ message: "otherdisconnected" });
  addToZombieClients(client);
}

function isClientZombie(client) {
  if (client.zombieId) return true;
  return false;
}

function addToZombieClients(client) {
  client.game = null;
  client.zombieId = zombieClients.length;
  zombieClients.push(client);
}

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
