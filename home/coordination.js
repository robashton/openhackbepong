var Coordination = Coordination || {};

Coordination.Coordinator = function(renderer, controller) {x
	this._renderer = renderer;
	this._controller = controller;
	this._timeAtLastFrame = new Date().getTime();
	this._idealTimePerFrame = 1000 / 30;
	this._leftover = 0.0;
	this._playerLeftScore = 0;
	this._playerRightScore = 0;
}

Coordination.Coordinator.prototype.processReceivedMessage = function(data) {

	this._controller.dispatchMessage(data);
}

Coordination.Coordinator.prototype.onTick = function() {
	var timeAtThisFrame = new Date().getTime();
	var timeSinceLastDoLogic = (timeAtThisFrame - this._timeAtLastFrame) + this._leftover;
	var catchUpFrameCount = Math.floor(timeSinceLastDoLogic / this._idealTimePerFrame);
	
	for(i = 0 ; i < catchUpFrameCount; i++){
		this._controller.doLogic();
	}
	
	this._renderer.renderScene();
	
	this._leftover = timeSinceLastDoLogic - (catchUpFrameCount * this._idealTimePerFrame);
	this._timeAtLastFrame = timeAtThisFrame;	
};
