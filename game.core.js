var UUID = require('node-uuid');

var io=require('socket.io');

var game_core = function(gameID){
	this.game_id = gameID;

	this.players = {
		player1 = null;
		player2 = null;
	}

//	this.players.player1.on('load game', loadGame);

}

var game_core = module.exports;