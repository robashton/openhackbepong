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
      Pads: [BuildModel(PadId1,-240, 0, 5, 50), BuildModel(PadId2, 240, 0, 5, 50) ],
      Ball: BuildModel(BallId, 0, 0, 5, 5),
      Bounds: {x:-250,y:-250,right:250,bottom:250},
      Score: [0,0],
      Waiting: true
   };
}

function Move(m)
{
   m.x+= m.velx;
   m.y+= m.vely;
   m.velx*=(1-m.friction);
   m.vely*=(1-m.friction);
} 

function CheckBoundaries(m)
{
   var b = GameState.Bounds;
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

function BouncePad(nr)
{
   var b = GameState.Ball;
   var m = GameState.Pads[nr];
   var delta = b.y-m.y;  
   var edge = m.height;
   // left & right boundaries
   if (Math.abs(b.x)<Math.abs(m.x))
      return;
   // top & bottom boundaries
   if (Math.abs(delta) < edge)
   {
       b.vely+=delta;
       b.velx=-b.velx;
       b.x+=b.velx;
       b.y+=b.vely;
       
   }
   else
   {
      GameState.Score[nr]++; 
      GameState.Waiting = true;
   }
}



function Push(m,x,y)
{
   if (GameState.Waiting===true)
   {
      GameState.Ball.velx = -2;
      GameState.Ball.vely = 0;      
      GameState.Waiting = false;
   }
   else
   {
      m.velx+=x;
      m.vely+=y;
   }     
}

function DoGameLoop()
{
   Move(GameState.Pads[0]);
   Move(GameState.Pads[1]);
   
   if (GameState.Waiting===true)
   {
      GameState.Ball.x=0;
      GameState.Ball.y=0;
   }
   else
   {
      Move(GameState.Ball);
      BouncePad(0);
      BouncePad(1);
      CheckBoundaries(GameState.Ball);
      CheckBoundaries(GameState.Pads[0]);
      CheckBoundaries(GameState.Pads[1]);
   }
} 

GameState = BuildGameState();

GameState.Ball.friction = 0;
