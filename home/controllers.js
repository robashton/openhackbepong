var Controllers = Controllers || {};

Controllers.GameController = function(model, publisher) {
	this._model = model;
	this._publisher = publisher;
	this._paddleUpDownState = {};
}

Controllers.GameController.prototype._model = null;
Controllers.GameController.prototype._paddleUpDownState = null;
Controllers.GameController.prototype._publisher = null;

Controllers.GameController.prototype.registerPaddleUpState = function(state) {
  this._paddleUpDownState.up = state;
};

Controllers.GameController.prototype.registerPaddleDownState = function(state) {
  this._paddleUpDownState.down = state;
};

Controllers.GameController.prototype.doLogic = function(
	if (this._paddleUpDownState.up) {			 
		this._model.sendPlayerImpulseUp();
		this._publisher.notifyPlayerPaddlePushedUp();
	}
	
	if (this._paddleUpDownState.down) {
		this._model.sendPlayerImpulseDown();
		this._publisher.notifyPlayerPaddlePushedDown();
	}

	this._model.doLogic();
};