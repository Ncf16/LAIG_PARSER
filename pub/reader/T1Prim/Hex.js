function Hex(scene) {
    CGFobject.call(this, scene);

    this.sides = 6;

    this.minS = 0;
    this.minT = 0;
    this.maxS = 1;
    this.maxT = 1;

    this.initBuffers();
};

Hex.prototype = Object.create(CGFobject.prototype);
Hex.prototype.constructor = Hex;

Hex.prototype.initBuffers = function() {

    var angle = (2 * Math.PI) / this.sides;

    var centroX = (this.maxS + this.minS) / 2;
    var centroY = (this.maxT + this.minT) / 2;

    var raioX = this.maxS - centroX;
    var raioY = this.maxT - centroY;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    //bases

    for (var i = 0; i <= this.sides; i++) {

        var ang = i * angle;
        this.vertices.push(Math.cos(ang), 0, Math.sin(ang));
        this.normals.push(0, 1, 0);

        this.texCoords.push(centroX + raioX * Math.cos(ang), this.maxT - centroY - raioY * Math.sin(ang));
    }

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 1, 0);
    this.texCoords.push(0.5, 0.5);

    size = (this.sides + 1);

    for (var i = 0; i < this.sides; i++)
        this.indices.push(size, i+1, i);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};