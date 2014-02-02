var game_server = module.exports;
var io=require('socket.io');
require('./game.core.js');

var player_username_array = [], player_array = [], gameArray = [];


game_server.addPlayer = function(socket, username){
	socket.username = username;

	var new_player = new player(socket, username);
	this.player_array[username] = new_player;
	this.player_username_array[username] = username;
}

game_server.challenge = function(challenger, challenged){
	var socket = this.player_username_array[challenged].socket;
	socket.emit('new challenger', {username: challenger});
}

game_server.acceptChallenge = function(challenger, challenged, gameID){
	var socket = this.player_username_array[challenger].socket;
	socket.emit('challenge accepted', {username: challenged});
	socket.emit('your game id', {game_id: game});

	newGame(challenger, challenged, gameID);
}

game_server.newGame = function(challenger, challenged, gameID){
	var newGame = new game_core(gameID);
	gameArray[gameID] = newGame;
}

game_server.joinGame = function(socket, username, gameID){
	var game_instance = gameArray[gameID];
	
	if (game_instance.players.player1 == null){
		socket.set(gameID + ' player1', function(){});
		game_instance.players.player1 = new player(socket, username);
	}
	else {
		socket.set(gameID + ' player2', function(){});
		game_instance.players.player2 = new player(socket, username);;
		sio.sockets.in(gameID).emit('players connected');
	}

	gameArray[gameID] = game_instance;
}

game_server.disconnect = function(socket){
	delete this.player_array[socket.username];
}