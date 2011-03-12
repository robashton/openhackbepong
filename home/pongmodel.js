var Pong = Pong || {};

Pong.Entity = function(x, y, width, height, texture) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.texture = texture;
	this.velocity = { x: 0, y: 0 }
	this.decay = 0.0;
};

Pong.Entity.prototype.doLogic = function() {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.velocity.x *= decay;
	this.velocity.y *= decay;
}

Pong.GameModel = function(width, height) {
	this.width = width;
	this.height = height;
	this.paddleSpeed = 20;
	this.playerPaddle = new Pong.Entity(-250, 0, 20, 40, "trans.png");
	this.opponentPaddle = new Pong.Paddle(250, 0, 20, 40, "trans.png);
	this.ball = new Pong.Ball(0, 0, 20, 20, "trans.png");
};

Pong.GameModel.prototype.getModels = function() {
	return [
		this.ball,
		this.opponentPaddle,
		this.playerPaddle
	];
};

Pong.GameModel.prototype.doLogic = function() {

	// Tick logic
	this.playerPaddle.doLogic();
	this.opponentPaddle.doLogic();
	this.ball.doLogic();

	// Bound checks
	this.checkModelBounds(this.ball);
	this.checkModelBounds(this.playerPaddle);
	this.checkModelBounds(this.opponentPaddle); 

	// TODO: Check critical collisions (Paddle vs Ball)
	// TODO: Check loss conditions ( Ball hits left or right wall )
};

Pong.GameModel.prototype.checkModelBounds = function(model) {
   if (model.y < 0) 
   { 
      model.y -= model.y; 
      model.velocity.y = -model.velocity.y;
   }
   if (model.y > this.height) 
   { 
      model.y -= (model.y - this.height);
      model.velocity.y = -model.velocity.y;
   }
   if (model.x < 0) 
   { 
      model.x -= model.x; 
      model.velocity.x = -model.velocity.x;
   }
   if (model.x > this.width) 
   { 
      model.x -= (model.x - this.width);
      model.velocity.x = -model.velocity.x;
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

Pong.GameModel.prototype.sendOpponentImpulseUp = function() {
	this.opponentPaddle.velocity.y -= this.paddleSpeed;
};

