var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Connection
io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connecter %s sockets_connected', connections.length);

    // Déconnexion
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Déconnecter %s sockets_connected', connections.length);
    });

    // Envoyer des message
    socket.on('send_message', function(data){
        io.sockets.emit('new_message', {msg: data, user: socket.username});
    });

    // Nouvelle utilisateur
    socket.on('new_user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    // Pour mettre a jour les nom d'utilisateurs
    function updateUsernames(){
        io.sockets.emit('get_users', users);
    }
});