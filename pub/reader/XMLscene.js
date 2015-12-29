 //axis default Thickness
 var DEFAULT_THICKNESS = 0.05;
 var CAMERA_DEFAULT_POSITION = [21.025890350341797, 30, 26.3, 0]; //[1.0,0.0,0.0,0]; 
 var botPlayers = [];
 var botTypes = ["random", "greedy"];
 var FAILURE_MESSAGE = "FAIL";
 var VICTORY_MESSAGE = "WON";
 var DRAW_MESSAGE = "DRAW";
 var updateTime = 1;
 var endTimeMax = 200;
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
     this.changePlayer = false;
     this.replayingMove = false;
     this.moveTime = 0;
     this.startPlay = 0;
     this.ambientID = "";
     this.rotateCamera = new Object();
     this.piecesInfo = [];
     this.gameStats = [24, 24, 24, 24];
     this.endMoveTime = 0;
     this.updateEndTime = false;
     this.initCameraPos();
     this.initHandlers();
 };

 XMLscene.prototype = Object.create(CGFscene.prototype);
 XMLscene.prototype.constructor = XMLscene;

 XMLscene.prototype.parsePlayers = function() {
     botPlayers = [];
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
     console.log(initialPos);

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


             this.moves.splice(0, this.moves.length);
             this.boards.splice(0, this.boards.length);
             this.gameStarted = true;
             this.gameOver = false;
             this.reset(false);
             this.endMoveTime = 1001;
         }

     }).bind(this);

     this.resetGame = (function() {
         if (this.gameStarted && !this.animationPlaying) {
             this.replayingMove = false;

             this.moves.splice(0, this.moves.length);
             this.boards.splice(0, this.boards.length);
             this.reset(false);
             console.log(this.graph.movTrack.board);
             this.gamestatS = [24, 24, 24, 24];
             console.log("End Reset");

             this.endMoveTime = 1001;
         }
     }).bind(this)

     this.undoMove = (function() {
         if (this.gameStarted && this.moves.length > 0 && !this.animationPlaying) {
             var moveToUndo = this.moves[this.moves.length - 1];
             this.undoPlacement(moveToUndo);
             this.boards.splice(this.boards.length - 1, 1);
             this.currentBoard = this.boards[this.boards.length - 1];
             var newPlayer = getPlayer(moveToUndo);
             console.log("newPlayer", newPlayer);
             incStat(this, newPlayer, moveToUndo);
             this.moves.splice(this.moves.length - 1, 1);
         }

     }).bind(this);
     this.replayGame = (function() {
         if (this.gameOver) {
             this.replayingMove = false;
             this.boards.splice(0, this.boards.length);
             this.reset(true);
             console.log(this.moves);
             /* var date = new Date();
              console.log(date.yyyymmdd());
              window.webkitRequestFileSystem(window.TEMPORARY, 5 * 1024 * 1024 /*5MB* , onInitFs, errorHandler);*/
         } else {
             console.log("No reset", this.gameStarted, this.gameOver);
         }
     }).bind(this);
 };

 function getPlayer(move) {
     if (move[3] <= 2)
         return player2Color;
     else
         return player1Color;

 };
 XMLscene.prototype.handleReset = function(scene, flag) {
     var player1;
     var player2;
     if (flag) {
         player1 = player1Color;
         player2 = player2Color;
     } else {
         player1 = this.player1;
         player2 = this.player2;
     }

     makeRequest("initialize", [player1, player2], (function(data) {

         checkError(scene, JSON.parse(data.target.response));

     }).bind(scene));
     makeRequest("initStats", [], (function(data) {

         initBoard(scene, JSON.parse(data.target.response), flag);

     }).bind(scene));


 };
 XMLscene.prototype.reset = function(flag) {
     if (this.gameStarted) {
         this.graph.movTrack.resetBoard();
         this.graph.movTrack.board.createStacks();
         this.gameStats = [24, 24, 24, 24];

         makeRequest("retract", [], (function(data) {
             this.handleReset(this, flag);
         }).bind(this));
     }
 };

 XMLscene.prototype.undoPlacement = function(move) {

     this.graph.movTrack.undo(boardCoordsToWorld(move[0], move[1]));
 };

 function initBoard(scene, response, flag) {

     console.log(response);
     if (response['message'] === "OK") {

         scene.currentBoard = JSON.parse(response['newBoard']);
         scene.boards.push(scene.currentBoard);
         scene.gameStarted = true;
         scene.currentPlayer = player1Color;
         if (flag) {
             scene.replayOfGame = true;
         } else {
             console.log("Flag False");
             scene.replayOfGame = false;
             scene.gameOver = false;
             scene.replayingMove = false;
             scene.playingAnimation = false;
             scene.parsePlayers();
         }

     }
 };

 function checkError(scene, response) {
     console.log(response);
     if (response['message'] !== "OK") {
         scene.gameError = true;
     }
 };

 function statsCheck(scene, response, player) {
     console.log(response);
     if (response['message'] === "OK") {
         //moveToUndo
         //THIS IS CALLED WHEN STATS CHECK IS DONE
         //SO THIS SHOULD BE ENOUGH
         getStats(scene);
         scene.currentPlayer = player;
         scene.changePlayer = true;
         console.log(scene.currentPlayer);
     }
 };

 function getStats(scene) {
     makeRequest("getStats", [], (function(data) {
         var response = JSON.parse(data.target.response);
         if (response['message'] === "OK") {
             scene.gameStats = JSON.parse(response['newPlayer']);
             console.log(response);
         }
     }).bind(scene));
 };

 function incStat(scene, player, move) {
     //add player who did the move to each "move"; the placed piece occupies the 4th position on the array of moves
     console.log(player);
     makeRequest("incStats", [player, move[3]], (function(data) {

         statsCheck(scene, JSON.parse(data.target.response), player);

     }).bind(scene));
 };

 function play(scene, move) {
     if (!scene.animationPlaying && scene.gameStarted && !scene.play && !this.gameOver && ((botPlayers.indexOf(scene.currentPlayer) >= 0) || scene.moveSelected || (scene.replayOfGame && move.length > 0))) {
         scene.play = true;
         console.log("currentPlayer", scene.currentPlayer, scene.currentBoard, move);
         makeRequest("play", [JSON.stringify(scene.currentBoard), scene.currentPlayer, JSON.stringify(move)], (function(data) {

             handlePlay(scene, JSON.parse(data.target.response));

         }).bind(scene));
     } else {
         //   console.log(!scene.animationPlaying, scene.gameStarted, !scene.play, !this.gameOver, (botPlayers.indexOf(scene.currentPlayer) >= 0), scene.moveSelected, scene.replayOfGame);
     }
 };

 function handlePlay(scene, data) {
     scene.moveSelected = false;
     if (data['message'].indexOf(FAILURE_MESSAGE) == -1 && data['message'].indexOf(DRAW_MESSAGE) == -1) {
         if (data['message'].indexOf(VICTORY_MESSAGE) > -1) {
             scene.gameOver = true;
             scene.endStatus = data['message'];
             console.log("SOMEONE WON");
             console.log(scene.moves.length);
         } else {
             console.log(data);
             var newBoard = JSON.parse(data['newPlayer']);
             var newMove = JSON.parse(data['message']);
             scene.boards.push(newBoard);
             if (!scene.replayOfGame) {
                 scene.currentBoard = newBoard;
                 scene.moves.push(newMove);
             }

             /*console.log(scene.graph.movTrack.lastPick.node);
             console.log(scene.graph.movTrack.lastPick);
             console.log(scene.graph.movTrack.newPick);
             */
             //4th position is the placed piece
             if (botPlayers.indexOf(scene.currentPlayer) >= 0 || scene.replayOfGame && !scene.animationPlaying) {

                 //Aqui é para fazer o move do bot mas ele está a borkar //where exactly
                 var pieceToAnimateId = scene.graph.movTrack.removeTopPiece(newMove[3]);
                 var worldCoords = boardCoordsToWorld(newMove[0], newMove[1]);
                 var pieceToMove = new Info(); //got it? will it work?
                 prologToInfo(newMove[3], pieceToMove);
                 pieceToMove.node = scene.graph.movTrack.board.getPieceNode(pieceToAnimateId);
                 pieceToMove.coord = pieceToMove.node.getCoords(pieceToMove.info1, pieceToMove.info2); //sabes color e type da p já acrescentei//? nao é isto? oh merda troquei
                 pieceToMove.obj = "piece";
                 pieceToMove.id = pieceToAnimateId; // ->acrescentei esta linha 
                 var cellToMove = new Object();
                 cellToMove.info1 = newMove[1];
                 cellToMove.info2 = newMove[0];
                 cellToMove.coord = worldCoords;
                 cellToMove.obj = "cell";

                 scene.graph.movTrack.copy(scene.graph.movTrack.animationElements['piece'], pieceToMove);
                 scene.graph.movTrack.copy(scene.graph.movTrack.animationElements['cell'], cellToMove);
                 if (scene.replayOfGame) {
                     console.log("Cutting used move");
                     scene.moves.splice(0, 1);
                     console.log(scene.moves.length);
                 }


                 //   console.log(pieceToAnimateId, pieceToMove, worldCoords);
             }

             scene.graph.movTrack.animate();
             getStats(scene);

             nextPlayer(scene);
         }
     } else {
         console.log("ERROR", data);

     }
     scene.updateEndTime = true;
     scene.play = false;
     // console.log("HAVE ASNWERS");
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
         console.log(this.camera.radius, this.camera.theta, this.camera.phi, this.camera.position);
         //console.log(deltaT, timePassed, this.camera.theta, this.camera.thetaZero, this.camera.position);
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

     this.textShader = new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");
     this.textShader.setUniformsValues({
         'dims': [16, 16]
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
 XMLscene.prototype.cameraChange = function() {

     if (this.graph.loadedOk && !this.rotateCameraFlag) {
         var cameraIndex = getIndex(cameraPositions, this.rotateCamera, equal);
         this.rotateCameraFlag = true;
         this.cameraToMovePos = cameraPositionsCoords[cameraIndex];
         this.startCameraAnimation = true;
     }

     if (this.startCameraAnimation) {

         this.startCameraAnimation = false;
         this.camera.startTime = Date.now();
         this.camera.calcRadius();
         this.camera.calcAngles();
         this.camera.updatePos();
         this.camera.updateZeros();
         console.log(this.camera.radius, this.camera.theta, this.camera.phi, this.camera.position);
         if (typeof this.cameraToMovePos !== 'undefined') {
             // console.log(this.camera.theta, this.camera.thetaZero, this.camera.position);

             //console.log(this.camera.theta, this.cameraToMovePos);
             var distance = distanceBetweenTwoSphericPoint(this.camera, this.cameraToMovePos);
             console.log(this.cameraToMovePos);
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
 };
 XMLscene.prototype.onGraphLoaded = function() {
     //set the backgroun and global ambient illumination parsed from the ILLUMINATION
     this.gl.clearColor(this.graph.background['r'], this.graph.background['g'], this.graph.background['b'], this.graph.background['a']);
     this.setGlobalAmbientLight(this.graph.ambient['r'], this.graph.ambient['g'], this.graph.ambient['b'], this.graph.ambient['a']);

     //enable textures/
     this.enableTextures(true);

     //create the axis given the INITIAL values
     this.axis = new CGFaxis(this, this.graph.initials.getAxisLength(), DEFAULT_THICKNESS);

     this.UpdateCamera();
     this.CreateLights();
     this.CreateMaterials();


     this.gui.game.add(this, 'startGame');
     this.gui.game.add(this, 'resetGame');
     this.gui.game.add(this, 'undoMove');
     this.gui.game.add(this, 'replayGame');
     this.gui.addCameraDropdown(this, cameraPositions);
     // Choose from accepted values
     this.gui.game.add(this, 'player1', ['black', 'random', 'greedy']);
     this.gui.game.add(this, 'player2', ['white', 'random', 'greedy']);
     this.gui.game.add(this, 'ambientID', this.ambients);
     this.gui.game.add(this, 'maxMoveTime').min(5).step(1); // Mix and match


     this.gui.scene = this;
     this.setUpdatePeriod(updateTime);
 };

 XMLscene.prototype.update = function(currTime) {
     this.currTime = currTime;


     if (this.gameStarted && !this.gameOver) {
         /*  if (this.changePlayer) {
               this.moveTime = 0;
               this.startPlay = currTime;
               this.changePlayer = false;
               console.log("updatePlayTime");
           } else {
               this.moveTime = (this.currTime - this.startPlay) / 1000.0;
               //  console.log(this.moveTime);
               if (this.moveTime >= this.maxMoveTime) {
                   this.moveTime = 0;
                   nextPlayer(this);
               }
           }*/
     }

     if (this.graph.loadedOk) {
         this.graph.update(currTime);
     }
     if (this.updateEndTime)
         this.endMoveTime++;

     if (this.rotateCameraFlag)
         this.updateCamera(currTime);
 };

 XMLscene.prototype.replayMove = function(move) {
     console.log("Replay Move", move, this.moves);
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

         if (!this.gameOver) {
             if (botPlayers.indexOf(this.currentPlayer) >= 0 && !this.replayOfGame /* && (this.endMoveTime >= endTimeMax)*/ ) {
                 this.endMoveTime = 0;
                 this.updateEndTime = false;
                 play(this, []);
             } else {

             }
             //console.log(this.endMoveTime);
             /*else
                             console.log(botPlayers.indexOf(this.currentPlayer) >= 0, this.replayOfGame);*/
         }
         //add play if bot
         if (this.replayOfGame && this.moves.length > 0 && !this.play && !this.replayingMove) {

             console.log(this.moves.length);
             var moveToReplay = this.moves[0];
             this.replayMove(moveToReplay);
             this.replayingMove = true;
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
     response = JSON.parse(data.target.response);
     console.log(response);
 };
