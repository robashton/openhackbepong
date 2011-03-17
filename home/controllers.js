var Controllers = Controllers || {};

Controllers.GameController = function(model, publisher) {
	this.model = model;
	this.publisher = publisher;
	this.paddleUpDownState = {};
	this.currentState = null;
	this.player = '';
	this.isGoingFirst = false;
	this.playerLeftScore = 0;
	this.playerRightScore = 0;
	this.onChangeStateCallback = function(){};
	this.changeState(PongGameStates.WaitingForGameToStart);

	// Hackity hack hack I just want it done now.
	this.model.ball.boundsLeftCallback = function() {
		this.publisher.publish({message: 'rightplayerscored'});
	};
		
	this.model.ball.boundsLeftCallback = function() {
		this.publisher.publish({message: 'rightplayerscored'});
	};

};

Controllers.GameController.prototype.increaseLeftPlayerScore = function(){
	this.playerLeftScore++;
};

Controllers.GameController.prototype.increaseRightPlayerScore = function(){
	this.playerRightScore++;
};

Controllers.GameController.prototype.onChangeState = function(callback){
	var original = this.onChangeStateCallback;
	this.onChangeStateCallback = function(){
		original.call(this);
		callback.call(this);	
	};
};

Controllers.GameController.prototype.changeState = function(state) {
	this.currentState = state;
	this.onChangeStateCallback.call(this, this.currentState);

	if(this.currentState.init){
		this.currentState.init.call(this);		
	}

	if(!state){
		console.log('Missing state');	
	}
};

Controllers.GameController.prototype.setPlayerAsLeft = function(){
	this.player = 'left';
};

Controllers.GameController.prototype.setPlayerAsRight = function(){
	this.player = 'right';
};

Controllers.GameController.prototype.setPlayerIsStarting = function(){
	this.isGoingFirst = true;
	this.setupModelForPlayerStarting();
};

Controllers.GameController.prototype.setOtherPlayerIsStarting = function(){
	this.isGoingFirst = false;
	this.setupModelForPlayerStarting();
};

Controllers.GameController.prototype.setupModelForPlayerStarting = function() {
	if(this.isGoingFirst && this.player == 'left') {
		this.model.setBallAtLeftPaddle();
	} else if(!this.isGoingFirst && this.player == 'right') {
		this.model.setBallAtLeftPaddle();
	} else {
		this.model.setBallAtRightPaddle();	
	}
};

Controllers.GameController.prototype.dispatchMessage = function(data) {
	if(!this.currentState) { return; }
	var callback = this.currentState[data.message] || PongGameStates.Fallback[data.message];
	
	if(callback){
		callback.call(this, data);
		if(data.source == undefined){
			this.publisher.publish(data);
		}        
	}else	{
		console.log('Callback not found on ' + this.currentState + ' for ' + data.message);
	}
};

Controllers.GameController.prototype.registerPaddleSpaceState = function(state) {
  this.paddleUpDownState.space = state;
};

Controllers.GameController.prototype.registerPaddleDownState = function(state) {
  this.paddleUpDownState.down = state;
};

Controllers.GameController.prototype.registerPaddleUpState = function(state) {
  this.paddleUpDownState.up = state;
};

Controllers.GameController.prototype.doLogic = function() {
	if(this.player == 'left'){
		if(this.paddleUpDownState.up){
			this.dispatchMessage({message:'leftpaddlepushedup'});
		}
		else if(this.paddleUpDownState.down){
			this.dispatchMessage({message:'leftpaddlepusheddown'});
		}
		
		if(this.paddleUpDownState.space && this.isGoingFirst){
			this.dispatchMessage({message: 'leftpaddlestart'});
		}
	}
	else if(this.player == 'right'){
		if(this.paddleUpDownState.up){
			this.dispatchMessage({message:'rightpaddlepushedup'});
		}
		else if(this.paddleUpDownState.down){
			this.dispatchMessage({message:'rightpaddlepusheddown'});
		}

		if(this.paddleUpDownState.space && this.isGoingFirst){
			this.dispatchMessage({message: 'rightpaddlestart'});
		}
	}

	this.model.doLogic();

};

