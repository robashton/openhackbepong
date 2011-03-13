var Pong = Pong || {};

Pong.Entity = function(x, y, width, height, texture) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.texture = texture;
	this.velocity = { x: 0, y: 0 }
	this.decay = 0.5;
};

Pong.Entity.prototype.doLogic = function() {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.velocity.x *= this.decay;
	this.velocity.y *= this.decay;
};

Pong.Entity.prototype.notifyBoundsLeft = function(boundary) {
		this.x -= this.x - boundary; 
      this.velocity.x = -this.velocity.x;
};

Pong.Entity.prototype.notifyBoundsRight = function(boundary) {
      this.x -= (this.x + this.width) - boundary;
      this.velocity.x = -this.velocity.x
};

Pong.Entity.prototype.notifyBoundsTop = function(boundary) {
 		this.y -= (this.y + this.height) - boundary;
      this.velocity.y = -this.velocity.y;
};

Pong.Entity.prototype.notifyBoundsBottom = function(boundary) {
		this.y -= this.y- boundary; 
      this.velocity.y = -this.velocity.y;
};

Pong.GameModel = function(left, right, top, bottom) {
	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.paddleSpeed = 10;
	this.playerPaddle = new Pong.Entity(-240, 0, 8, 30, "trans.png");
	this.opponentPaddle = new Pong.Entity(240, 0, 8, 30, "trans.png");
	this.ball = new Pong.Entity(0, 0, 5, 5, "trans.png");
	this.ball.decay = 1.0;
	this.ball.velocity.x = 2.0;
	this.ball.velocity.y = 3.0;
};

Pong.GameModel.prototype.getModels = function() {
	return [
		this.ball,
		this.opponentPaddle,
		this.playerPaddle
	];
};

Pong.GameModel.prototype.doLogic = function() {

	this.playerPaddle.doLogic();
	this.opponentPaddle.doLogic();
	this.ball.doLogic();

	this.doPhysics(); 
};

Pong.GameModel.prototype.doPhysics = function() {
	var models = this.getModels();

	for(var i in models) {
		this.checkModelAgainstBoundary(models[i]);
	}
};

Pong.GameModel.prototype.checkModelAgainstBoundary = function(model) {
   if (model.y < this.bottom) 
   { 
      model.notifyBoundsBottom(this.bottom);
   }
   if ((model.y + model.height) > this.top) 
   { 
     	model.notifyBoundsTop(this.top);
   }
   if (model.x < this.left) 
   { 
      model.notifyBoundsLeft(this.left);
   }
   if ((model.x + model.width) > this.right) 
   { 
		model.notifyBoundsRight(this.right);
   }
};

Pong.GameModel.prototype.sendPlayerImpulseUp = function() {
	this.playerPaddle.velocity.y += this.paddleSpeed;
};

Pong.GameModel.prototype.sendPlayerImpulseDown = function() {
	this.playerPaddle.velocity.y -= this.paddleSpeed;
};

Pong.GameModel.prototype.sendOpponentImpulseUp = function() {
	this.opponentPaddle.velocity.y += this.paddleSpeed;
};

Pong.GameModel.prototype.sendOpponentImpulseDown = function() {
	this.opponentPaddle.velocity.y -= this.paddleSpeed;
};

