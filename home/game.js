var idealTimePerFrame = 1000 / 30;
		var leftover = 0.0;
		var timeAtLastFrame = new Date().getTime();	
		var started = false;

		$(document).ready(function()
		{
			document.onkeydown = handleKeyDown;
 				document.onkeyup = handleKeyUp;
		});
		
		currentlyPressedKeys = {};
		keyCodes ={S:83,X:88,H:72,N:78}

		function handleKeyDown(event) {			
         currentlyPressedKeys[event.keyCode] = true
			
		}

		function handleKeyUp(event) {
			currentlyPressedKeys[event.keyCode] = false;
		}

		function webGLStart() {
			if(started) { return; }
			started = true;

		  PhiloGL('game', {
			context: {
			//	debug: true
			},
		    program: {
		      from: 'ids',
		       vs: 'shader-vs',
		       fs: 'shader-fs'
		    },
			 textures: {
				src: [ 'trans.png' ]
			 },
		    onError: function() {
		      alert("You probably don't have WebGL - sorry");
		    },
		    onLoad: function(app) {
			var gl = app.gl,
			canvas = app.canvas,
			program = app.program,
			camera = app.camera;

			gl.viewport(0, 0, canvas.width, canvas.height);
			camera.projection.frustum(-250, 250, -250, 250, -1, 1);
			gl.clearColor(0, 0, 255, 1);
			gl.clearDepth(1);
		   gl.disable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);

			gl.enable(gl.BLEND);

			program.setBuffers({       
				'aVertexPosition': {
					attribute: 'aVertexPosition',
					value: new Float32Array([ -1.0, -1.0, 0, 
														1.0, -1.0, 0, 
														1.0,  1.0, 0, 
														-1.0, 1.0, 0]),
					size: 3
				},
				'aTextureCoord': {
					attribute: 'aTextureCoord',
					value: new Float32Array([
													1.0, 1.0,
													0.0, 1.0,
													0.0, 0.0,
													1.0, 0.0  ]),
					size: 2
				},
			 	'indices': {
					value: new Uint16Array([0, 1, 2, 0, 2, 3]),
					bufferType: gl.ELEMENT_ARRAY_BUFFER,
					size: 1
				}
			});

			setInterval( function() {
				tick(app);
			}, 50);				
		    }
		  });  
		}


		function tick(app){
			
			var timeAtThisFrame = new Date().getTime();
			var diff = (timeAtThisFrame - timeAtLastFrame) + leftover;

			var frames = Math.floor(diff / idealTimePerFrame);
			leftover = diff - (frames * idealTimePerFrame);	
			
			for(i = 0 ; i < frames ; i++){
				doLogic(app);
			}

			renderScene(app);

			timeAtLastFrame = timeAtThisFrame;	
		}

		function doLogic(app){

			var padspeed=20;

			if (currentlyPressedKeys[keyCodes.S]==true){			 
				Push(GameState.Pads[0],0,-padspeed);
				NotifyPaddlePushed(-padspeed);
				
			}
			if (currentlyPressedKeys[keyCodes.X]==true)
			{
			 	Push(GameState.Pads[0],0,padspeed);
				NotifyPaddlePushed(padspeed);
			}

			DoGameLoop();
		}

		function ReceivePaddlePushed(speed)
		{
			Push(GameState.Pads[1],0,speed)
		}

		function NotifyPaddlePushed(speed){
			socket.send({
				message: 'paddlepushed',
				speed: speed				
			});
		}

		function renderScene(app){
			var gl = app.gl,
			canvas = app.canvas,
			program = app.program,
			camera = app.camera;
		
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
			program.setUniform('uPMatrix', camera.projection);

			program.setBuffer('aVertexPosition')
					 .setBuffer('aTextureCoord')
					 .setBuffer('indices')
			       .setTexture('trans.png');

		   program.setUniform('uSampler', 0);

			var g=GameState;
			renderQuad(app, g.Pads[0]);
			renderQuad(app, g.Pads[1]);
			renderQuad(app, g.Ball);
			
		}

		function renderQuad(app, model)
		{
			var gl = app.gl,
			canvas = app.canvas,
			program = app.program,
			camera = app.camera;
		
			camera.modelView.id();
			camera.modelView.$translate(model.x, model.y, -1);
			camera.modelView.$scale(model.width, model.height, 1);				
		
			program.setUniform('uMVMatrix', camera.modelView);		
		
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);	
		}


		function webGlStop() {
			
		}
