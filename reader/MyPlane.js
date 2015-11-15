function MyPlane(scene, uDivs, vDivs) {
	CGFobject.call(this, scene);

	this.uDivs = uDivs || 20;
	this.vDivs = vDivs || 20;

	this.initBuffers();
};

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.initBuffers = function() {
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var controlPoints = [
		[
			[-0.5, 0.0, -0.5, 1],
			[-0.5, 0.0, 0.5, 1],
		],
		[
			[0.5, 0.0, -0.5, 1],
			[0.5, 0.0, 0.5, 1],
		],
	];

	var nurbsSurface = new CGFnurbsSurface(1, 1, [0, 0, 1, 1], [0, 0, 1, 1], controlPoints);

	for (var u = 0; u <= this.uDivs; u++) {
		var uu = u / this.uDivs;
		for (var v = 0; v <= this.vDivs; v++) {
			var vv = v / this.vDivs;

			var point = nurbsSurface.getPoint(uu, vv);

			this.vertices.push(point[0], point[1], point[2]);
			this.normals.push(0, 1, 0);
			this.texCoords.push(uu,  vv);

			if (u < this.uDivs && v < this.vDivs) {
				this.indices.push(v + u * (this.vDivs + 1));
				this.indices.push(v + 1 + u * (this.vDivs + 1));
				this.indices.push(v + this.vDivs + 1 + u * (this.vDivs + 1));

				this.indices.push(v + 1 + u * (this.vDivs + 1));
				this.indices.push(v + this.vDivs + 2 + u * (this.vDivs + 1));
				this.indices.push(v + this.vDivs + 1 + u * (this.vDivs + 1));
			}
		}
	}


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyPlane.prototype.updateTexCoords = function(ampS, ampT) {
	// Nothing to do here
}

MyPlane.prototype.calcTexCoords = function(ampS, ampT) {
	// Nothing to do here
}

MyPlane.prototype.setMode = function(mode) {
	if (!mode) {
		this.obj.indices = this.obj.indicesTris;
		this.obj.primitiveType = this.obj.scene.gl.TRIANGLES;
	} else {
		this.obj.indices = this.obj.indicesLines;
		this.obj.primitiveType = this.obj.scene.gl.LINES;
	}
}