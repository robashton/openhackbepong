var http = require('http'),  
io = require('socket.io'), 
fs = require('fs');

server = http.createServer(function(req, res){ 
 res.writeHead(200, {'Content-Type': 'text/html'}); 
 fs.readFile('./index.html', function(err, data){
		res.write(data);
		res.end();
	});	

});
server.listen(8090);
  
// socket.io 
var socket = io.listen(server); 
socket.on('connection', function(client){ 
  client.on('message', function(){} ) 
  client.on('disconnect', function(){} ) 
}); 
