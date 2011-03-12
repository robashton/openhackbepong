var Controllers = Controllers || {};

Controllers.GameController = function(model, publisher) {
	this._model = model;
	this._publisher = publisher;
	this._keyCodeState = [];
}

Controllers.GameController.prototype._model = null;
Controllers.GameController.prototype._keyCodeState = null;
Controllers.GameController.prototype._publisher = null;

Controllers.GameController.prototype.registerPaddleUpState = function(keyCode, state) {
  this._keyCodeState[keyCodes.S] = state;
};

Controllers.GameController.prototype.registerPaddleDownState = function(keyCode, state) {
  this._keyCodeState[keyCodes.X] = state;
};

Controllers.GameController.prototype.doLogic = function(
	if (this._keyCodeState[keyCodes.S] == true) {			 
		this._model.sendPlayerImpulseUp();
		this._publisher.notifyPlayerPaddlePushedUp();
	}
	
	if (this._keyCodeState[keyCodes.X] == true) {
		this._model.sendPlayerImpulseDown();
		this._publisher.notifyPlayerPaddlePushedDown();
	}

	this._model.doLogic();
};