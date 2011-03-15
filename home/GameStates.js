var GameStates = GameStates || {};

GameStates.Fallback = 
{
	otherdisconnected: function(data){
		this.changeState(GameStates.AwaitingInstructions);
	},	
};

GameStates.AwaitingInstructions =
{
	start: function(data) {
		this._player = data.position;
		if(data.position == 'left') {
			
			this.changeState(GameStates.StartingGame);		
		}
		else {
			
			this.changeState(GameStates.StartingGame);	
		}
	}
};


GameStates.StartingGame = {
	leftpaddlestart: function() {
		this._model.sendLeftPaddleStart();
		this.changeState(GameStates.Playing);
	},
	rightpaddlestart: function(data) {
		this._model.sendRightPaddleStart();
		this.changeState(GameStates.Playing);
	}			

};

GameStates.Playing = {
	leftpaddlepushedup: function(data){
		this._model.sendLeftPaddleImpulseUp();
	},
	leftpaddlepusheddown: function(data){
		this._model.sendLeftPaddleImpulseDown();
	},
	rightpaddlepusheddown: function(data){
		this._model.sendRightPaddleImpulseDown();
	},
	rightpaddlepushedup: function(data){
		this._model.sendRightPaddleImpulseUp();
	}
};

