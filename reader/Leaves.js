function Leaf() {
	this.element = null;
	this.id;
	this.type;
	this.args = [];
};

Leaf.prototype.setID = function(newID) {
	this.id = newID;
};
Leaf.prototype.getID = function() {
	return this.id;
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
Leaf.prototype.parseLeaf = function(args, scene) {};

//
//
LeafRectangle.prototype = new Leaf();
LeafRectangle.prototype.constructor = LeafRectangle;

function LeafRectangle() {

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
//
//
LeafTriangle.prototype = new Leaf();
LeafTriangle.prototype.constructor = LeafTriangle;

function LeafTriangle() {

}

LeafTriangle.prototype.parseLeaf = function(args, scene) {
	this.type = "Triangle";
	var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
	var tempIndex = tempArgs.indexOf("inf");
	if (tempIndex != -1) {
		console.error("Invalid paramenter in the creation of a triangle ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
	} else {
		this.element = new Triangle(scene, [args[0], args[1], args[2]], [args[4], args[5], args[6]], [args[7], args[8], args[9]]);

	}
};
//
//
LeafCylinder.prototype = new Leaf();
LeafCylinder.prototype.constructor = LeafCylinder;

function LeafCylinder() {

}

LeafCylinder.prototype.parseLeaf = function(args, scene) {
	this.type = "Cylinder";
	var tempArgs = stringArrayToNumber(args, "ff", "inf", "inf", 1);
	var tempIndex = tempArgs.indexOf("inf");
	if (tempIndex != -1) {
		console.error("Invalid paramenter in the creation of a cylinder ( " + tempArgs[tempIndex] + " ), this leaf will be ignored")
	} else {

	}
};

//
//
LeafSphere.prototype = new Leaf();
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

	}
};