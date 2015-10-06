/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
//é para criar stuff já com as text coords??
function Rectangle(scene, topLeft, rightBottom) {

    CGFobject.call(this, scene);

    this.topLeft = typeof topLeft !== 'undefined' ? topLeft : [0, 0, 0];
    this.rightBottom = typeof rightBottom !== 'undefined' ? rightBottom : [0, 1, 0];
    console.log(topLeft, rightBottom);
    this.initBuffers();
};


Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;


Rectangle.prototype.initBuffers = function() {

    var height;
    var width;
    height = this.topLeft[1] - this.rightBottom[1];
    width = this.rightBottom[0] - this.topLeft[0];

    var leftBottom = [this.topLeft[0], this.topLeft[1] - height];
    var topRight = [this.rightBottom[0], this.rightBottom[1] + height];


    this.vertices = [
        this.topLeft[0], this.topLeft[1], 0,
        leftBottom[0], leftBottom[1], 0,
        this.rightBottom[0], this.rightBottom[1], 0,
        topRight[0], topRight[1], 0
    ];

    this.indices = [
        0, 1, 2,
        2, 3, 0,
        0, 3, 2,
        2, 1, 0
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};