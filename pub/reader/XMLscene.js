 //axis default Thickness
 var DEFAULT_THICKNESS = 0.05;
 var CAMERA_DEFAULT_POSITION = [21.025890350341797, 30, 26.3, 0]; //[1.0,0.0,0.0,0]; 
 var botPlayers = [];
 var botTypes = ["random", "greedy"];
 var FAILURE_MESSAGE = "FAIL";
 var updateTime = 1;

 var player1Color = "black";
 var player2Color = "white";
 var cameraPositions = ['Pos1', 'Pos2', 'Pos3', 'Pos4'];
 var cameraPositionsCoords = [];
 var topCameraPos = [19.325374603271484, 30, 27.57368278503418, 0];
 //inheritance from CGFScene and definition of a GUI (Graphic User Interface)
 //Movimento Rui
 //Jogadas ->Movimentos -> criar ciclo de jogo em javascript need to test it
 //Replay -> Jogadas  need to teste 
 //Undo -> tabuleiros || Prolog easy way done
 //SkyBox Not Done
 //Animations to Do, create function that creates Templates 1 for placement another to retrieve pieces
 //Camara coordenads esféricas DONE check animação da camara check 
 //Diferença entre posições e depois ter delta Radius/Phi/Theta check camera Quadrantbug, check how to calculate animation with rebelo
 //Array de texturas e materiais em vez de lsx
 function XMLscene() {
     CGFscene.call(this);
     this.Loop = false;
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
     this.replayOfGame = false;
     this.playingAnimation = false;
     this.cameraPhiDelta = 0;
     this.cameraThetaDelta = 0;
     this.cameraRadiusDelta = 0;
     this.cameraSpeed = 1;
     this.cameraToMovePos = new Object();
     this.animationPlaying = false;
     this.answer = false;
     this.valid = false;
     this.changePlayer = false;
     this.moveTime = 0;
     this.startPlay = 0;
     this.rotateCamera = new Object();
     this.piecesInfo = [];
     this.gameStats = [];
     this.initCameraPos();
     this.initHandlers();
 };

 XMLscene.prototype = Object.create(CGFscene.prototype);
 XMLscene.prototype.constructor = XMLscene;

 XMLscene.prototype.parsePlayers = function() {
     if (botTypes.indexOf(this.player1) >= 0)
         botPlayers.push(player1Color);

     if (botTypes.indexOf(this.player2) >= 0)
         botPlayers.push(player2Color);
 };

 XMLscene.prototype.initCameraPos = function() {

     var initialPosTemp = cartesianToSphericCoords(CAMERA_DEFAULT_POSITION);
     var initialPos = new Object();
     initialPos.radius = initialPosTemp[0];
     initialPos.theta = initialPosTemp[1];
     initialPos.phi = initialPosTemp[2];

     for (var i = 0; i < 4; i++) {
         var newPos = new Object();
         newPos.radius = initialPos.radius;
         newPos.theta = initialPos.theta + degToRad(90) * i;
         newPos.phi = initialPos.phi;
         cameraPositionsCoords.push(newPos);
     };

     console.log(cameraPositionsCoords);
 };

 XMLscene.prototype.initHandlers = function() {
     this.startGame = (function() {
         if (!this.gameStarted && !this.replayOfGame) {


             makeRequest("initialize", [this.player1, this.player2], (function(data) {

                 checkError(this, JSON.parse(data.target.response));

             }).bind(this));

             makeRequest("initStats", [], (function(data) {

                 initBoard(this, JSON.parse(data.target.response));

             }).bind(this));
             this.parsePlayers();
             this.changePlayer = true;
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
             this.parsePlayers();
             this.changePlayer = true;
         }
     }).bind(this)

     this.undoMove = (function() {
         if (this.gameStarted && !this.replayOfGame && this.moves.length > 0) {
             this.undoPlacement(this.moves[this.moves.length - 1]);
             this.boards.splice(this.boards.length - 1, 1);
             this.currentBoard = this.boards[this.boards.length - 1];
             var moveToUndo = this.moves[this.moves.length - 1];
             this.moves.splice(this.moves.length - 1, 1);
         }

     }).bind(this);
 };

 XMLscene.prototype.undoPlacement = function(move) {
     var worldCoords = boardCoordsToWolrd(move[0], move[1]);
     var index = getIndex(this.piecesInfo, worldCoords, equalCoords);
     if (index >= 0)
         this.graph.movTrack.undo(this.piecesInfo[index]);
     else {
         console.log("index not found");
     }
 };

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
     makeRequest("getStats", [], (function(data) {
             var response = JSON.parse(data.target.response));
         if (response['message'] === "OK") {
             this.gameStats
         }
     }).bind(this));
 };

 function incStat(scene, player, move) {
     //add player who did the move to each "move";
     makeRequest("incStats", [player, move[2]], (function(data) {

         checkError(this, JSON.parse(data.target.response));

     }).bind(this));
 };

 function play(scene, move) {
     console.log("HERE");
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
         console.log("currentPlayer", scene.currentPlayer);
         makeRequest("play", [JSON.stringify(scene.currentBoard), scene.currentPlayer, JSON.stringify(move)], (function(data) {

             handlePlay(scene, JSON.parse(data.target.response));

         }).bind(scene));
     }
 };

 function handlePlay(scene, data) {
     scene.moveSelected = false;
     if (data['message'].indexOf(FAILURE_MESSAGE) == -1) {
         this.valid = true;


         console.log(data);
         var newBoard = JSON.parse(data['newPlayer']);
         var newMove = JSON.parse(data['message']);
         scene.boards.push(newBoard);
         scene.currentBoard = newBoard;
         scene.moves.push(newMove);
         nextPlayer(scene);
         // console.log(scene.boards, scene.moves);
         scene.play = false;

         /*console.log(scene.graph.movTrack.lastPick.node);
         console.log(scene.graph.movTrack.lastPick);
         console.log(scene.graph.movTrack.newPick);
         */
         //4th position is the placed piece
         var pieceToAnimateId = scene.graph.movTrack.removeTopPiece(newMove[3]);
         scene.graph.movTrack.animate();
         if (data['nextPlayer'] === 0) {
             scene.gameOver = true;

             scene.endStatus = data['message'];
         }
     } else {
         scene.gameError = true;
         this.valid = false;
         console.log("ERROR", data);

     }
     console.log("HAVE ASNWERS");
     this.answer = true;
 };

 function nextPlayer(scene) {
     scene.changePlayer = true;
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

         //   console.log(this.camera.theta, this.camera.thetaZero, this.camera.position);
         this.camera.updatePos();

     } else {
         //  console.log("HERE");
         this.rotateCameraFlag = false;
         this.camera.updateZeros();
         this.camera.updatePos();
         console.log(deltaT, timePassed, this.camera.theta, this.camera.thetaZero, this.camera.position);
     }
 };

 //initialize the scene with default values while the scene has not been loaded
 XMLscene.prototype.init = function(application) {

     CGFscene.prototype.init.call(this, application);
     this.camera = new MyCamera(0.4, 0.1, 500, CAMERA_DEFAULT_POSITION, vec3.fromValues(0, 0, 7));

     this.initLights();
     //    console.log(this.camera);
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
 XMLscene.prototype.teste = function() {

     if (this.graph.loadedOk && !this.rotateCameraFlag) {
         var cameraIndex = getIndex(cameraPositions, this.rotateCamera, equal);
         this.rotateCameraFlag = true;
         this.cameraToMovePos = cameraPositionsCoords[cameraIndex];
         this.startCameraAnimation = true;
     }
 };
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


     this.gui.game.add(this, 'startGame');
     this.gui.game.add(this, 'resetGame');
     this.gui.game.add(this, 'undoMove');
     this.gui.addCameraDropdown(this, cameraPositions);
     // Choose from accepted values
     this.gui.game.add(this, 'player1', ['black', 'random', 'greedy']);
     this.gui.game.add(this, 'player2', ['white', 'random', 'greedy']);
     this.gui.game.add(this, 'maxMoveTime').min(5).step(1); // Mix and match

     this.gui.scene = this;
     this.setUpdatePeriod(updateTime);
     console.log(this.graph.pieces);
 };

 XMLscene.prototype.update = function(currTime) {
     this.currTime = currTime;


     if (this.gameStarted) {
         /* if (this.changePlayer) {
              this.moveTime = 0;
              this.startPlay = currTime;
              this.changePlayer = false;
              console.log("updatePlayTime");
          } else {
              this.moveTime = (this.currTime - this.startPlay) / 1000.0;
              console.log(this.moveTime);
              if (this.moveTime >= this.maxMoveTime) {
                  this.moveTime = 0;
                  console.log("changePlayers");
                  nextPlayer(this);
              }
          }*/
     }
     if (this.graph.loadedOk) {
         this.graph.update(currTime);
     }

     if (this.startCameraAnimation) {

         this.startCameraAnimation = false;
         this.camera.startTime = currTime;
         console.log( /*this.camera.theta, this.camera.thetaZero,*/ this.camera, this.camera.position);
         this.camera.calcRadius();
         this.camera.calcAngles();
         this.camera.updatePos();
         console.log(this.camera, this.camera.position);
         if (typeof this.cameraToMovePos !== 'undefined') {
             // console.log(this.camera.theta, this.camera.thetaZero, this.camera.position);

             //console.log(this.camera.theta, this.cameraToMovePos);
             var distance = distanceBetweenTwoSphericPoint(this.camera, this.cameraToMovePos);
             this.cameraPhiDelta = distance[2];
             this.cameraThetaDelta = distance[1];
             this.cameraRadiusDelta = distance[0];
             console.log(distance);


             var absoluteDistance = absoluteDistanceBetweenTwoSphericPoints([this.camera.radius, this.camera.theta, this.camera.phi], [this.cameraToMovePos.radius, this.cameraToMovePos.theta, this.cameraToMovePos.phi]);

             this.cameraAnimationdeltaT = absoluteDistance / this.cameraSpeed * 100.0;
             if (this.cameraAnimationdeltaT < 1000)
                 this.cameraAnimationdeltaT = 1000
         } else
             this.rotateCameraFlag = false;
     }
     if (this.rotateCameraFlag)
         this.updateCamera(currTime);
 };

 XMLscene.prototype.replayMove = function(move) {
     play(this, move);
 };

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
     this.axis.display();
     if (!this.playingAnimation) {

         if (botPlayers.indexOf(this.currentPlayer) >= 0) {
             play(this, []);
         }
         //add play if bot
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
