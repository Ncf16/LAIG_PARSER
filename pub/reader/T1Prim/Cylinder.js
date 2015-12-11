function Cylinder(scene, height, bottom_radius, top_radius, sections_per_height, parts_per_section) {
	CGFobject.call(this, scene);

	this.height = typeof height !== 'undefined' ? height : 1;
	this.bottom_radius = typeof bottom_radius !== 'undefined' ? bottom_radius : 1;
	this.top_radius = typeof top_radius !== 'undefined' ? top_radius : 1;
	this.sections_per_height = typeof sections_per_height !== 'undefined' ? sections_per_height : 8;
	this.parts_per_section = typeof parts_per_section !== 'undefined' ? parts_per_section : 20;

	this.S = 1;
	this.T = 1;
	this.initBuffers();
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	this.angle = (2 * Math.PI) / this.parts_per_section;
	this.deltaY = this.height / this.sections_per_height;
	this.deltaRadius = (this.top_radius - this.bottom_radius) / this.sections_per_height;

	for (var stack = 0; stack <= this.sections_per_height; stack++) {

		var jump = (this.parts_per_section + 1) * stack;
		var radius = this.bottom_radius + this.deltaRadius * stack;

		for (var slice = 0; slice <= this.parts_per_section; slice++) {
			var currentX = radius * Math.cos(this.angle * slice);
			var currentY = radius * Math.sin(this.angle * slice);
			var currentZ = stack * this.deltaY;

			var radius2 = this.bottom_radius + this.deltaRadius * (stack + 1);
			var x1 = radius2 * Math.cos(this.angle * slice);
			var y1 = radius2 * Math.sin(this.angle * slice);
			var z1 = (stack + 1) * this.deltaY;

			this.vertices.push(currentX, currentY, currentZ);
			if (this.sections_per_height != stack && this.parts_per_section != slice) {
				this.indices.push(slice + jump);
				this.indices.push(slice + jump + 1);
				this.indices.push(slice + jump + this.parts_per_section + 1);

				this.indices.push(slice + jump + 1)
				this.indices.push(slice + jump + this.parts_per_section + 2);
				this.indices.push(slice + jump + this.parts_per_section + 1);

			}
			var point = [0, 0, 0];
			var vec1 = [x1 - currentX, y1 - currentY, z1 - currentZ];
			var vec = [point[0] - currentX, point[1] - currentY, point[2] - currentZ];

			//TODO CHECK THIS CHANGED VEC AND TEMPNORMAL ORDER
			var tempNormal = crossProduct(vec, vec1);
			var normal = crossProduct(vec,tempNormal);
			normalVector(normal);
			this.normals.push(normal[0], normal[1], normal[2]);
		}
	}
	this.updateTexCoords();
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};


Cylinder.prototype.setAmplif = function(amplifS, amplifT) {
	this.S = amplifS;
	this.T = amplifT;
	this.updateTexCoords();
};
Cylinder.prototype.updateTexCoords = function() {
	this.texCoords = [];

	for (var stack = 0; stack <= this.sections_per_height; stack++) {
		var jump = (this.parts_per_section + 1) * stack;
		var radius = this.bottom_radius + this.deltaRadius * stack;
		for (var slice = 0; slice <= this.parts_per_section; slice++) {
			this.texCoords.push(this.angle * slice, stack * this.deltaY);
		}
	}
	this.updateTexCoordsGLBuffers();
};