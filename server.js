var http = require('http'),  
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
var clients = [];

socket.on('connection', function(client){ 
	clients.push(client);
	client.index = clients.length-1;

  	client.on('message', function(data){
		for(i in clients){
			if(clients[i] != undefined)
				clients[i].send(data);
		}
	} ) 
  	client.on('disconnect', function(){
		clients.splice(client.index, 1);
	} ) 
}); 
