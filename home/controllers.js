var Controllers = Controllers || {};

Controllers.GameController = function(model, publisher) {
	this._model = model;
	this._publisher = publisher;
	this._paddleUpDownState = {};
	this._player = '';
	this.changeState(GameStates.AwaitingInstructions);
};

Controllers.GameController.prototype.changeState = function(state) {
	this._currentState = state;
	if(!state){
		console.log('Missing state');	
	}
};

Controllers.GameController.prototype.dispatchMessage = function(data) {
	if(!this._currentState) { return; }
	var callback = this._currentState[data.message] || GameStates.Fallback[data.message];
	
	if(callback){
		callback.call(this, data);
		if(data.source == undefined){
			this._publisher.publish(data);
		}        
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

Controllers.GameController.prototype.doLogic = function() {
	if(this._player == 'left'){
		if(this._paddleUpDownState.up){
			this.dispatchMessage({message:'leftpaddlepushedup'});
		}
		else if(this._paddleUpDownState.down){
			this.dispatchMessage({message:'leftpaddlepusheddown'});
		}
		
		if(this._paddleUpDownState.space){
			this.dispatchMessage({message: 'leftpaddlestart'});
		}
	}
	else if(this._player == 'right'){
		if(this._paddleUpDownState.up){
			this.dispatchMessage({message:'rightpaddlepushedup'});
		}
		else if(this._paddleUpDownState.down){
			this.dispatchMessage({message:'rightpaddlepusheddown'});
		}

		if(this._paddleUpDownState.space){
			this.dispatchMessage({message: 'rightpaddlestart'});
		}
	}

	this._model.doLogic();

};

