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
	height: height
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
/*   m.x+= m.velx;
   m.y+= m.vely;
   m.velx/=1.1;
   m.vely/=1.1;
   if (m.x<b.x) m.x=b.x-m.x;
   if (m.x>b.right) m.x=b.right-m.x;
   if (m.y<b.y) m.x=b.y-m.x;
   if (m.y<b.bottom) m.y=b.bottom-m.y; */
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
