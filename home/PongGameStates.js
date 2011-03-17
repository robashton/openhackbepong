var PongGameStates = PongGameStates || {};

PongGameStates.WaitingForGameToStart = {
		gamestart: function(data) {
			if(data.player == 'left'){
				this.setPlayerAsLeft();
			} else
			{
				this.setPlayerAsRight();
			}
			this.changeState(PongGameStates.WaitingForRoundToStart);
		}
};

PongGameStates.WaitingForRoundToStart = {
	init: function(data){
		this.publisher.publish({message: 'waitingforround'});
	},
	roundstart: function(data) {
		if(data.goingFirst){
			this.setPlayerIsStarting();
		}
		else {
			this.setOtherPlayerIsStarting();
		}
		this.changeState(PongGameStates.StartRound);
	}	
};

PongGameStates.StartRound = {
	leftpaddlestart: function(data) {
		this.model.sendLeftPaddleStart();
		this.changeState(PongGameStates.Playing);
	},
	rightpaddlestart: function(data) {
		this.model.sendRightPaddleStart();
		this.changeState(PongGameStates.Playing);
	},
	leftpaddlepushedup: function(data){
		this.model.sendLeftPaddleImpulseUp();
	},
	leftpaddlepusheddown: function(data){
		this.model.sendLeftPaddleImpulseDown();
	},
	rightpaddlepusheddown: function(data){
		this.model.sendRightPaddleImpulseDown();
	},
	rightpaddlepushedup: function(data){
		this.model.sendRightPaddleImpulseUp();
	}
};

PongGameStates.Playing = {
	leftpaddlepushedup: function(data){
		this.model.sendLeftPaddleImpulseUp();
	},
	leftpaddlepusheddown: function(data){
		this.model.sendLeftPaddleImpulseDown();
	},
	rightpaddlepusheddown: function(data){
		this.model.sendRightPaddleImpulseDown();
	},
	rightpaddlepushedup: function(data){
		this.model.sendRightPaddleImpulseUp();
	},
	leftplayerscored: function(data) { 
		this.increaseLeftPlayerScore();
		this.changeState(PongGameStates.PlayerScored);
	},
	rightplayerscored: function(data) {
		this.increaseRightPlayerScore();
		this.changeState(PongGameStates.PlayerScored);
	},
	paddlehitball: function(data){
		var ball = this.model.ball;
		ball.x = data.x;
		ball.y = data.y;
		ball.velocity = data.velocity;
	}
};

PongGameStates.PlayerScored = {
	init: function() {
		if(this.playerLeftScore >= 3) {
			this.changeState(PongGameStates.PlayerLeftWins);
		}
		else if(this.playerRightScore >= 3) {
			this.changeState(PongGameStates.PlayerRightWins);
		}
		else{
			this.changeState(PongGameStates.WaitingForRoundToStart);
		}
	}
};

PongGameStates.PlayerLeftWins = {
	init: function(){
		this.changeState(PongGameStates.GameOver);
	}
};

PongGameStates.PlayerRightWins = {
	init: function(){
		this.changeState(PongGameStates.GameOver);
	}
};

PongGameStates.GameOver = {
	init: function(){
		this.publisher.publish({message: 'finished'});
	}
};

PongGameStates.OtherPlayerDisconnected = {
};

PongGameStates.Fallback = {
	otherdisconnected: function(data){
		this.changeState(PongGameStates.OtherPlayerDisconnected);
	}
};
