/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Triangle(scene, point1, point2, point3) {
	CGFobject.call(this, scene);

	this.point1 = typeof point1 !== 'undefined' ? point1 : [0, 0, 0];
	this.point2 = typeof point2 !== 'undefined' ? point2 : [1, 1, 1];
	this.point3 = typeof point3 !== 'undefined' ? point3 : [0, 1, 0];

	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
	this.vertices = [
		this.point1[0], this.point1[1], this.point1[2],
		this.point2[0], this.point2[1], this.point2[2],
		this.point3[0], this.point3[1], this.point3[2]
	];

	var P1_P2 = [this.point1[0] - this.point2[0], this.point1[1] - this.point2[1], this.point1[2] - this.point2[2]];
	var P2_P3 = [this.point2[0] - this.point3[0], this.point2[1] - this.point3[1], this.point2[2] - this.point3[2]];

	var normal = crossProduct(P1_P2, P2_P3);

	this.indices = [
		0, 1, 2
	];
	this.normals = [
		normal[0], normal[1], normal[2],
		normal[0], normal[1], normal[2],
		normal[0], normal[1], normal[2]
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};