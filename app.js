var 
	io=require('socket.io'),
	express=require('express'),
	UUID=require('node-uuid'),
	path=require('path'),
	mysql=require('node-mysql'),
	app = express();

var game_server = require('./server.js');
var game_core = require('./game.core.js');
var room_players = require('./routes/players');

app.configure(function(){
	app.use(express.static(path.join(__dirname,'')));
});

var server = require('http').createServer(app).listen(8080);
sio = io.listen(server);

console.log("listening");

sio.sockets.on('connection', function(socket){

	//call this event after player loads the gameroom
	//player must emit his username
	//not implemented with REST API becuase it is hard to detect users that disconnect?
	socket.on('join room', function(data){
		socket.join('gameroom');
		game_server.addPlayer(socket, data.username);
		socket.emit('get players', {players: server.player_username_array});
		sio.sockets.in('gameroom').emit('new player joined room', {player: data.username});
	});

	//call this event when a player clicks to challenge another in the gameroom
	//player must emit {challenger: my username, challenged: the other's username}
	socket.on('challenge', function(data){
		game_server.challenge(data.challenger, data.challenged);
	});

	//call this event when a player accepts the challenge
	//player must emit {challenger: the other's username, challenged: my username}
	//in the future, game id will be stored in a cookie
	socket.on('accept challenge', function(data){
		var gameID = UUID();
		game_server.acceptChallenge(data.challenger, data.challenged, gameID);
		socket.emit('your game id', {game_id: game});

		//create new game
		//game_server.newGame(data);
	});

	//call this event after player loads the game page
	//player must emit {username: my username, game_id: the given game id}
	socket.on('setup game', function(data){
		socket.userid = UUID();
		socket.join(data.game_id);
		game_server.joinGame(socket, data.username, data.game_id);
	});

	socket.on('load game', game_core.loadGame());

	socket.on('disconnect', function(){
		//check if this user is part of gameroom
		game_server.disconnect(socket);
	});
	
});