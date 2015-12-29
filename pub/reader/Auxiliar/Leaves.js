//Default values for all leaves
var FIRST_ELEMENT = 0;

function Leaf(graph) {
    this.element = null;
    this.ID;
    this.type;
    this.graph = graph;
    this.args = [];
    this.stillChecking = false;
};
Leaf.prototype.update = function(currTime) {};
Leaf.prototype.setID = function(newID) {
    this.ID = newID;
};
Leaf.prototype.getID = function() {
    return this.ID;
};
Leaf.prototype.getElement = function() {
    return this.element;
};
Leaf.prototype.setArgs = function(newArgs) {
    this.args = newArgs;
};
Leaf.prototype.getArgs = function() {
    return this.args;
};
Leaf.prototype.setGraph = function(newGraph) {
    this.graph = newGraph;
}
Leaf.prototype.parseLeaf = function(args, scene) {};

Leaf.prototype.getVisited = function() {
    return false;
};
Leaf.prototype.checkCycle = function() {
    return false;
};
Leaf.prototype.processArgs = function(leaf, currLeaf, scene) {
    var args = readElement(leaf, ["args"], 1);
    var processedArgs = deleteElement(args.toString().split(TO_ELIMINATE_CHAR), function(x) {

        if (isNaN(Number(x)) || (nonValidChar.indexOf(x) != -1))
            return true;
        else
            return false;

    });

    this.parseLeaf(processedArgs, scene);
};
Leaf.prototype.processDescendents = function() {};

Leaf.prototype.display = function(parentElement) {

    var material = this.graph.matArray[this.graph.matArray.length - 1];
    var texture = this.graph.texArray[this.graph.texArray.length - 1];

    if (typeof texture !== 'undefined') {
        if (texture.id != "clear")
            material.setTexture(texture.cgf);
        else
            material.setTexture(null);
    }

    material.appearance.apply();
    this.element.display();
};

//Leaf that represents a Rectangle
LeafRectangle.prototype = Object.create(Leaf.prototype);
LeafRectangle.prototype.constructor = LeafRectangle;

function LeafRectangle() {
    Leaf.call(this);
}
LeafRectangle.prototype.parseLeaf = function(args, scene) {
    this.type = "Rectangle";
    var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
    var tempIndex = tempArgs.indexOf("inf");
    if (tempIndex != -1) {
        console.error("Invalid paramenter in the creation of a rectangle ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
    } else {
        this.element = new Rectangle(scene, [args[0], args[1], 0], [args[2], args[3], 0]);
    }
};


LeafRectangle.prototype.display = function(parentElement) {

    var material = this.graph.matArray[this.graph.matArray.length - 1];
    var texture = this.graph.texArray[this.graph.texArray.length - 1];
    if (typeof texture !== 'undefined') {
        this.element.setAmplif(texture.amplif_factor['s'], texture.amplif_factor['t']);

        if (texture.id != "clear")
            material.setTexture(texture.cgf);
        else
            material.setTexture(null);
    }

    material.appearance.apply();
    this.element.display();
};

//
//
LeafTriangle.prototype = Object.create(Leaf.prototype);
LeafTriangle.prototype.constructor = LeafTriangle;

function LeafTriangle() {
    Leaf.call(this);
}

LeafTriangle.prototype.display = function(parentElement) {

    var material = this.graph.matArray[this.graph.matArray.length - 1];
    var texture = this.graph.texArray[this.graph.texArray.length - 1];
    if (typeof texture !== 'undefined') {
        this.element.setAmplif(texture.amplif_factor['s'], texture.amplif_factor['t']);

        if (texture.id != "clear")
            material.setTexture(texture.cgf);
        else
            material.setTexture(null);
    }

    material.appearance.apply();
    this.element.display();
};

LeafTriangle.prototype.parseLeaf = function(args, scene) {
    this.type = "Triangle";

    var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
    var tempIndex = tempArgs.indexOf("inf");
    if (tempIndex != -1) {
        console.error("Invalid paramenter in the creation of a triangle ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
    } else {
        this.element = new Triangle(scene, [args[0], args[1], args[2]], [args[3], args[4], args[5]], [args[6], args[7], args[8]]);

    }
};

//
//
LeafCylinder.prototype = Object.create(Leaf.prototype);
LeafCylinder.prototype.constructor = LeafCylinder;

function LeafCylinder() {
    Leaf.call(this);
}

LeafCylinder.prototype.parseLeaf = function(args, scene) {
    this.type = "Cylinder";
    var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
    var tempIndex = tempArgs.indexOf("inf");
    if (tempIndex != -1) {
        console.error("Invalid paramenter in the creation of a cylinder ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
    } else {
        this.element = new Cylinder(scene, args[0], args[1], args[2], args[3], args[4]);
    }
};


//
//
LeafSphere.prototype = Object.create(Leaf.prototype);
LeafSphere.prototype.constructor = LeafSphere;

function LeafSphere() {
    Leaf.call(this);
}

LeafSphere.prototype.parseLeaf = function(args, scene) {
    this.type = "Sphere";
    var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
    var tempIndex = tempArgs.indexOf("inf");
    if (tempIndex != -1) {
        console.error("Invalid paramenter in the creation of a sphere ( " + tempArgs[tempIndex] + " ), this leaf will be ignored");
    } else {
        this.element = new Sphere(scene, args[2], args[1], args[0]);
    }
};

LeafHex.prototype = Object.create(Leaf.prototype);
LeafHex.prototype.constructor = LeafHex;

function LeafHex() {
    Leaf.call(this);
}

LeafHex.prototype.parseLeaf = function(args, scene) {
    this.type = "Hex";
    var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
    this.element = new Hex(scene);
};

LeafTorus.prototype = Object.create(Leaf.prototype);
LeafTorus.prototype.constructor = LeafTorus;

function LeafTorus() {
    Leaf.call(this);
}

LeafTorus.prototype.parseLeaf = function(args, scene) {
    this.type = "Torus";
    var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
    var tempIndex = tempArgs.indexOf("inf");
    if (tempIndex != -1) {
        console.error("Invalid paramenter in the creation of a sphere ( " + tempArgs[tempIndex] + " ), this leaf will be ignored");
    } else {
        this.element = new Torus(scene, tempArgs[0], tempArgs[1], tempArgs[2], tempArgs[3]);
    }
};

//TODO REPLACE WITH PROPER CONSTRUCTORES
LeafPlane.prototype = Object.create(Leaf.prototype);
LeafPlane.prototype.constructor = LeafPlane;

function LeafPlane() {
    Leaf.call(this);
}

LeafPlane.prototype.parseLeaf = function(args, scene) {
    this.type = "plane";
    var tempArgs = stringArrayToNumber(args, "partsS", 1, "inf", 1);
    var tempIndex = tempArgs.indexOf("inf");
    if (tempIndex != -1) {
        console.error("Invalid paramenter in the creation of a plane ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
    } else {


        this.element = new Plane(scene, args[0]);
    }
};
LeafPlane.prototype.processArgs = function(leaf, currLeaf, scene) {
    var args = readElement(leaf, ["parts"], 1);
    this.parseLeaf(args, scene);
};

LeafPatch.prototype = Object.create(Leaf.prototype);
LeafPatch.prototype.constructor = LeafPatch;

function LeafPatch() {
    Leaf.call(this);
};

LeafPatch.prototype.parseLeaf = function(control, order, partsU, partsV, scene) {
    this.type = "patch";
    var tempOrder = stringArrayToNumber(order, "order", 1, "inf", 1);
    var tempPartsU = stringArrayToNumber(partsU, "partsU", 1, "inf", 1);
    var tempPartsV = stringArrayToNumber(partsV, "partsV", 1, "inf", 1);
    this.element = new Patch(scene, tempOrder[FIRST_ELEMENT], tempPartsV[FIRST_ELEMENT], tempPartsU[FIRST_ELEMENT], control);
};
LeafPatch.prototype.processArgs = function(leaf, currLeaf, scene) {

    var controlPoints = currLeaf.getElementsByTagName("controlpoint");
    var control = processControlPoints(readElement(controlPoints, POSITION_VARIABLES, controlPoints.length));
    var order = readElement(leaf, ["order"], 1);
    var partsU = readElement(leaf, ["partsU"], 1);
    var partsV = readElement(leaf, ["partsV"], 1);
    this.parseLeaf(control, order, partsU, partsV, scene);
};

LeafVehicle.prototype = Object.create(Leaf.prototype);
LeafVehicle.prototype.constructor = LeafVehicle;

function LeafVehicle() {
    Leaf.call(this);
};

function LeafTerrain() {
    Leaf.call(this);
};
LeafTerrain.prototype = Object.create(Leaf.prototype);
LeafTerrain.prototype.constructor = LeafTerrain;

LeafTerrain.prototype.parseLeaf = function(args, scene) {
    this.type = "terrain";
    this.element = new Terrain(scene, args[0], args[1]);
};

LeafTerrain.prototype.processArgs = function(leaf, currLeaf, scene) {
    var texture = readElement(leaf, ["texture"], 1);
    var heightmap = readElement(leaf, ["heightmap"], 1);
    this.parseLeaf([texture, heightmap], scene);
};

function LeafText() {
    Leaf.call(this);
    this.limits = 16;
};

function LeafText(scene, element, text, texture) {
    Leaf.call(this);
    this.scene = scene;
    this.element = element;
    this.text = text;
    this.limits = 16;
    this.texture = null;
};

LeafText.prototype = Object.create(Leaf.prototype);
LeafText.prototype.constructor = LeafText;

LeafText.prototype.translateId = function(id){

    //console.log(this.graph.scene.gameStats[0]);

    switch(id){
        case "whiteDisksStats":
        this.text = this.graph.scene.gameStats[0].toString();
        //console.log(this.text);
        break;
        case "whiteRingsStats":
        this.text = this.graph.scene.gameStats[1].toString();
        break;
        case "blackDisksStats":
        this.text = this.graph.scene.gameStats[2].toString();
        break;
        case "blackRingsStats":
        this.text = this.graph.scene.gameStats[3].toString();
        break;
        default:
        //do nothing
        break;
    }
}

LeafText.prototype.display = function(parentElement) {

    this.translateId(parentElement.id);

    var material = this.graph.matArray[this.graph.matArray.length - 1];
    material.setTexture(this.texture);
    material.appearance.apply();
    this.scene.setActiveShaderSimple(this.scene.textShader);

    for (var i = 0; i < this.text.length; i++) {
        this.scene.pushMatrix();
        var coords = this.findLocation(this.text.charCodeAt(i));
       // console.log(coords);
        this.scene.activeShader.setUniformsValues({
            'charCoords': coords
        });
        this.scene.translate(i, 0, 0);
        if(this.text[i] != " ")
            this.element.display();
        this.scene.popMatrix();
    }

    this.scene.setActiveShaderSimple(this.scene.defaultShader);
};

LeafText.prototype.findLocation = function(code) {

    return [code % this.limits, Math.floor(code / this.limits)];
};
LeafText.prototype.parseLeaf = function(args, scene) {
    this.scene = scene;
    this.element = new Rectangle(scene, [-0.5, 0.5, 0], [0.5, -0.5, 0]);;
    this.text = args[0];
    this.texture = new CGFtexture(scene, args[1]);
};
LeafText.prototype.processArgs = function(leaf, currLeaf, scene) {
    var value = readElement(leaf, ["value"], 1)[FIRST_ELEMENT];
    var texture = readElement(leaf, ["texture"], 1);
    this.parseLeaf([value,texture], scene);
};
LeafText.prototype.setText = function(text) {
    if (typeof text !== 'undefined' && typeof text === "string")
        this.text = text;
};
