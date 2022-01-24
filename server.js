var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
users = [];
connections =[];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connecter %s sockets connected', connections.length);

    // déconnexion
    connections.splice(connections.indexOf(socket), 1);
    console.log('Déconnecter %s sockets connected', connections.length);
});