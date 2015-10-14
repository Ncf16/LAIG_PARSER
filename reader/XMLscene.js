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
	this.rec = new Rectangle(this, [0, 2], [0.5, 0]);
	this.cube = new MyCube(this);
	this.tri = new Triangle(this, [1, 0, 0], [0, 0, 1], [0, 0, 0]);
	this.t1 = new Triangle(this, [0, 0, 1 / 2], [0, 0, 1], [0, 1, 0]);
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
	var parsedLights = this.graph.lights;
	this.nLights = parsedLights.length;

	for (var i = 0; i < this.nLights; i++) {

		this.lights[i].setPosition(parsedLights[i].pos[0], parsedLights[i].pos[1], parsedLights[i].pos[2], parsedLights[i].pos[3]);
		this.lights[i].setAmbient(parsedLights[i].amb[0], parsedLights[i].amb[1], parsedLights[i].amb[2], parsedLights[i].amb[3]);
		this.lights[i].setDiffuse(parsedLights[i].diff[0], parsedLights[i].diff[1], parsedLights[i].diff[2], parsedLights[i].diff[3]);
		this.lights[i].setSpecular(parsedLights[i].spec[0], parsedLights[i].spec[1], parsedLights[i].spec[2], parsedLights[i].spec[3]);
		this.lights[i].setVisible(true);

		if (parsedLights[i].isEnabled()) {
			this.lightsEnable.push(true);
			this.gui.lights.add(this.lightsEnable, i, this.lightsEnable[i]);
			this.lights[i].enable();
		}

	}
};

XMLscene.prototype.CreateMaterials = function() {

	var parsedMaterials = this.graph.materials;
	var materialDefault = new CGFappearance(this);
	var defaultID = addID(null, this.graph, this.graph.materialsID, "materialDefault");
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
};
// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {
	//Temp parte do rui
	this.gl.clearColor(0, 0, 0, 1);
	this.enableTextures(true);

	this.axis = new CGFaxis(this, this.graph.initials.getAxisLength(), DEFAULT_THICKNESS);

	this.appearance = new CGFappearance(this);
	this.appearance.setAmbient(1, 1, 1, 1);
	this.appearance.setDiffuse(1, 1, 1, 1);
	this.appearance.setEmission(1, 1, 1, 1);
	this.appearance.setSpecular(1, 1, 1, 1);
	this.appearance.loadTexture("textures/wall.jpg");


	this.app = new CGFappearance(this);
	this.app.setAmbient(1, 1, 1, 1);
	this.app.setDiffuse(1, 1, 1, 1);
	this.app.setEmission(1, 1, 1, 1);
	this.app.setSpecular(1, 1, 1, 1);

	this.app.loadTexture("textures/floor.png");
	this.UpdateCamera();
	this.CreateLights();
	console.log("this shouldn't be null " + this.gui);
	this.gui.addLights();
	this.leaves = this.graph.leaves;
	this.wall = new Rectangle(this, [0, 1, 0], [1, 0, 0]);
	this.wall.setAmplif(0.5, 0.5);
	this.cli = new Cylinder(this, 1, 0.5, 1, 20, 20);
	this.cli1 = new Cylinder(this, 1, 1, 1, 20, 20);
	this.esf = new Sphere(this, 20, 20, 0.30);
	this.esf1 = new Sphere(this, 20, 20, 1);
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

		for (var j = 0; j < this.nLights; j++) {
			if (!this.lightsEnable[j])
				this.lights[j].disable();
			else
				this.lights[j].enable();

			this.lights[j].update();
		}

		this.graph.display();
		/*	for (key in this.leaves) {
			if (this.graph.leaves[key].type == "Cylinder") {
				this.pushMatrix();

				this.leaves[key].getElement().display();
				this.popMatrix();
			}
		}*/
	}
	this.shader.unbind();
};
/*


		this.pushMatrix();
		this.translate(0, 2, 0);
		this.rotate(degToRad(90), 1, 0, 0);
		this.pushMatrix();
		this.translate(0, 0, -2.5);
		this.appearance.apply();
		this.esf.display();
		this.popMatrix();

		//alterar raio
		this.pushMatrix();
		this.translate(0, 0, 2);
		this.scale(1, 1, 0.10);
		this.app.apply();
		this.esf1.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(0, 0, -2);
		this.scale(0.15, 0.15, 4);
		this.cli1.display();
		this.popMatrix();

		this.pushMatrix();
		this.translate(0, 0, -3);
		this.cli.display();
		this.popMatrix();
		this.popMatrix();

*/