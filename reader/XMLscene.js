var DEFAULT_THICKNESS = 0.05;

function XMLscene() {
	CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);
	this.teste = false;
	this.initCameras();

	this.initLights();

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.materials = [];
	this.axis = new CGFaxis(this);
};

XMLscene.prototype.initLights = function() {

	this.shader.bind();

	this.lights[0].setPosition(2, 3, 3, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].update();
	this.lights[0].enable();
	this.lights[0].setVisible(true);
	this.shader.unbind();
};

XMLscene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function() {
	this.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
	this.setSpecular(0.2, 0.4, 0.8, 1.0);
	this.setShininess(10.0);
};
XMLscene.prototype.UpdateCamera = function() {
	this.camera.near = this.graph.initials.getNear();
	this.camera.far = this.graph.initials.getFar();
};
XMLscene.prototype.CreateLights = function() {
	var parsedLights = this.graph.initials.getLights();


	for (var i = 0; i < parsedLights.length; i++) {

		this.lights[i].setPosition(parsedLights[i].pos[0], parsedLights[i].pos[1], parsedLights[i].pos[2], parsedLights[i].pos[3]);
		this.lights[i].setAmbient(parsedLights[i].amb[0], parsedLights[i].amb[1], parsedLights[i].amb[2], parsedLights[i].amb[3]);
		this.lights[i].setDiffuse(parsedLights[i].diff[0], parsedLights[i].diff[1], parsedLights[i].diff[2], parsedLights[i].diff[3]);
		this.lights[i].setSpecular(parsedLights[i].spec[0], parsedLights[i].spec[1], parsedLights[i].spec[2], parsedLights[i].spec[3]);
		this.lights[i].setVisible(true);
		if (parsedLights[i].isEnabled()) {
			this.lights[i].enable();
		}
	}
};

XMLscene.prototype.CreateMaterials = function() {

	var parsedMaterials = this.graph.initials.getMaterials();

	var materialDefault = new CGFappearance(this);
	var defaultID = addID(null, this.graph, this.graph.initials.materialsID, "materialDefault");
	this.materials[defaultID] = materialDefault;

	for (var i = 0; i < parsedMaterials.length; i++) {
		var tempMaterial = new CGFappearance(this);

		tempMaterial.setAmbient(parsedMaterials[i].amb[0], parsedMaterials[i].amb[1], parsedMaterials[i].amb[2], parsedMaterials[i].amb[3]);
		tempMaterial.setDiffuse(parsedMaterials[i].diff[0], parsedMaterials[i].diff[1], parsedMaterials[i].diff[2], parsedMaterials[i].diff[3]);
		tempMaterial.setSpecular(parsedMaterials[i].spec[0], parsedMaterials[i].spec[1], parsedMaterials[i].spec[2], parsedMaterials[i].spec[3]);
		tempMaterial.setEmission(parsedMaterials[i].emission[0], parsedMaterials[i].emission[1], parsedMaterials[i].emission[2], parsedMaterials[i].emission[3]);
		tempMaterial.setShininess(parsedMaterials[i].getShininess());

		this.materials[parsedMaterials[i].getID()] = tempMaterial;

	}
	/*for (e in this.materials) {
			console.log(this.materials[e]);
		}*/

};
// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {
	//Temp parte do rui
	this.gl.clearColor(0, 0, 0, 1);


	this.axis = new CGFaxis(this, this.graph.initials.getAxisLength(), DEFAULT_THICKNESS);


	this.UpdateCamera();
	this.CreateLights();
	this.leaves = this.graph.initials.leaves;
	/**this.rec = new Rectangle(this, [0, 1, 0], [1, 0, 0]);*/
	this.tri = new Triangle(this, [1, 0, 0], [0, 0, 1], [0, 0, 0]);
	this.CreateMaterials();
};


XMLscene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup
	this.shader.bind();

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();

	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis

	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {
		this.graph.transformation.addMatrix();
		this.pushMatrix();
		this.tri.display();
		this.popMatrix();

		for (key in this.leaves) {
			if (this.graph.initials.leaves[key].type != "Cylinder" && this.leaves[key].type != "Sphere") {
				this.leaves[key].getElement().display();

			}
		}
		for (var j = 0; j < this.lights.length; j++)
			this.lights[j].update();
	}
	this.shader.unbind();
};