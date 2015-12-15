//axis default Thickness
var DEFAULT_THICKNESS = 0.05;
var CAMARA_DEFAULT_POSITION = [15, 15, 15];
//inheritance from CGFScene and definition of a GUI (Graphic User Interface)
function XMLscene() {
    CGFscene.call(this);
    this.Loop = false;
    this.returnsToStart = false;
    this.gui = null;
    this.player1 = "black";
    this.player2 = "white";
    this.maxMoveTime = 5;
    this.gameStarted = false;
    this.rotateCameraFlag = false;
    this.startCameraAnimation = false;
    this.cameraAnimationdeltaT = 4;
    this.cameraRotationAngle = degToRad(90);
    this.rotateCameraDeltaAngle = this.cameraRotationAngle / this.cameraAnimationdeltaT;
    this.moves = [];
    this.boards = [];
    this.currentBoard = null;
    this.currentPlayer = null;
    this.AnimationLoop = function() {
        this.Loop = true;
    };
    this.rotateCamera = function() {
        if (this.graph.loadedOk) {
            console.log(this.camera);
            this.rotateCameraFlag = true;
            this.startCameraAnimation = true;
        }

    };
    this.startGame = (function() {
        if (!this.gameStarted) {
            this.gameStarted = true;

            makeRequest("initialize", [this.player1, this.player2], (function(data) {

                checkError(this, JSON.parse(data.target.response));

            }).bind(this));

            makeRequest("initStats", [], (function(data) {

                initBoard(this, JSON.parse(data.target.response));

            }).bind(this));

        } else {

            makeRequest("retract", [], handleReply);

            makeRequest("initialize", [this.player1, this.player2], (function(data) {

                checkError(this, JSON.parse(data.target.response));

            }).bind(this));

            makeRequest("initStats", [], (function(data) {

                initBoard(this, JSON.parse(data.target.response));

            }).bind(this));
        }

    }).bind(this);
    this.undoMove = function() {
        //criar Undo Move in PROLOG que é chamado?
        play(this);
    }
};

function initBoard(scene, response) {

    if (response['message'] === "OK") {
        scene.currentPlayer = "black";
        scene.moves.splice(0, scene.moves.length);
        scene.boards.splice(0, scene.boards.length);
        scene.currentBoard = JSON.parse(response['newBoard']);
        console.log(scene.currentBoard);
    }

}

function checkError(scene, response) {
    if (response['message'] !== "OK") {
        scene.gameError = true;
    }

}

function play(scene) {

        console.log(scene.currentBoard[0],JSON.stringify([0,0,1]));
        makeRequest("play", [JSON.stringify(scene.currentBoard), "black", JSON.stringify([0,0,1])], (function(data) {

            print2(scene, JSON.parse(data.target.response));

        }).bind(scene));
};

function print2(scene,data) {
    console.log("PRINTING DATA");
    console.log(data);
}
XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;
XMLscene.prototype.updateCamera = function(currTime) {

    var deltaT = currTime - this.camera.startTime;
    deltaT = deltaT / 1000.0;
    var timePassed = deltaT / this.cameraAnimationdeltaT;
    console.log("DELTA T: " + deltaT)
    var currentAngle = (this.rotateCameraDeltaAngle * deltaT);

    var currentCameraPos = [15, 15, 15];
    if (deltaT <= this.cameraAnimationdeltaT) {
        console.log(currentAngle * 180 / Math.PI);
        this.resetCameraViewMatrix();
        this.camera.orbit([0, 1, 0], currentAngle); // this.camera.translate(currentCameraPos);
    } else {
        console.log("END ANIMATION");
        console.log(this.camera);
        //which one do i need to change viewMatrix ou projectionMatrix?
        //google will answer me since the teachers did not with the classes I think
        this.rotateCameraFlag = false;
        console.log(this.camera.getViewMatrix());
    }


    //console.log(this.camera);

};

XMLscene.prototype.resetCameraViewMatrix = function() {
    this.camera._viewMatrix = this.oldViewMatrix;
};
//initialize the scene with default values while the scene has not been loaded
XMLscene.prototype.init = function(application) {

    CGFscene.prototype.init.call(this, application);
    this.camera = new CGFcamera(0.4, 0.1, 500, CAMARA_DEFAULT_POSITION, vec3.fromValues(0, 0, 0));
    this.initLights();
    this.camera.startTime = 0;
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.materials = [];

    this.startTime = new Date(); //time value that is the number of milliseconds since 1 January, 1970 UTC.
    this.axis = new CGFaxis(this);
    this.lightsEnable = [];

    this.CustomShader = new CGFshader(this.gl, "shaders/proj.vert", "shaders/proj.frag");
    this.CustomShader.setUniformsValues({
        uSampler2: 1
    });
    this.CustomShader.setUniformsValues({
        max: 0.25
    });
};

//initialize with scene with a light that will be overwrited after the parsing of the file
//given the is necessary at least one light
XMLscene.prototype.initLights = function() {

    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].update();
    this.lights[0].enable();
    this.lights[0].setVisible(true);
};

//set the default Appearance that from the initial scene
XMLscene.prototype.setDefaultAppearance = function() {};

//after the parsing, the camera will be update given the frustum fromINITIALS
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
    this.gui.extra.add(this, 'AnimationLoop');
    this.gui.game.add(this, 'rotateCamera');
    this.gui.game.add(this, 'startGame');
    this.gui.game.add(this, 'undoMove');
    // Choose from accepted values
    this.gui.game.add(this, 'player1', ['black', 'random', 'greedy']);
    this.gui.game.add(this, 'player2', ['white', 'random', 'greedy']);
    this.gui.game.add(this, 'maxMoveTime').min(5).step(1); // Mix and match

    this.gui.scene = this;
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

    this.setUpdatePeriod(1);
};

XMLscene.prototype.update = function(currTime) {
    if (this.graph.loadedOk) {
        this.graph.update(currTime);
    }

    if (this.startCameraAnimation) {
        this.startCameraAnimation = false;
        this.camera.startTime = currTime;
        this.oldViewMatrix = this.camera._viewMatrix;
    }
    if (this.rotateCameraFlag)
        this.updateCamera(currTime);

};
XMLscene.prototype.cameraAnimation = function(time) {
    console.log(this.camera);
    this.camera.currTime = 0;
    console.log(this.camera, this.camera.teste);
}
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup

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
};

function postGameRequest(requestString, onSuccess, onError) {
    var request = new XMLHttpRequest();
    request.open('POST', '../../game', true);

    request.onload = onSuccess || function(data) {
        console.log("Request successful. Reply: " + data.target.response);
    };
    request.onerror = onError || function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('requestString=' + encodeURIComponent(requestString));
}

function makeRequest(functionName, arguments, handleReply) {

    // Compose Request String
    var requestString = "[ " + functionName;
    if (typeof arguments !== 'undefined') {
        for (var i = 0; i < arguments.length; i++) {
            requestString += " , " + arguments[i];

            if (i == arguments.length - 1) {
                requestString += " ]";
            }
        }
    }
    if (arguments.length == 0 && functionName != null && (typeof functionName !== 'undefined'))
        requestString += " ]";
    postGameRequest(requestString, handleReply);

}

//Handle the JSON Reply
function handleReply(data) {
    console.log(data.target.response);
    response = JSON.parse(data.target.response);
    console.log(response);
}
