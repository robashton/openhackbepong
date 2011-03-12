PadId1 = 1;
PadId2 = 2;
BallId = 3;

function BuildModel(id,x,y,velx,vely)
{
  return new {x:x,y:y,id:id,velx:velx,vely:vely};
}

function BuildGameState()
{
   return {
      Pads: [BuildModel(PadId1,-15,0,0,0), BuildModel(PadId2,15,0,0,0) ],
      Ball: BuildModel(BallId,0,0),
      Bounds: new {x:-250,y:-250,right:250,bottom:250}
   };
}

GameState = BuildGameState();

function Move(m)
{
   var b = GameState.Bounds;
   m.x+=velx;
   m.y+=vely;
   m.velx/=1.1;
   m.vely/=1.1;
   if (m.x<b.x) m.x=b.x-m.x;
   if (m.x>b.right) m.x=b.right-m.x;
   if (m.y<b.y) m.x=b.y-m.x;
   if (m.y<b.bottom) m.y=b.bottom-m.y;

} 

function Push(m,x,y)
{
   m.velx+=x;
   m.vely+=y;     
}

function DoGameLoop()
{
   foreach(var p in GameState.Pads)
     Move(p);
   Move(GameState.Ball);
} 