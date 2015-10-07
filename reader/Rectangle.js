/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
//é para criar stuff já com as text coords??
function Rectangle(scene, topLeft, rightBottom, minS, maxS, minT, maxT) {

    CGFobject.call(this, scene);

    this.topLeft = typeof topLeft !== 'undefined' ? topLeft : [0, 0, 0];
    this.rightBottom = typeof rightBottom !== 'undefined' ? rightBottom : [0, 1, 0];
    this.minS = typeof minS !== 'undefined' ? minS : 0;
    this.maxS = typeof maxS !== 'undefined' ? maxS : 1;
    this.minT = typeof minT !== 'undefined' ? minT : 0;
    this.maxT = typeof maxT !== 'undefined' ? maxT : 1;


    this.initBuffers();
};


Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;


Rectangle.prototype.initBuffers = function() {


    var height;
    var width;
    height = this.topLeft[1] - this.rightBottom[1];
    width = this.rightBottom[0] - this.topLeft[0];
    var leftBottom = [this.topLeft[0], this.topLeft[1] - height, 0];
    var topRight = [this.rightBottom[0], this.rightBottom[1] + height, 0];
    this.texCoords = [];

    this.vertices = [
        this.topLeft[0], this.topLeft[1], 0,
        leftBottom[0], leftBottom[1], 0,
        this.rightBottom[0], this.rightBottom[1], 0,
        topRight[0], topRight[1], 0
    ];

    this.indices = [
        0, 1, 2,
        2, 3, 0
    ];

    var P1_P2 = [this.topLeft[0] - topRight[0], this.topLeft[1] - topRight[1], this.topLeft[2] - topRight[2]];
    var P2_P3 = [leftBottom[0] - topRight[0], leftBottom[1] - topRight[1], leftBottom[2] - topRight[2]];

    var normal = crossProduct(P1_P2, P2_P3);

    this.normals = [
        normal[0], normal[1], normal[2],
        normal[0], normal[1], normal[2],
        normal[0], normal[1], normal[2],
        normal[0], normal[1], normal[2]
    ];

    /*   var deltaS = (this.maxS - this.minS) / width;
       var deltaT = (this.maxT - this.minT) / height;
       for (var i = this.minS; i < this.maxS; i += deltaS) {
           for (var j = this.minT; j < this.maxT; j += deltaT) {
               this.texCoords.push(i, j);

           }
       }*/
    console.log(this.minS, this.maxS, this.minT, this.maxT);
    this.texCoords = [
        this.minS, this.minT,
        this.minS, this.maxT,
        this.minT, this.maxT,
        this.maxS, this.maxT
    ];


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};