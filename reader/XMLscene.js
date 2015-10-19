//axis default Thickness
var DEFAULT_THICKNESS = 0.05;

//inheritance from CGFScene and definition of a GUI (Graphic User Interface)
function XMLscene() {
    CGFscene.call(this);
    this.gui = null;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

//initialize the scene with default values while the scene has not been loaded
XMLscene.prototype.init = function(application) {

    CGFscene.prototype.init.call(this, application);
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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


//initialize with scene with a light that will be overwrited after the parsing of the file
//given the is necessary at least one light
XMLscene.prototype.initLights = function() {

    this.shader.bind();
    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].update();
    this.lights[0].enable();
    this.lights[0].setVisible(true);
    this.shader.unbind();
};

//set the default Appearance that from the initial scene
XMLscene.prototype.setDefaultAppearance = function() {
    this.setAmbient(0.5, 0.0, 0.0, 1.0);
    this.setDiffuse(0.5, 0.0, 0.0, 1.0);
    this.setSpecular(0.5, 0.0, 0.0, 1.0);
    this.setShininess(10.0);
};

//after the parsing, the camera will be update given the frustum from INITIALS
XMLscene.prototype.UpdateCamera = function() {

    this.camera.near = this.graph.initials.getNear();
    this.camera.far = this.graph.initials.getFar();
};

//create the lights read from the scene
XMLscene.prototype.CreateLights = function() {

    var parsedLights = this.graph.lights;
    this.nLights = parsedLights.length;

    //iterate the lights
    for (var i = 0; i < this.nLights; i++) {

        this.lights[i].setPosition(parsedLights[i].pos[0], parsedLights[i].pos[1], parsedLights[i].pos[2], parsedLights[i].pos[3]);
        this.lights[i].setAmbient(parsedLights[i].amb[0], parsedLights[i].amb[1], parsedLights[i].amb[2], parsedLights[i].amb[3]);
        this.lights[i].setDiffuse(parsedLights[i].diff[0], parsedLights[i].diff[1], parsedLights[i].diff[2], parsedLights[i].diff[3]);
        this.lights[i].setSpecular(parsedLights[i].spec[0], parsedLights[i].spec[1], parsedLights[i].spec[2], parsedLights[i].spec[3]);
        this.lights[i].setVisible(true);

        //enable the light if flag set to true, false otherwise
        this.lightsEnable.push(parsedLights[i].isEnabled() ? true : false);
        //permission to control the lights from the user interface
        this.gui.lights.add(this.lightsEnable, i, this.lightsEnable[i]);

    }
};

//create the default material
XMLscene.prototype.CreateMaterials = function() {

    var materialDefault = new CGFappearance(this);
    //add new ID to material
    var defaultID = addID(null, this.graph, this.graph.materialsID, "materialDefault");
    //call the object constructor
    var defaultMaterial = new Materials();
    //set the ID into object
    defaultMaterial.setID(defaultID);
    defaultMaterial.setAmbient(materialDefault.ambient);
    defaultMaterial.setDiffuse(materialDefault.diffuse);
    defaultMaterial.setEmission(materialDefault.emission);
    defaultMaterial.setSpecular(materialDefault.specular);
    defaultMaterial.setShininess(materialDefault.shiness);
    defaultMaterial.setAppearence(this);
    //input the created default Material in Materials array
    this.materials[defaultID] = defaultMaterial;
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {

    //set the backgroun and global ambient illumination parsed from the ILLUMINATION
    this.gl.clearColor(this.graph.background['r'], this.graph.background['g'], this.graph.background['b'], this.graph.background['a']);
    this.setGlobalAmbientLight(this.graph.ambient['r'], this.graph.ambient['g'], this.graph.ambient['b'], this.graph.ambient['a']);
    //enable textures
    this.enableTextures(true);

    //create the axis given the INITIAL values
    this.axis = new CGFaxis(this, this.graph.initials.getAxisLength(), DEFAULT_THICKNESS);

    this.UpdateCamera();
    this.CreateLights();
    this.CreateMaterials();
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

        //constant update from this values. Checking for each light is enabled or disable
        for (var j = 0; j < this.nLights; j++) {
            if (!this.lightsEnable[j])
                this.lights[j].disable();
            else
                this.lights[j].enable();

            this.lights[j].update();
        }

        //draw the graphScene
        this.graph.display();

    }
    this.shader.unbind();
};