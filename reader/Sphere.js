/**
 * myLamp
 * @constructor
 *TODO SUBSTITUIT MIN
 */
function Sphere(scene, slices, stacks, radius, minS, maxS, minT, maxT) {
	CGFobject.call(this, scene)

	this.minS = typeof minS !== 'undefined' ? minS : 0;
	this.maxS = typeof maxS !== 'undefined' ? maxS : 1;
	this.minT = typeof minT !== 'undefined' ? minT : 0;
	this.maxT = typeof maxT !== 'undefined' ? maxT : 1;

	this.slices = typeof slices !== 'undefined' ? slices : 8;
	this.stacks = typeof stacks !== 'undefined' ? stacks : 20;
	this.radius = typeof radius !== 'undefined' ? radius : 1;


	this.initBuffers();
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {
	var deg2rad = Math.PI / 180;
	var alfa = deg2rad * 360 / this.slices;


	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var k = 0;
	var beta = (180 * deg2rad) / this.stacks;

	for (var h = 0; h < this.slices; h++) {
		k++;
		this.vertices.push(0, this.radius, 0);
		this.normals.push(0, 1, 0);
		this.texCoords.push(h * (1 / this.slices), 0);
		this.indices.push(h, this.slices + 2 * h, this.slices + 2 * h + 2);
	}

	var j = 0;
	for (var j = 0; j < this.stacks - 1; j++) {
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push(this.radius * Math.sin(alfa * i) * Math.sin(beta + beta * j), this.radius * Math.cos(beta + beta * j), this.radius * Math.cos(alfa * i) * Math.sin(beta + beta * j));
			this.vertices.push(this.radius * Math.sin(alfa * i) * Math.sin(beta + beta * (j + 1)), this.radius * Math.cos(beta + beta * (j + 1)), this.radius * Math.cos(alfa * i) * Math.sin(beta + beta * (j + 1)));


			this.texCoords.push((i) * (1 / this.slices), (j + 1) * (1 / this.stacks));
			this.texCoords.push((i) * (1 / this.slices), (j + 2) * (1 / this.stacks));

			this.indices.push(k + 0);
			this.indices.push(k + 1);
			this.indices.push(k + 2);



			this.indices.push(k + 3);
			this.indices.push(k + 2);
			this.indices.push(k + 1);


			this.normals.push(Math.sin(alfa * i) * Math.sin(beta + beta * j), Math.cos(beta + beta * j), Math.cos(alfa * i) * Math.sin(beta + beta * j));
			this.normals.push(Math.sin(alfa * i) * Math.sin(beta + beta * (j + 1)), Math.cos(beta + beta * (j + 1)), Math.cos(alfa * i) * Math.sin(beta + beta * (j + 1)));


			k += 2;
		}
		k += 2;

		var i = 0;
		this.vertices.push(this.radius * Math.sin(alfa * i) * Math.sin(beta + beta * j), this.radius * Math.cos(beta + beta * j), this.radius * Math.cos(alfa * i) * Math.sin(beta + beta * j));
		this.vertices.push(this.radius * Math.sin(alfa * i) * Math.sin(beta + beta * (j + 1)), this.radius * Math.cos(beta + beta * (j + 1)), this.radius * Math.cos(alfa * i) * Math.sin(beta + beta * (j + 1)));
		this.texCoords.push(1, (j + 1) * (1 / this.stacks));
		this.texCoords.push(1, (j + 2) * (1 / this.stacks));
		this.normals.push(Math.sin(alfa * i) * Math.sin(beta + beta * j), Math.cos(beta + beta * j), Math.cos(alfa * i) * Math.sin(beta + beta * j));
		this.normals.push(Math.sin(alfa * i) * Math.sin(beta + beta * (j + 1)), Math.cos(beta + beta * (j + 1)), Math.cos(alfa * i) * Math.sin(beta + beta * (j + 1)));
	}
 
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};