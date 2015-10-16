/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Triangle(scene, point1, point2, point3) {
	CGFobject.call(this, scene);
 
	 this.point1 = typeof point1 !== 'undefined' ? point1 : [0, 0, 1];

 	this.point2 = typeof point2 !== 'undefined' ? point2 : [1, 0, 0];

 	this.point3 = typeof point3 !== 'undefined' ? point3 : [0, 1, 0];


	this.S = 1;
	this.T = 1;


	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
	this.vertices = [];

	this.vertices.push(this.point1[0], this.point1[1], this.point1[2]);
	this.vertices.push(this.point2[0], this.point2[1], this.point2[2]);
	this.vertices.push(this.point3[0], this.point3[1], this.point3[2]);

	this.P1_P2 = [this.point2[0] - this.point1[0], this.point2[1] - this.point1[1], this.point2[2] - this.point1[2]];
	this.P2_P3 = [this.point3[0] - this.point2[0], this.point3[1] - this.point2[1], this.point3[2] - this.point2[2]];
	this.P1_P3 = [this.point3[0] - this.point1[0], this.point3[1] - this.point1[1], this.point3[2] - this.point1[2]];
	var normal = crossProduct(this.P2_P3, this.P1_P2);
	normalVector(normal);


	this.indices = [
		0, 1, 2
	];

	this.normals = [
		normal[0], normal[1], normal[2],
		normal[0], normal[1], normal[2],
		normal[0], normal[1], normal[2]
	];

	this.d1_d2 = Math.sqrt(scalarProduct(this.P1_P2, this.P1_P2));
	this.d1_d3 = Math.sqrt(scalarProduct(this.P1_P3, this.P1_P3));
	this.d2_d3 = Math.sqrt(scalarProduct(this.P2_P3, this.P2_P3));
	this.updateTexCoords();

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};


Triangle.prototype.setAmplif = function(amplifS, amplifT) {

	this.S = amplifS;
	this.T = amplifT;
	this.updateTexCoords();
};
Triangle.prototype.updateTexCoords = function() {
	this.texCoords = [];

	var beta = Math.acos(Math.abs(scalarProduct(this.P1_P2, this.P2_P3)) / (this.d1_d2 * this.d2_d3));
	this.texCoords.push(0, 0);
	if (this.S == this.d1_d2) {
		this.texCoords.push(1, 0);
	} else {
		this.texCoords.push(this.d1_d2 / this.S, 0);
	}

	if (this.T == this.d1_d3) {
		this.texCoords.push(0, 1);
	} else {
		this.texCoords.push((this.d1_d2 - this.d2_d3 * Math.cos(beta)) / this.S, this.d1_d2 * Math.sin(beta));
	}
	this.updateTexCoordsGLBuffers();
};