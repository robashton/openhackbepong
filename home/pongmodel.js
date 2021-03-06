var Pong = Pong || {};

Pong.Entity = function(x, y, width, height, texture) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.texture = texture;
	this.velocity = { x: 0, y: 0 }
	this.decay = 0.5;
	this.collisionCallback = null;
	this.boundsLeftCallback = null;
	this.boundsRightCallback = null;
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
		if(this.boundsLeftCallback) { this.boundsLeftCallback.call(this); }
};

Pong.Entity.prototype.notifyBoundsRight = function(boundary) {
    this.x -= (this.x + this.width) - boundary;
    this.velocity.x = -this.velocity.x;
	 if(this.boundsRightCallback) { this.boundsRightCallback.call(this); }
};

Pong.Entity.prototype.notifyBoundsTop = function(boundary) {
    this.y -= (this.y + this.height) - boundary;
    this.velocity.y = -this.velocity.y;
};

Pong.Entity.prototype.notifyBoundsBottom = function(boundary) {
		this.y -= this.y- boundary; 
      this.velocity.y = -this.velocity.y;
};

Pong.Entity.prototype.notifyOfCollision = function(otherEntity) {
	if(this.collisionCallback){
		this.collisionCallback(otherEntity);
	}	
};

Pong.Entity.prototype.getVectorToOtherEntity = function(otherEntity){
	var thisCentre = this.calculateCentre();
	var otherCentre = otherEntity.calculateCentre();
	return {
		x: otherCentre.x - thisCentre.x,
		y: otherCentre.y - thisCentre.y
	};
};

Pong.Entity.prototype.calculateCentre = function(){
	return {
		x: this.x + this.width / 2,
		y: this.y + this.height / 2
	};
};

Pong.GameModel = function(left, right, top, bottom) {
	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.paddleSpeed = 10;
	this.leftPaddle= new Pong.Entity(-360, 0, 10, 60, "trans.png");
	this.rightPaddle= new Pong.Entity(355, 0, 10, 60, "trans.png");
	this.ball = new Pong.Entity(0, 0, 5, 5, "trans.png");
	this.ball.x = 0;
	this.ball.y = 0;

	this.ball.bounce = 1.1;
	this.ball.decay = 1.0;
	this.ball.collisionCallback = this.onBallHasCollidedWithPaddle;
};


Pong.GameModel.prototype.onBallHasCollidedWithPaddle = function(paddle)
{
	var vectorToPaddle = this.getVectorToOtherEntity(paddle);
	this.velocity.x = -this.velocity.x;
	
	if(vectorToPaddle.x < 0) {
		this.x -= paddle.x -(this.x + this.width);
	} else {
		this.x += this.x - (paddle.x + paddle.width);
	}
	this.velocity.y += paddle.velocity.y;
	this.velocity.x *= this.bounce; // faster and faster innit
	this.velocity.y *= this.bounce; // faster and faster innit
};

Pong.GameModel.prototype.getModels = function() {
	return [
		this.ball,
		this.rightPaddle,
		this.leftPaddle
	];
};

Pong.GameModel.prototype.doLogic = function() {

	this.leftPaddle.doLogic();
	this.rightPaddle.doLogic();
	this.ball.doLogic();

	this.doPhysics(); 
};

Pong.GameModel.prototype.doPhysics = function() {
	var models = this.getModels();

	for(var i in models) {
		this.checkModelAgainstBoundary(models[i]);
	}

	for(i = 0 ; i < models.length ; i++){
		for(var j = i+1 ; j < models.length ; j++) {
			var modelOne = models[i];
			var modelTwo = models[j];

			this.checkForCollisionBetweenTwoEntities(modelOne, modelTwo);
		}
	}
};

Pong.GameModel.prototype.checkForCollisionBetweenTwoEntities = function(modelOne, modelTwo)
{
	if(modelOne.x + modelOne.width < modelTwo.x) { return; }
	if(modelOne.y + modelOne.height < modelTwo.y) { return; }
	if(modelTwo.x + modelTwo.width < modelOne.x) { return; }
	if(modelTwo.y + modelTwo.height < modelOne.y) { return; }

	// Ladies and Gentlemen We have a collision
	modelOne.notifyOfCollision(modelTwo);
	modelTwo.notifyOfCollision(modelOne);
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

	// Being a crafty fox here and not count it as a left or right until
	// it's gone past a certain threshold - this gives the other player who isn't lagging
	// Chance to bat it back and send a message that that's the case
	// Obviously this is massively prone to cheating, but I'm not worrying about that for this game
   if (model.x < (this.left - 70)) 
   { 
      model.notifyBoundsLeft(this.left);
   }
   if ((model.x + model.width) > (this.right + 70)) 
   { 
		model.notifyBoundsRight(this.right);
   }
};

Pong.GameModel.prototype.setBallAtLeftPaddle = function(){
	this.ball.velocity.x = 0.0;
	this.ball.velocity.y = 0.0;
	this.ball.x = -345;
	this.ball.y = 0;
};

Pong.GameModel.prototype.setBallAtRightPaddle = function() {
	this.ball.velocity.x = 0.0;
	this.ball.velocity.y = 0.0;
	this.ball.x = 340;
	this.ball.y = 0;
};

Pong.GameModel.prototype.sendLeftPaddleStart = function() {
	
	if(this.ball.y - this.leftPaddle.y < 0){
		this.ball.velocity.y = -3.0;	
	} else {
		this.ball.velocity.y = 3.0;	
	}
		
	this.ball.velocity.x = 3.5;
};

Pong.GameModel.prototype.sendRightPaddleStart = function() {
	this.ball.velocity.x = -3.5;
	if(this.ball.y - this.rightPaddle.y < 0){
		this.ball.velocity.y = -3.0;	
	} else {
		this.ball.velocity.y = 3.0;	
	}
};

Pong.GameModel.prototype.sendLeftPaddleImpulseUp = function() {
	this.leftPaddle.velocity.y += this.paddleSpeed;
};

Pong.GameModel.prototype.sendLeftPaddleImpulseDown = function() {
	this.leftPaddle.velocity.y -= this.paddleSpeed;
};

Pong.GameModel.prototype.sendRightPaddleImpulseUp = function() {
	this.rightPaddle.velocity.y += this.paddleSpeed;
};

Pong.GameModel.prototype.sendRightPaddleImpulseDown = function() {
	this.rightPaddle.velocity.y -= this.paddleSpeed;
};
