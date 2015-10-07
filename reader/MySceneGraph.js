var nInitials = 1;
var ERROR = -1;
var FRUSTUM = "frustum";
var TRANSLATE = "translate";
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

//ver que matrix passsar 
//fazer get and sets para stuff the initials, perhaps change code para evitar duplicado como temos de parseLights e parseMaterials
function MySceneGraph(filename, scene) {
    // alert("caller is " + arguments.callee.caller.toString());
    this.loadedOk = null;
    AxisX = false;
    AxisZ = false;
    AxisY = false;
    Axis = ["x", "y", "z"];

    FIRST_ELEMENT = 0;
    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

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

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    try{
        if (rootElement == null || rootElement.nodeName != "SCENE")
            throw new XMLError("main block missing");

        this.initials = new initials();
        this.transformation = new Transformation(this.scene);

        this.parseInitials(rootElement);
        this.parseIllumination(rootElement);
        this.parseLights(rootElement);
        this.parseTextures(rootElement);
        this.parseMaterials(rootElement);
        this.parseLeaf(rootElement);
        //this.parseNodes(rootElement);
    }
    catch(err) {
        if( err instanceof XMLError){
            console.error(err.message);
            this.loadedOk = false;
            return;
        }
        else
            console.error(err.message);
    }

    this.loadedOk=true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
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
    for (var i = 0; i < nMaterials; i++) {
        var currLight = tempList[FIRST_ELEMENT].children[i];
        if (currLight.nodeName == 'MATERIAL') {
            //por as classes a tratar do parsing dos objetos em si

            var newMaterial = new Materials();
            var newID = addID(currLight, this, this.initials.materialsID);
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
            this.initials.materials.push(newMaterial);
        } else {
            this.onXMLWarn("Element was not MATERIAL it was: " + currLight.nodeName);
        }
    }
    console.log("End MATERIALS");
};

MySceneGraph.prototype.parseBlock = function(rootElement, mainBlockName, subBlockName, moreThanOneBlock, elementsToParse) {
    //MATERIALS
    var tempList = rootElement.getElementsByTagName(mainBlockName);

    if (tempList == null || tempList.length == 0) {
        console.warn("No " + mainBlockName + " available, default light will be created ");
    } else
    if (tempList.length > 1) {
        this.onXMLWarn("More than 1 set of " + mainBlockName + ", only the first set will be used");
    }
    var size = tempList[0].children.length;
    for (var i = 0; i < size; i++) {
        if (currLight.nodeName == subBlockName) {
            var currLight = tempList[FIRST_ELEMENT].children[i];
            for (var j = 0; j < variablesToObtain.length; j++) {
                //array para guardar vairáveis e depois função de parsing para o  inside deals com o que for do que??    
                addID(currLight, this, arrayToStoreValues);
                readElement(tempList[FIRST_ELEMENT].children[i].getElementsByTagName(variablesToObtain[j].nameOfElement), variablesToObtain[j].variables, variablesToObtain[j].timesInBlock);
            }
        } else {
            this.onXMLWarn("Element was not " + subBlockName + " it was: " + currLight.nodeName);
        }

    }
};
MySceneGraph.prototype.parseLights = function(rootElement) {
    console.log("Start LIGHTS");

    var tempList = rootElement.getElementsByTagName('LIGHTS');
    var numberLights = tempList.length;


    if (tempList == null || tempList.length == 0) {
        this.onXMLWarn("No LIGHTS available, default light will be createrd ");
    }
    var nLight = tempList[0].children.length;

    if (this.initials.lights == undefined) {
        this.initials.lights = [];
    }
    for (var j = 0; j < numberLights; j++) {

        for (var i = 0; i < nLight; i++) {
            //alterar segunda parte do if
            if (MAX_LIGHTS <= this.initials.LightsID.length) {

                this.onXMLWarn("Max number of lights have been added ( " + MAX_LIGHTS + ")");
                return;
            }
            var currLight = tempList[j].children[i];
            if (currLight.nodeName == 'LIGHT') {
                //por as classes a tratar do parsing dos objetos em si
                var newLight = new Lights();
                var newID = addID(currLight, this, this.initials.LightsID);
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
                this.initials.lights.push(newLight);
            } else {
                this.onXMLWarn("Element not LIGHT it was: " + currLight.nodeName);
            }
        }
    }
    console.log("End LIGHTS");
};


MySceneGraph.prototype.parseInitials = function(rootElement) {

    console.log("Start INITIALS");
    var tempList = rootElement.getElementsByTagName('INITIALS');
    console.log(tempList);

    if (tempList == null || tempList.length == 0) {
        this.onXMLError("INITIALS element is missing.");
        return -1;
    }

    if (tempList.length > nInitials) {
        this.onXMLWarn("More than 1 INITIALS element, only the first one will be used  ");
    }

    var expectedElements = [FRUSTUM, TRANSLATE, ROTATE, ROTATE, ROTATE, SCALE, AXIS];
    var nNodes = tempList[0].children.length;
    for (var i = nNodes - 1; i >= 0; i--) {

        if (tempList[0].children[i].nodeName != expectedElements[i]) {
            this.onXMLError("Wrong order in Inititals,please place them in the correct order:\n" + FRUSTUM + "\n" + TRANSLATE + "\n" + ROTATE + "\n" + ROTATE + "\n" + ROTATE + "\n" + SCALE + "\n" + AXIS);
        } else
            this.parseInitialsAux(tempList[0].children[i], expectedElements[i]);
    }

    if (!(AxisX && AxisZ && AxisY)) {
        this.onXMLError("Missing axis in the Initials Rotations, please check that you have one and ONLY one rotation per axis (x,y,z)");
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
    for (var i = 0; i < nNodes; i++) {
        var currLeaf = tempList[FIRST_ELEMENT].children[i];
        if (currLeaf.nodeName == 'LEAF') {

            var tempLeaf = new Leaf();
            var tempID = addID(currLeaf, this, this.initials.leavesID);
            var leaf = [tempList[FIRST_ELEMENT].children[i]];
            var typeOfLeaf = readElement(leaf, ["type"], 1);
            var args = readElement(leaf, ["args"], 1);

            tempLeaf = parseLeafAux(tempLeaf, typeOfLeaf);
            tempLeaf.parseLeaf(args.toString().split(" "), this.scene);
            this.initials.leaves.push(tempLeaf);
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

MySceneGraph.prototype.parseIllumination = function(rootElement) {

    console.log("Start ILLUMINATION");
    this.ambient={}; this.background = {};

    var elems = this.checkTag(rootElement,'ILLUMINATION');
    this.parseRGBA(this.ambient, elems, 'ambient');
    this.parseRGBA(this.background, elems, 'background');

    console.log("End ILLUMINATION");
};

MySceneGraph.prototype.parseTextures = function(rootElement) {

    console.log("Start TEXTURES");
    this.textures = [];

    var elems = this.checkTag(rootElement,'TEXTURES', false);
    elems = this.checkTag(elems[0],'TEXTURE', false, 1);

    for (var i = 0; i < elems.length; i++) {
        var texture = {};
        this.idIndex(this.textures, texture, elems[i], 'texture');
        /*
        var elems2 = this.checkTag(elems[i], 'file', false, 1, 1);
        texture.path = this.reader.getString(elems2[0], 'path');
        texture.amplif_factor = {};
        this.parseST(texture.amplif_factor, elems[i], 'amplif_factor');
        this.textures.push(texture);
        */
    }

    console.log("End TEXTURES");
};

MySceneGraph.prototype.idIndex = function (arr, obj, node, tag){

    obj.id = this.reader.getString(node, 'id');
    if (obj.id == null || obj.id == "")
        throw new XMLError(tag + " ID not unique");
    var pos = arr.map(function (e) {return e.id}).indexOf(obj.id);
    //element already exists
    if (pos > -1)
        this.XMLWarn("a " + tag + " with same id already exists. It won't be added");
};

MySceneGraph.prototype.parseRGBA = function(obj, node, tag){

    //default RGBA
    if(node == null){
        obj.r = 1.0; obj.g = 1.0; obj.b = 1.0; obj.a = 1.0;
    }
    else{
        var elems = this.checkTag(node[0], tag);
        if(elems == null){
            obj.r = 1.0; obj.g = 1.0; obj.b = 1.0; obj.a = 1.0;
        }
        else{
            obj.r = this.reader.getFloat(elems[0], 'r') || 1;
            obj.g = this.reader.getFloat(elems[0], 'g') || 1;
            obj.b = this.reader.getFloat(elems[0], 'b') || 1;
            obj.a = this.reader.getFloat(elems[0], 'a') || 1;
        }
    }
};

MySceneGraph.prototype.parseST = function(obj, node, tag){

    //default ST
    if(node == null){
        obj.s = 1.0; obj.t = 1.0;
    }
    else{
        var elems = this.checkTag(node, tag);
        if(elems == null){
            obj.s = 1.0; obj.t = 1.0;
        }
        else{
            obj.s = this.reader.getFloat(elems[0], 's') || 1;
            obj.t = this.reader.getFloat(elems[0], 't') || 1;
        }
    }
};

MySceneGraph.prototype.checkTag = function(node, tag, def, min){

    var various;
    if (min===undefined) min=-1, various = 1;
    else
        various = 0;
    if (def===undefined) def=true;

    var elems = node.getElementsByTagName(tag);

    //Number of tags smaller than needed
    if(elems == null || (elems.length < min && min != -1) || (elems.length < various && min==-1)){
        if (def)
            this.onXMLWarn(tag + " not found. Using default values");
        else
            throw new XMLError(tag + " not found. Cannot proceed");
        return null;
    }

    //Number of tags bigger than supposed
    //Min = -1 means that there is no min or max but specific number of tags needed
    //With min!=-1 there is no max value
    else if (elems.length > various && min == -1)
        this.XMLWarn("multiple " + tag + " found. Using the " + various + " first(s)");

    return elems;
};

MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
MySceneGraph.prototype.onXMLWarn = function(message) {
    console.warn("XML Loading Warning: " + message);
};

function XMLError(message){

    this.message = "XML Loading Error: " + message;
    this.name = "XML Error";
 }