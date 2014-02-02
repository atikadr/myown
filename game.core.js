var UUID = require('node-uuid');

var io=require('socket.io');

var game_core = function(gameID){
	this.game_id = gameID;

	this.players = {
		player1 = null;
		player2 = null;
	}


}

var player = function(socket, username){
	this.username = username;
	this.socket = socket;
}

game_core.loadGame(){
	var user = this.username;
}

var game_core = module.exports;