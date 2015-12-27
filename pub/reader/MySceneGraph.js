var nInitials = 1;
var ERROR = -1;
var FRUSTUM = "frustum";
var TRANSLATE = "translation";
var ROTATE = "rotation";
var SCALE = "scale";
var AXIS = "reference";
var oldMatrix;
var MAX_LIGHTS;
var POSITION_VARIABLES = ["x", "y", "z", "w"];
var RGB_VARIABLES = ["r", "g", "b", "a"];
var AxisX;
var AxisZ;
var AxisY;
var Axis;
var FIRST_ELEMENT;
var TO_ELIMINATE_CHAR = " ";
var nonValidChar = [""];

function MySceneGraph(filename, scene) {
    // alert("caller is " + arguments.callee.caller.toString());
    this.loadedOk = false;
    AxisX = false;
    AxisZ = false;
    AxisY = false;
    Axis = ["x", "y", "z"];

    FIRST_ELEMENT = 0;
    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;
    this.LightsID = [];
    this.materialsID = [];
    this.lights = [];
    this.materials = [];
    this.nodesID = [];
    this.nodes = [];
    this.rootNode = null;
    this.texArray = [];
    this.matArray = [];
    this.cycles = false;
    this.animations = [];
    this.animatedNodes = [];
    this.defaultMaterial = new CGFappearance(scene);
    this.defaultMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.defaultMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.defaultMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.defaultMaterial.setShininess(10.0);
    this.pieces = [];
    this.movTrack = new MovTrack(this.scene);
    // File reading 
    this.reader = new CGFXMLreader();
    MAX_LIGHTS = this.scene.lights.length;
    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */
    this.reader.open('scenes/' + filename, this);
};

MySceneGraph.prototype.display = function() {
    if (this.rootNode != null) {
        if (!this.cycles) {
            this.transformation.apply();
            this.rootNode.display(this.rootNode);

        }
    } else
        this.onXMLError("Element Root missing");
};

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;
    this.notShow = false;
    // Here should go the calls for different functions to parse the various blocks
    try {
        if (rootElement == null || rootElement.nodeName != "SCENE")
            throw new XMLError("main block missing");

        this.initials = new initials();
        this.transformation = new Transformation(this.scene);

        this.parseTextures(rootElement);
        this.parseInitials(rootElement);
        this.parseIllumination(rootElement);
        this.parseLights(rootElement);
        this.parseMaterials(rootElement);
        this.parseLeaf(rootElement);
        this.parseAnimations(rootElement);
        this.parseNodes(rootElement);

    } catch (err) {
        if (err instanceof XMLError) {
            console.error(err.message);
            this.loadedOk = false;
            return;
        } else
            console.error(err.message);
    }

    this.loadedOk = true;
    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

MySceneGraph.prototype.update = function(currTime) {
    //Sendo psedo referência os nós em this.animatedNodes serão os mesmo que os de this.nodes
    for (key in this.animatedNodes) {
        this.animatedNodes[key].update(currTime);
    }
    this.movTrack.update(currTime);
    this.scene.Loop = false;
};

MySceneGraph.prototype.parseMaterials = function(rootElement) {

    console.log("Start MATERIALS");
    var tempList = rootElement.getElementsByTagName('MATERIALS');


    if (tempList == null || tempList.length == 0) {
        console.warn("No MATERIALS available, default light will be createrd ");
    } else
    if (tempList.length > 1) {
        this.onXMLWarn("More than 1 set of MATERIALS, only the first set will be used");
    }

    var nMaterials = tempList[0].children.length;
    this.materials = typeof this.materials !== 'undefined' ? this.materials : [];
    for (var i = 0; i < nMaterials; i++) {
        var currLight = tempList[FIRST_ELEMENT].children[i];
        if (currLight.nodeName == 'MATERIAL') {
            //por as classes a tratar do parsing dos objetos em si

            var newMaterial = new Materials();
            var newID = addID(currLight, this, this.materialsID);
            var newSpec = readElement(tempList[FIRST_ELEMENT].children[i].getElementsByTagName("specular"), RGB_VARIABLES, 1);
            var newShin = readElement(tempList[FIRST_ELEMENT].children[i].getElementsByTagName("shininess"), ["value"], 1);
            var newEmi = readElement(tempList[FIRST_ELEMENT].children[i].getElementsByTagName("emission"), RGB_VARIABLES, 1);
            var newAmb = readElement(tempList[FIRST_ELEMENT].children[i].getElementsByTagName("ambient"), RGB_VARIABLES, 1);
            var newDiff = readElement(tempList[FIRST_ELEMENT].children[i].getElementsByTagName("diffuse"), RGB_VARIABLES, 1);

            newMaterial.setID(newID);
            newMaterial.setEmission(newEmi);
            newMaterial.setShininess(newShin);
            newMaterial.setAmbient(newAmb);
            newMaterial.setDiffuse(newDiff);
            newMaterial.setSpecular(newSpec);
            newMaterial.setAppearence(this.scene);

            this.materials[newID] = newMaterial; // this.materials.push(newMaterial);
        } else {
            this.onXMLWarn("Element was not MATERIAL it was: " + currLight.nodeName);
        }
    }

    console.log("End MATERIALS");
};

MySceneGraph.prototype.parseLights = function(rootElement) {
    console.log("Start LIGHTS");

    var tempList = rootElement.getElementsByTagName('LIGHTS');
    var numberLights = tempList.length;


    if (tempList == null || tempList.length == 0) {
        this.onXMLWarn("No LIGHTS available, default light will be createrd ");
    }
    var nLight = tempList[0].children.length;
    if (nLight == 0) {
        console.warn("No LIGHT was found, please check your LIGHTS scetion of you lsx");


    } else {
        this.lights = typeof this.lights !== 'undefined' ? this.lights : [];
        for (var j = 0; j < numberLights; j++) {

            for (var i = 0; i < nLight; i++) {
                //alterar segunda parte do if
                if (MAX_LIGHTS <= this.LightsID.length) {

                    this.onXMLWarn("Max number of lights have been added ( " + MAX_LIGHTS + ")");
                    return;
                }
                var currLight = tempList[j].children[i];
                if (currLight.nodeName == 'LIGHT') {
                    //por as classes a tratar do parsing dos objetos em si
                    var newLight = new Lights();
                    var newID = addID(currLight, this, this.LightsID);
                    var newEnable = readElement(tempList[j].children[i].getElementsByTagName("enable"), ["value"], 1);
                    var newPos = readElement(tempList[j].children[i].getElementsByTagName("position"), POSITION_VARIABLES, 1);
                    var newAmb = readElement(tempList[j].children[i].getElementsByTagName("ambient"), RGB_VARIABLES, 1);
                    var newDiff = readElement(tempList[j].children[i].getElementsByTagName("diffuse"), RGB_VARIABLES, 1);
                    var newSpec = readElement(tempList[j].children[i].getElementsByTagName("specular"), RGB_VARIABLES, 1);

                    newLight.setID(newID);
                    newLight.setEnabled(newEnable);
                    newLight.setPosition(newPos);
                    newLight.setAmbient(newAmb);
                    newLight.setDiffuse(newDiff);
                    newLight.setSpecular(newSpec);
                    this.lights.push(newLight);
                } else {
                    this.onXMLWarn("Element not LIGHT it was: " + currLight.nodeName);
                }
            }
        }
    }
    console.log("End LIGHTS");
};

MySceneGraph.prototype.parseInitials = function(rootElement) {

    console.log("Start INITIALS");
    var tempList = rootElement.getElementsByTagName('INITIALS');

    if (tempList == null || tempList.length == 0) {
        this.onXMLError("INITIALS element is missing.");
        return -1;
    }

    if (tempList.length > nInitials) {
        this.onXMLWarn("More than 1 INITIALS element, only the first one will be used  ");
    }

    var expectedElements = [FRUSTUM, TRANSLATE, ROTATE, ROTATE, ROTATE, SCALE, AXIS];
    var nNodes = tempList[0].children.length;

    for (var i = 0; i < nNodes; i++) {
        if (tempList[0].children[i].nodeName != expectedElements[i]) {

            this.onXMLError("Wrong element in Inititals,please check your .lsx :\n" + FRUSTUM + "\n" + TRANSLATE + "\n" + ROTATE + "\n" + ROTATE + "\n" + ROTATE + "\n" + SCALE + "\n" + AXIS);
        } else
            this.parseInitialsAux(tempList[0].children[i], expectedElements[i]);
    }

    if (!(AxisX && AxisZ && AxisY)) {
        this.onXMLError("Missing axis in the Initials Rotations, please check that you have one and ONLY one rotation per axis (x,y,z)\n" + "Axis X: " + AxisX + " Axis Y: " + AxisY + " Axis Z: " + AxisZ);
    }

    console.log("End INITIALS");
};

MySceneGraph.prototype.parseLeaf = function(rootElement) {
    console.log("Start LEAVES");
    var tempList = rootElement.getElementsByTagName('LEAVES');

    if (tempList == null || tempList.length == 0) {
        this.onXMLError("LEAVES element is missing.");
        return -1;
    }

    if (tempList.length > nInitials) {
        this.onXMLWarn("More than 1 LEAVES element, only the first one will be used  ");
    }

    var nNodes = tempList[0].children.length;
    this.nodes = typeof this.nodes !== 'undefined' ? this.nodes : [];
    for (var i = 0; i < nNodes; i++) {
        var currLeaf = tempList[FIRST_ELEMENT].children[i];
        if (currLeaf.nodeName == 'LEAF') {

            var tempLeaf = new Leaf(this);
            var tempID = addID(currLeaf, this, this.nodesID);
            var leaf = [tempList[FIRST_ELEMENT].children[i]];
            var typeOfLeaf = readElement(leaf, ["type"], 1);
            tempLeaf = parseLeafAux(tempLeaf, typeOfLeaf);
            //passar para função da classe Leaf mãe e ter classes filhas patch plane e a outra a fazer em separado
            tempLeaf.processArgs(leaf, currLeaf, this.scene);
            tempLeaf.setID(tempID);
            tempLeaf.setGraph(this);
            this.nodes.push(tempLeaf);
        } else {
            this.onXMLWarn("Element not LEAF it was: " + currLeaf.nodeName);
        }
    }
    console.log("End LEAVES");
};

MySceneGraph.prototype.parseInitialsAux = function(DOM, typeOfElement) {

    switch (typeOfElement) {
        case FRUSTUM:
            parseFrustum(this.initials, DOM);
            break;
        case TRANSLATE:
            this.transformation.parseTransformation(DOM, TRANSLATE)
            break;
        case ROTATE:
            this.transformation.parseTransformation(DOM, ROTATE);
            break;
        case SCALE:
            this.transformation.parseTransformation(DOM, SCALE);
            break;
        case AXIS:
            parseAxisLength(this.initials, DOM);
            break;
        default:
            this.onXMLWarn("unknwon type of Element: " + DOM);
    }
};

MySceneGraph.prototype.parseAnimations = function(rootElement) {
    console.log("Start ANIMATIONS");

    var tempList = rootElement.getElementsByTagName('ANIMATIONS');

    if (tempList == null || tempList.length == 0) {
        this.onXMLWarn("No ANIMATIONS available ");

    } else {
        var nAnimation = tempList[FIRST_ELEMENT].children.length;
        if (nAnimation == 0) {
            console.warn("No ANIMATION was found, please check your ANIMATION scetion of you lsx");

        } else {
            this.animations = typeof this.animations !== 'undefined' ? this.animations : [];

            for (var i = 0; i < nAnimation; i++) {
                //alterar segunda parte do if
                var currAnimation = tempList[FIRST_ELEMENT].children[i];
                var tempAnimation = null;
                var deltaT = readElement([currAnimation], ["span"], 1);
                if (currAnimation.nodeName == 'ANIMATION') {

                    var type = readElement([currAnimation], ["type"], 1);

                    if (type[FIRST_ELEMENT] == "linear") {

                        var controlPoints = currAnimation.getElementsByTagName("controlpoint");
                        var control = readElement(controlPoints, POSITION_VARIABLES, controlPoints.length);
                        tempAnimation = new LinearAnimation(this.scene, Number(deltaT), processControlPoints(control));
                        tempAnimation.type = "linear";

                    } else
                    if (type[FIRST_ELEMENT] == "circular") {

                        tempAnimation = new CircularAnimation(this.scene, Number(deltaT));
                        tempAnimation.type = "circular";
                        tempAnimation.setCenter(readElement([currAnimation], ["center"], 1));
                        tempAnimation.setStartAngle(readElement([currAnimation], ["startang"], 1));
                        tempAnimation.setRotateAngle(readElement([currAnimation], ["rotang"], 1));
                        tempAnimation.setRadius(readElement([currAnimation], ["radius"], 1));
                        tempAnimation.calculateDelta();

                    } else {
                        this.onXMLWarn("ANIMATION was not valid: " + type[FIRST_ELEMENT]);
                        break;
                    }
                    tempAnimation.id = addID(currAnimation, this, this.animationsID);


                    if (tempAnimation != null) {
                        //  console.log(tempAnimation);
                        this.animations[tempAnimation.id] = tempAnimation;
                    }
                    tempAnimation = null;
                } else {
                    this.onXMLWarn("Element not ANIMATION it was: " + currAnimation.nodeName);
                }
            }
        }
    }
    console.log("End ANIMATIONS");
};

MySceneGraph.prototype.parseIllumination = function(rootElement) {

    console.log("Start ILLUMINATION");
    this.ambient = {};
    this.background = {};

    var elems = this.checkTag(rootElement, 'ILLUMINATION');
    this.parseRGBA(this.ambient, elems, 'ambient');
    this.parseRGBA(this.background, elems, 'background');

    console.log("End ILLUMINATION");
};

MySceneGraph.prototype.parseTextures = function(rootElement) {

    console.log("Start TEXTURES");
    this.textures = [];

    var elems = this.checkTag(rootElement, 'TEXTURES', false);
    elems = this.checkTag(elems[0], 'TEXTURE', false, 1);

    for (var i = 0; i < elems.length; i++) {
        var texture = new Texture();
        this.idIndex(this.textures, texture, elems[i], 'texture');

        var elems2 = this.checkTag(elems[i], 'file', false, 1, 1);
        texture.path = this.reader.getString(elems2[0], 'path');
        texture.amplif_factor = {};
        this.parseST(texture.amplif_factor, elems[i], 'amplif_factor');
        texture.createTexture(this.scene);

        //this.textures.push(texture);
        this.textures[texture.id] = texture;
    }


    //create clear Texture in array
    var clearTexture = new Texture();
    clearTexture.id = "clear";
    this.textures[clearTexture.id] = clearTexture;

    console.log("End TEXTURES");
};

MySceneGraph.prototype.getTexture = function(id) {
    for (var i = 0; i < this.textures.length; i++) {
        if (this.textures[i].id == id)
            return this.textures[i];
    }
    return null;
};

MySceneGraph.prototype.getMaterial = function(id) {
    for (var i = 0; i < this.materials.length; i++) {
        if (this.materials[i].id == id)
            return this.materials[i];
    }
    return null;
};

MySceneGraph.prototype.idIndex = function(arr, obj, node, tag) {

    obj.id = this.reader.getString(node, 'id');
    if (obj.id == null || obj.id == "")
        throw new XMLError(tag + " ID not unique");
    var pos = arr.map(function(e) {
        return e.id
    }).indexOf(obj.id);
    //element already exists
    if (pos > -1)
        this.onXMLWarn("a " + tag + " with same id already exists. It won't be added");
};

MySceneGraph.prototype.parseRGBA = function(obj, node, tag) {

    //default RGBA
    if (node == null) {
        obj.r = 0.0;
        obj.g = 0.0;
        obj.b = 0.0;
        obj.a = 0.0;
    } else {
        var elems = this.checkTag(node[0], tag);
        if (elems == null) {
            obj.r = 0.0;
            obj.g = 0.0;
            obj.b = 0.0;
            obj.a = 0.0;
        } else {
            obj.r = this.reader.getFloat(elems[0], 'r') || 0;
            obj.g = this.reader.getFloat(elems[0], 'g') || 0;
            obj.b = this.reader.getFloat(elems[0], 'b') || 0;
            obj.a = this.reader.getFloat(elems[0], 'a') || 0;
        }
    }
};

MySceneGraph.prototype.parseST = function(obj, node, tag) {

    //default ST
    if (node == null) {
        obj.s = 1.0;
        obj.t = 1.0;
    } else {
        var elems = this.checkTag(node, tag);
        if (elems == null) {
            obj.s = 1.0;
            obj.t = 1.0;
        } else {
            obj.s = this.reader.getFloat(elems[0], 's') || 1;
            obj.t = this.reader.getFloat(elems[0], 't') || 1;
        }
    }
};

MySceneGraph.prototype.checkTag = function(node, tag, def, min, origin) {

    var various;
    if (typeof min === 'undefined') min = -1, various = 1;
    else
        various = 0;
    if (typeof def === 'undefined') def = true;

    var elems = node.getElementsByTagName(tag);

    //Number of tags smaller than needed
    if (elems == null || (elems.length < min && min != -1) || (elems.length < various && min == -1)) {

        var tempOrigin = "";
        if (typeof origin !== 'undefined')
            tempOrigin = "In " + origin;

        if (def) {
            this.onXMLWarn(tag + " not found. Using default values" + tempOrigin);
        } else
            throw new XMLError(tag + " not found. Cannot proceed" + tempOrigin);
        return null;
    }

    //Number of tags bigger than supposed
    //Min = -1 means that there is no min or max but specific number of tags needed
    //With min!=-1 there is no max value
    else if (elems.length > various && min == -1)
        this.onXMLWarn("multiple " + tag + " found. Using the " + various + " first(s)");

    return elems;
};

MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};

MySceneGraph.prototype.parseNodes = function(rootElement) {
    console.log("Start NODES");
    var elems = this.checkTag(rootElement, 'NODES', false);

    var root = this.checkTag(elems[0], 'ROOT', false);
    var rootName = this.reader.getString(root[0], 'id');
    var animated;
    elems = this.checkTag(elems[0], 'NODE', false, 1);

    for (var i = 0; i < elems.length; i++) {
        var id = addID(elems[i], this, this.nodesID);
        var node;
        if (id == "board") {
            node = new Board(this);
            this.movTrack.board = node;
        } else if (id == "hexObject")
            node = new BoardCell(this);
        else if (id == "diskObject" || id == "ringObject") {
            node = new Piece(this);
            this.pieces.push(node);
        } else
            node = new Node(this);
        var descendants = [];
        var nodeTransformation = new Transformation(this.scene);
        node.id = id;
        var elems2 = this.checkTag(elems[i], 'MATERIAL', undefined, undefined, node.id);
        node.material = this.reader.getString(elems2[0], 'id');
        elems2 = this.checkTag(elems[i], 'TEXTURE');
        node.texture = this.reader.getString(elems2[0], 'id', undefined, undefined, node.id);

        //descendants
        elems2 = this.checkTag(elems[i], 'DESCENDANTS', false);
        elems2 = this.checkTag(elems2[0], 'DESCENDANT', false, 1);

        for (var j = 0; j < elems2.length; j++) {
            var descendant = this.reader.getString(elems2[j], 'id');
            descendants.push(descendant);
        }
        node.descendentsID = descendants;

        //get Animations
        var tempList = elems[i].getElementsByTagName('ANIMATION');

        if (tempList != null && tempList.length != 0) {
            animated = true;
            for (var j = 0; j < tempList.length; j++) {
                var tempID = this.reader.getString(tempList[j], 'id');

                if (typeof this.animations[tempID] !== 'undefined') {
                    var tempAnimation = this.animations[tempID].clone(this.scene);
                    if (tempID == null) {
                        console.log("Adding Animation with ID: " + tempID + " to Node ( " + node.id + " ) failed since Animation does not exist");
                    } else if (tempAnimation != null && ((typeof tempAnimation) !== "undefined")) {

                        if (node.animations.length == 0) {
                            tempAnimation.init((new Date()).getTime());
                            node.started = true;
                            node.currentAnimation = tempAnimation;
                        }
                        node.animations.push(tempAnimation);
                    }
                    tempAnimation = null;
                }
            }
        } else
            animated = false;

        //transformations
        parseNodeTransformation(node, elems[i].children, nodeTransformation);
        node.transformation = nodeTransformation;
        this.nodes.push(node);

        if (animated) {
            this.animatedNodes.push(node);
            animated = false;
        }

        if (node.id == rootName)
            this.rootNode = node;
    }

    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].processDescendents();
    }

    this.checkCycle();
    console.log("END NODES");
};

MySceneGraph.prototype.setUnvisited = function() {

    for (var key = 0; key < this.nodes.length; key++) {

        this.nodes[key].visited = false;
    }
};

MySceneGraph.prototype.checkCycle = function() {
    this.setUnvisited();
    for (var key = 0; key < this.nodes.length; key++) {
        if (!this.nodes[key].getVisited()) {
            if (this.nodes[key].checkCycle()) {
                this.onXMLError("Graph has Cycles");
                this.cycles = true;
                return;
            }
        }
    }
};

MySceneGraph.prototype.onXMLWarn = function(message) {
    console.warn("XML Loading Warning: " + message);
};

function XMLError(message) {
    this.message = "XML Loading Error: " + message;
    this.name = "XML Error";
};
