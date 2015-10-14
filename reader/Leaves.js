function Leaf(graph) {
	this.element = null;
	this.ID;
	this.type;
	this.graph = graph;
	this.args = [];
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

Leaf.prototype.display = function(parentElement) {
	//console.log("LEAF DISPLAY");
	var grafo = parentElement.graph;
	var material = grafo.matArray[grafo.matArray.length - 1];
	var textura = grafo.texArray[grafo.texArray.length - 1];
	//console.log("MATERIAL", material, grafo.matArray);
	//console.log(textura);

	//material.setTexture(textura);
	//material.apply();
//	console.log(this.element);
	this.element.display();
};

LeafRectangle.prototype = Object.create(Leaf.prototype);
LeafRectangle.prototype.constructor = LeafRectangle;

function LeafRectangle() {
	Leaf.call(this);
}
LeafRectangle.prototype.parseLeaf = function(args, scene) {
	this.type = "Rectangle";
	console.log(args);
	var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
	var tempIndex = tempArgs.indexOf("inf");
	if (tempIndex != -1) {
		console.error("Invalid paramenter in the creation of a rectangle ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
	} else {
		console.log(tempIndex);
		this.element = new Rectangle(scene, [args[0], args[1], 0], [args[2], args[3], 0]);
	}
};
 
//
//
LeafTriangle.prototype = Object.create(Leaf.prototype);
LeafTriangle.prototype.constructor = LeafTriangle;

function LeafTriangle() {
	Leaf.call(this);
}

LeafTriangle.prototype.parseLeaf = function(args, scene) {
	this.type = "Triangle";

	var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
	var tempIndex = tempArgs.indexOf("inf");
	if (tempIndex != -1) {
		console.error("Invalid paramenter in the creation of a triangle ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
	} else {


		this.element = new Triangle(scene, [args[0], args[1], args[2]], [args[4], args[5], args[6]], [args[8], args[9], args[10]]);

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