var Coordination = Coordination || {};

Coordination.Coordinator = function(renderer, controller) {
	this._renderer = renderer;
	this._controller = controller;
	this._timeAtLastFrame = new Date().getTime();
	this._idealTimePerFrame = 1000 / 30;
	this._leftOver = 0.0;
}

Coordination.Coordinator.prototype._idealTimePerFrame = null;
Coordination.Coordinator.prototype._renderer = null;
Coordination.Coordinator.prototype._controller = null;
Coordination.Coordinator.prototype._timeAtLastFrame = null;
Coordination.Coordinator.prototype._leftOver = null;

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