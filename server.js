var game_server = module.exports;
var io=require('socket.io');
require('./game.core.js');

var player_array = [], gameArray = [];


game_server.addPlayer = function(socket, username){
	socket.username = username;

	socket.emit('get players', {players: server.player_array});
	
	this.player_array[username] = socket;
}

game_server.challenge = function(challenger, challenged){
	var socket = this.player_array[challenged];
	socket.emit('new challenger', {username: challenger});
}

game_server.acceptChallenge = function(challenger, challenged, gameID){
	var socket = this.player_array[challenger];
	socket.emit('challenge accepted', {username: challenged});
	socket.emit('your game id', {game_id: game});

	newGame(challenger, challenged, gameID);
}

game_server.newGame = function(challenger, challenged, gameID){
	var newGame = new game_core(gameID);
	gameArray[gameID] = newGame;
}

game_server.joinGame = function(socket, username, gameID){
	socket.username = username;
	var game_instance = gameArray[gameID];
	
	if (game_instance.players.player1 == null){
		socket.set(gameID + ' player1');
		game_instance.players.player1 = socket;
	}
	else {
		socket.set(gameID + ' player2');
		game_instance.players.player2 = socket;
		sio.sockets.in(gameID).emit('players connected');
	}

	gameArray[gameID] = game_instance;
}

game_server.disconnect = function(socket){
	delete this.player_array[socket.username];
}