//axis default Thickness
var DEFAULT_THICKNESS = 0.05;
var CAMERA_DEFAULT_POSITION = [21.025890350341797, 30, 26.3, 0]; //[1.0,0.0,0.0,0]; 
var CAMERA_DEFAULT_POSITION = [-2, 30, 7];
var botPlayers = [];
var botTypes = ["random", "greedy"];
var FAILURE_MESSAGE = "FAIL";
var updateTime = 1;
var whiteDiskPos = [0, 0, 0];
var whiteRingPos = [0, 0, 0];

var blackDiskPos = [0, 0, 0];
var blackRingPos = [0, 0, 0];

var player1Color = "black";
var player2Color = "white";
//inheritance from CGFScene and definition of a GUI (Graphic User Interface)
//Movimento Rui
//Jogadas ->Movimentos -> criar ciclo de jogo em javascript need to test it
//Replay -> Jogadas  need to teste 
//Undo -> tabuleiros || Prolog easy way done
//SkyBox Not Done
//Animations to Do, create function that creates Templates 1 for placement another to retrieve pieces
//Camara coordenads esféricas DONE check animação da camara check 
//Diferença entre posições e depois ter delta Radius/Phi/Theta check
//Array de texturas e materiais em vez de lsx
function XMLscene() {
    CGFscene.call(this);
    this.Loop = false;
    this.nTurns = 0;
    this.returnsToStart = false;
    this.gui = null;
    this.player1 = player1Color;
    this.player2 = player2Color;
    this.maxMoveTime = 5;
    this.gameStarted = false;
    this.rotateCameraFlag = false;
    this.startCameraAnimation = false;
    this.cameraAnimationdeltaT = 0;
    // this.cameraRotationAngle = degToRad(90);
    this.play = false;
    this.moves = [];
    this.boards = [];
    this.currentBoard = null;
    this.currentPlayer = null;
    this.gameOver = false;
    this.gameError = false;
    this.currTime = 0;
    this.playCountDown = this.maxMoveTime; //so we can limit the time
    this.replayOfGame = false;
    this.playingAnimation = false;
    this.cameraPhiDelta = 0;
    this.cameraThetaDelta = 0;
    this.cameraRadiusDelta = 0;
    this.cameraSpeed = 1;
    this.cameraToMovePos = new Object();
    this.cameraToMovePos.radius = 30.444578733791;
    this.cameraToMovePos.phi = 2.2428771187404;
    this.cameraToMovePos.theta = 0.6280374899026;
    this.animationPlaying = false;
    this.moveSelected = false;
    /*
    var point1 = new Object();
    point1.radius = 1.7320508075689;
    point1.theta = 0.78539816339745;
    point1.phi = 0.95531661812451;
    var point2 = new Object();
    point2.radius = 2;
    point2.theta = 0;
    point2.phi = 1.5707963267949;
    //change distance to difference
    console.log(distanceBetweenTwoSphericPoint(point1, point2));
    console.log(absoluteDistanceBetweenTwoSphericPoints([1.7320508075689, 0.78539816339745, 0.95531661812451], [2.2360679774998, 0, 1.1071487177941]));*/
    this.rotateCamera = [];
    /* = function() {
            //change this to a dropdown e quando houver mudanças rodar
            // console.log(this.camera);

            if (this.graph.loadedOk) {
                this.rotateCameraFlag = true;
                this.startCameraAnimation = true;
            }

        };*/
    this.startGame = (function() {
        if (!this.gameStarted && !this.replayOfGame) {


            makeRequest("initialize", [this.player1, this.player2], (function(data) {

                checkError(this, JSON.parse(data.target.response));

            }).bind(this));

            makeRequest("initStats", [], (function(data) {

                initBoard(this, JSON.parse(data.target.response));

            }).bind(this));
            this.parsePlayers();
        }

    }).bind(this);

    this.resetGame = (function() {

        if (this.gameStarted && !this.replayOfGame) {
            makeRequest("retract", [], handleReply);

            makeRequest("initialize", [this.player1, this.player2], (function(data) {

                checkError(this, JSON.parse(data.target.response));

            }).bind(this));

            makeRequest("initStats", [], (function(data) {

                initBoard(this, JSON.parse(data.target.response));

            }).bind(this));
        }
    }).bind(this)

    this.undoMove = (function() {

        //criar Undo Move in PROLOG que é chamado?
        //criar um para stats
        // play(this);

        //versão + simples
        /* this.undoPlacement(this.moves[this.moves.length - 1]);
         this.boards.splice(this.boards.length - 1, 1);
         this.currentBoard = this.boards[this.boards.length - 1];
         this.moves.splice(this.moves.length - 1, 1);*/

    }).bind(this);
};
XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.parsePlayers = function() {
    if (botTypes.indexOf(this.player1))
        botPlayers.push(player1Color);

    if (botTypes.indexOf(this.player2))
        botPlayers.push(player2Color);

}

function initBoard(scene, response) {


    if (response['message'] === "OK") {

        scene.moves.splice(0, scene.moves.length);
        scene.boards.splice(0, scene.boards.length);
        scene.currentBoard = JSON.parse(response['newBoard']);
        scene.boards.push(scene.currentBoard);
        scene.gameStarted = true;
        scene.currentPlayer = player1Color;
    }
};

function checkError(scene, response) {
    if (response['message'] !== "OK") {
        scene.gameError = true;
    }
};

function getStats(scene, data) {
    console.log(data);
};

function incStat(scene, player, move) {
    //add player who did the move to each "move";
    makeRequest("incStats", [player, move[2]], (function(data) {

        checkError(this, JSON.parse(data.target.response));

    }).bind(this));
};

function play(scene, move) {
    if (!scene.animationPlaying && scene.gameStarted && !scene.play && ((botPlayers.indexOf(scene.currentPlayer) >= 0) || scene.moveSelected)) { //    console.log(scene.currentBoard[0], JSON.stringify([0, 0, 3]));
        /*  scene.currentBoard=[
                             [3,0,0,0,0,0],
                               [3,3,3,3,3,3],
                                [3,3,3,3,3,3],
                                  [3,3,3,3,3,3],
                                    [3,3,3,3,3,3],
                                      [3,3,3,3,3,3],
                                        [3,3,3,3,3,3]]*/
        scene.play = true;
        scene.nTurns++;
        console.log("currentPlayer", scene.currentPlayer);
        makeRequest("play", [JSON.stringify(scene.currentBoard), scene.currentPlayer, JSON.stringify(move)], (function(data) {

            handlePlay(scene, JSON.parse(data.target.response));

        }).bind(scene));
    }


};

function handlePlay(scene, data) {
    if (data['message'].indexOf(FAILURE_MESSAGE) == -1) {
        if (data['nextPlayer'] !== 0) { //DIST != 0

            console.log(data);
            var newBoard = JSON.parse(data['newPlayer']);
            var newMove = JSON.parse(data['message']);
            scene.boards.push(newBoard);
            scene.currentBoard = newBoard;
            scene.moves.push(newMove);
            nextPlayer(scene);
            console.log(scene.boards, scene.moves);
            scene.play = false;
            //scene.updateBoard(newMove);
            //  scene.placePieceInBoard(newMove);
        } else {
            scene.gameOver = true;

            scene.endStatus = data['message'];
        }
    } else
        scene.gameError = true;

};

function nextPlayer(scene) {

    switch (scene.currentPlayer) {
        case player1Color:
            scene.currentPlayer = player2Color;
            break;
        case player2Color:
            scene.currentPlayer = player1Color;
            break;
    }
};

XMLscene.prototype.updateCamera = function(currTime) {
    var deltaT = (currTime - this.camera.startTime); // / 1000.0

    var timePassed = deltaT / this.cameraAnimationdeltaT;
    // var currentAngle = (this.camera.thetaZero + this.cameraRotationAngle * timePassed);
    var currentPhi = (this.camera.phiZero + this.cameraPhiDelta * timePassed);
    var currentTheta = (this.camera.thetaZero + this.cameraThetaDelta * timePassed);
    var currentRadius = (this.camera.radiusZero + this.cameraRadiusDelta * timePassed);

    if (deltaT < this.cameraAnimationdeltaT) {
        this.camera.setTheta(currentTheta);
        this.camera.setPhi(currentPhi);
        this.camera.setRadius(currentRadius);

        //console.log(this.camera.position);
        this.camera.updatePos();

    } else {
        this.rotateCameraFlag = false;
        this.camera.updateZeros();
        this.camera.updatePos();
        console.log(deltaT, timePassed);
        console.log(this.camera);
    }


    //  console.log(this.camera);
};

//initialize the scene with default values while the scene has not been loaded
XMLscene.prototype.init = function(application) {

    CGFscene.prototype.init.call(this, application);
    this.camera = new MyCamera(0.4, 0.1, 500, CAMERA_DEFAULT_POSITION, vec3.fromValues(0, 0, 7));

    this.initLights();
    this.camera.updatePos();
    console.log(this.camera);
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

    //  this.gui.game.add(this, 'rotateCamera');
    this.gui.game.add(this, 'startGame');
    this.gui.game.add(this, 'resetGame');
    this.gui.game.add(this, 'undoMove');
    // Choose from accepted values
    this.gui.game.add(this, 'player1', ['black', 'random', 'greedy']);
    this.gui.game.add(this, 'player2', ['white', 'random', 'greedy']);
    this.gui.game.add(this, 'maxMoveTime').min(5).step(1); // Mix and match

    this.gui.scene = this;
    this.setUpdatePeriod(updateTime);
};

XMLscene.prototype.update = function(currTime) {
    this.currTime = currTime;
    if (this.graph.loadedOk) {
        this.graph.update(currTime);
    }

    if (this.startCameraAnimation) {
        this.startCameraAnimation = false;
        this.camera.startTime = currTime;
        this.camera.calcRadius();
        this.camera.calcAngles();
        var distance = distanceBetweenTwoSphericPoint(this.camera, this.cameraToMovePos);
        /*console.log(this.camera, this.cameraToMovePos);
        console.log(distance);*/
        this.cameraPhiDelta = 0;
        this.cameraThetaDelta = 0 * degToRad(270);
        this.cameraRadiusDelta = 0;
        var absoluteDistance = absoluteDistanceBetweenTwoSphericPoints([this.camera.radius, this.camera.theta, this.camera.phi], [this.cameraToMovePos.radius, this.cameraToMovePos.theta, this.cameraToMovePos.phi]);

        this.cameraAnimationdeltaT = absoluteDistance / this.cameraSpeed * 100.0;
        if (this.cameraAnimationdeltaT < 1000)
            this.cameraAnimationdeltaT = 1000
    }
    if (this.rotateCameraFlag)
        this.updateCamera(currTime);
};

XMLscene.prototype.cameraAnimation = function(time) {
    console.log(this.camera.position);
    this.camera.currTime = 0;
    console.log(this.camera.position, this.camera.teste);
};

XMLscene.prototype.stackDisplay = function(toStack, elementHeight, stackSize, elementPos) {

    for (var i = 0; i < stackSize; i++) {
        this.pushMatrix();
        this.translate(elementPos[0], elementPos[1] + elementHeight * i, elementPos[2]);
        toStack.display();
        this.popMatrix();
    }

};
XMLscene.prototype.loadGame = function() {

};
XMLscene.prototype.replayMove = function(move) {
    play(this, move);
}

<<<<<<< HEAD
=======
XMLscene.prototype.logPicking = function() {

    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i = 0; i < this.pickResults.length; i++) {
                var obj = this.pickResults[i][0];
                if (obj) {
                    var customId = this.pickResults[i][1];
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                }
            }
            this.pickResults.splice(0, this.pickResults.length);
        }
    }
}

>>>>>>> fa0fbea2fda419827658e1fe2b17dc1093a5ce90
XMLscene.prototype.display = function() {

    this.graph.movTrack.listen();
    this.clearPickRegistration();

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
    if (!this.playingAnimation) {
        /*if (this.nTurns < 2) {
            play(this, []);
        }*/
        if (this.replayOfGame) {
            var moveToReplay = this.moves[this.moves.length - 1];
            this.moves.splice(this.moves.length - 1, 1);
            replayMove(moveToReplay);
        }

    }

    // ---- END Background, camera and axis setup
    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    // use a prolog request to get the stats and decide the number to stack by having a look at said stats
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
    request.open('POST', 'http://localhost:8081/game', true);

    request.onload = onSuccess || function(data) {
        console.log("Request successful. Reply: " + data.target.response);
    };
    request.onerror = onError || function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('requestString=' + encodeURIComponent(requestString));
};

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
};

//Handle the JSON Reply
function handleReply(data) {
    console.log(data.target.response);
    response = JSON.parse(data.target.response);
    console.log(response);
};
