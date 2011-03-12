var Renderer = Renderer || {};

Renderer.Engine = function(canvasId, model)
{
	this.canvasId = canvasId;
	this.model = model;
	var engine = this;

	PhiloGL(canvasId, {
		context: {
				debug: true
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

			engine.app = app;

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

			console.log('Ended on load');
		}
	});
}

Renderer.Engine.prototype.renderScene = function(){
	var models = this.model.getModels();

	var gl = this.app.gl,
	canvas = this.app.canvas,
	program = this.app.program,
	camera = this.app.camera;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	program.setUniform('uPMatrix', camera.projection);

	program.setBuffer('aVertexPosition')
			 .setBuffer('aTextureCoord')
			 .setBuffer('indices')
	       .setTexture('trans.png');

   program.setUniform('uSampler', 0);

	for(i in models){
		this.renderQuad(models[i]);
	}			
};

Renderer.Engine.prototype.renderQuad = function(model)
{
	var gl = this.app.gl,
	canvas = this.app.canvas,
	program = this.app.program,
	camera = this.app.camera;

	camera.modelView.id();
	camera.modelView.$translate(model.x, model.y, -1);
	camera.modelView.$scale(model.width, model.height, 1);				

	program.setUniform('uMVMatrix', camera.modelView);
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);	
}


