function Leaf(graph) {
    this.element = null;
    this.ID;
    this.type;
    this.graph = graph;
    this.args = [];
    this.stillChecking = true;
    //debug
    this.repeat = 0;
};

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


Leaf.prototype.display = function(parentElement) {

    var material = this.graph.matArray[this.graph.matArray.length - 1];
    var texture = this.graph.texArray[this.graph.texArray.length - 1];

    if (typeof texture !== 'undefined') {
        if (texture.id != "clear")
            material.setTexture(texture.cgf);
    }

    material.appearance.apply();
    this.element.display();
};

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
    if(typeof texture !== 'undefined'){
        this.element.setAmplif(texture.amplif_factor['s'], texture.amplif_factor['t']);

    if (texture.id != "clear")
        material.setTexture(texture.cgf);
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
    if(typeof texture !== 'undefined'){
        this.element.setAmplif(texture.amplif_factor['s'], texture.amplif_factor['t']);

    if (texture.id != "clear")
        material.setTexture(texture.cgf);
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
        //todo ver argumentos
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
        console.error("Invalid paramenter in the creation of a sphere ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
    } else {
        this.element = new Sphere(scene, args[2], args[1], args[0]);
    }
};