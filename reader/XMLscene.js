var DEFAULT_THICKNESS = 0.05;

function XMLscene() {
	CGFscene.call(this);
	this.gui = null;
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
	this.lightsEnable = [];
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
	this.setAmbient(0.5, 0.0, 0.0, 1.0);
	this.setDiffuse(0.5, 0.0, 0.0, 1.0);
	this.setSpecular(0.5, 0.0, 0.0, 1.0);
	this.setShininess(10.0);
};
XMLscene.prototype.UpdateCamera = function() {
	this.camera.near = this.graph.initials.getNear();
	this.camera.far = this.graph.initials.getFar();
};
XMLscene.prototype.CreateLights = function() {
	var parsedLights = this.graph.lights;
	this.nLights = parsedLights.length;

	for (var i = 0; i < this.nLights; i++) {

		this.lights[i].setPosition(parsedLights[i].pos[0], parsedLights[i].pos[1], parsedLights[i].pos[2], parsedLights[i].pos[3]);
		this.lights[i].setAmbient(parsedLights[i].amb[0], parsedLights[i].amb[1], parsedLights[i].amb[2], parsedLights[i].amb[3]);
		this.lights[i].setDiffuse(parsedLights[i].diff[0], parsedLights[i].diff[1], parsedLights[i].diff[2], parsedLights[i].diff[3]);
		this.lights[i].setSpecular(parsedLights[i].spec[0], parsedLights[i].spec[1], parsedLights[i].spec[2], parsedLights[i].spec[3]);
		this.lights[i].setVisible(true);

		this.lightsEnable.push(parsedLights[i].isEnabled() ? true : false);
		this.gui.lights.add(this.lightsEnable, i, this.lightsEnable[i]);

	}
};

XMLscene.prototype.CreateMaterials = function() {

	var parsedMaterials = this.graph.materials;
	var materialDefault = new CGFappearance(this);
	var defaultID = addID(null, this.graph, this.graph.materialsID, "materialDefault");
	var defaultMaterial = new Materials();
	defaultMaterial.setID(defaultID);
	defaultMaterial.setAmbient(materialDefault.ambient);
	defaultMaterial.setDiffuse(materialDefault.diffuse);
	defaultMaterial.setEmission(materialDefault.emission);
	defaultMaterial.setSpecular(materialDefault.specular);
	defaultMaterial.setShininess(materialDefault.shiness);
	defaultMaterial.setAppearence(this);
	this.materials[defaultID] = defaultMaterial;
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {
	//Temp parte do rui
	//this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	//this.setGlobalAmbientLight(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3]);
	this.enableTextures(true);

	this.axis = new CGFaxis(this, this.graph.initials.getAxisLength(), DEFAULT_THICKNESS);

	this.UpdateCamera();
	this.CreateLights();
	this.CreateMaterials();
	this.gui.addLights();
	this.leaves = this.graph.leaves;
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
		this.setDefaultAppearance();
	this.axis.display();


	// ---- END Background, camera and axis setup
	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it

	if (this.graph.loadedOk) {

		for (var j = 0; j < this.nLights; j++) {
			if (!this.lightsEnable[j])
				this.lights[j].disable();
			else
				this.lights[j].enable();

			this.lights[j].update();
		}

		this.graph.display();
		 
	}
	this.shader.unbind();
};