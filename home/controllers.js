var Controllers = Controllers || {};

Controllers.GameController = function(model, publisher) {
	this._model = model;
	this._publisher = publisher;
	this._paddleUpDownState = {};
	this.changeState('awaitinginstructions');
};

Controllers.GameController.States = {};

Controllers.GameController.States.awaitinginstructions =
	{
		init: function() {},
		start: function(data) {
			
			if(data.position == 'left') {
				this._model.setPlayerAsLeft();
				this.changeState('goingfirst');		
			}
			else {
				this._model.setPlayerAsRight();
				this.changeState('awaitingotherplayer');	
			}			

		},
		doLogic: function() {}
	};


Controllers.GameController.States.goingfirst = {
		init: function(controller) {},
		doLogic: function() {				
			if (this._paddleUpDownState.space) 
			{			 
				this._model.sendPlayerStart();
				this._publisher.notifyPlayerStarted();
				this.changeState('playing');
			}
		}
	};


Controllers.GameController.States.awaitingotherplayer = {
		init: function(controller) {},
		opponentstarted: function(data) {
			this._model.sendOpponentStart();
			this.changeState('playing');
		},
		doLogic: function() {}
	};


Controllers.GameController.States.playing = {
		init: function(controller) {},
		paddlepushedup: function(data){
			this._model.sendOpponentImpulseUp();
		},
		paddlepusheddown: function(data){
			this._model.sendOpponentImpulseDown();
		},
		doLogic: function() {

			if (this._paddleUpDownState.up) {			 
				this._model.sendPlayerImpulseUp();
				this._publisher.notifyPlayerPaddlePushedUp();
			}
	
			if (this._paddleUpDownState.down) {
				this._model.sendPlayerImpulseDown();
				this._publisher.notifyPlayerPaddlePushedDown();
			}

			this._model.doLogic();
		}
	};


Controllers.GameController.prototype.changeState = function(state) {
	this._currentState = state;

	var callback = Controllers.GameController.States[this._currentState].init;
	callback.call(this);
};

Controllers.GameController.prototype.translateMessageToModel = function(data) {
	if(!this._currentState) { return; }
	var callback = Controllers.GameController.States[this._currentState][data.message];
	
	if(callback){
		callback.call(this, data);
	}else	{
		console.log('Callback not found on ' + this._currentState + ' for ' + data.message);
	}
};

Controllers.GameController.prototype.registerPaddleSpaceState = function(state) {
  this._paddleUpDownState.space = state;
};

Controllers.GameController.prototype.registerPaddleDownState = function(state) {
  this._paddleUpDownState.down = state;
};

Controllers.GameController.prototype.registerPaddleUpState = function(state) {
  this._paddleUpDownState.up = state;
};

Controllers.GameController.prototype.registerPaddleDownState = function(state) {
  this._paddleUpDownState.down = state;
};

Controllers.GameController.prototype.doLogic = function() {
	if(!this._currentState) { return; }

	var callback = Controllers.GameController.States[this._currentState].doLogic;	
	if(callback){
		callback.call(this);
	}	else	{
		console.log('Callback not found on ' + this._currentState + ' for DoLogic');
	}

};
