PadId1 = 1;
PadId2 = 2;
BallId = 3;

function BuildModel(id, x, y, width, height)
{
  return {
	x:x,
	y:y,
	id:id,
	velx:0,
	vely:0,
	width: width,
	height: height,
        friction: 1.01
	};
}

function BuildGameState()
{
   return {
      Pads: [BuildModel(PadId1,-240, 0, 5, 15), BuildModel(PadId2, 240, 0, 5, 15) ],
      Ball: BuildModel(BallId, 0, 0, 50, 50),
      Bounds: {x:-250,y:-250,right:250,bottom:250}
   };
}

GameState = BuildGameState();

function Move(m)
{
   var b = GameState.Bounds;
   m.x+= m.velx;
   m.y+= m.vely;
   m.velx*=(1-m.friction);
   m.vely*=(1-m.friction);
   if (m.x<b.x) 
   { 
      m.x+=b.x-m.x; 
      m.velx=-m.velx; 
   }
   if (m.x>b.right) 
   { 
      m.x-=b.right-m.x; 
      m.velx=-m.velx; 
   }
   if (m.y<b.y) 
   { 
      m.y+=b.y-m.y; 
      m.vely=-m.vely;
   }
   if (m.y>b.bottom) 
   { 
//      m.y-=b.bottom-m.y;
      m.vely=-m.vely;
   }
} 

function Push(m,x,y)
{
   m.velx+=x;
   m.vely+=y;     
}

function DoGameLoop()
{
   for(var i in GameState.Pads){
     Move(GameState.Pads[i]);
   }
   Move(GameState.Ball);
} 

GameState.Ball.friction = 0;
Push(GameState.Ball,12,-5);
