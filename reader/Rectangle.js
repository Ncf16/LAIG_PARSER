 /**
  * Rectangle
  * @param gl {WebGLRenderingContext}
  * @constructor
  */
 function Rectangle(scene, leftTop, rightBottom) {

     CGFobject.call(this, scene);

     this.leftTop = typeof leftTop !== 'undefined' ? leftTop : [0, 1, 0];
     this.rightBottom = typeof rightBottom !== 'undefined' ? rightBottom : [1, 0, 0];

     this.S = 1;
     this.T = 1;

     //console.log(leftTop, rightBottom);
     this.initBuffers();
 };


 Rectangle.prototype = Object.create(CGFobject.prototype);
 Rectangle.prototype.constructor = Rectangle;


 Rectangle.prototype.initBuffers = function() {

     this.height = this.leftTop[1] - this.rightBottom[1];
     this.width = this.rightBottom[0] - this.leftTop[0];
     var leftBottom = [this.leftTop[0], this.leftTop[1] - this.height, 0];
     var topRight = [this.rightBottom[0], this.rightBottom[1] + this.height, 0];

     this.vertices = [
         this.leftTop[0], this.rightBottom[1], 0,
         this.rightBottom[0], this.rightBottom[1], 0,
         this.leftTop[0], this.leftTop[1], 0,
         this.rightBottom[0], this.leftTop[1], 0

     ];

     //console.log(this.vertices);
     this.indices = [
         0, 1, 2,
         3, 2, 1
     ];



     var P1_P2 = [this.leftTop[0] - topRight[0], this.leftTop[1] - topRight[1], this.leftTop[2] - topRight[2]];
     var P2_P3 = [leftBottom[0] - topRight[0], leftBottom[1] - topRight[1], leftBottom[2] - topRight[2]];

     var normal = crossProduct(P1_P2, P2_P3);

     this.normals = [
         normal[0], normal[1], normal[2],
         normal[0], normal[1], normal[2],
         normal[0], normal[1], normal[2],
         normal[0], normal[1], normal[2]
     ];

     this.updateTexCoords();
     this.primitiveType = this.scene.gl.TRIANGLES;
     this.initGLBuffers();
 };

 Rectangle.prototype.setAmplif = function(amplifS, amplifT) {
     this.S = amplifS;
     this.T = amplifT;
     this.updateTexCoords();
 };
 Rectangle.prototype.updateTexCoords = function() {
     this.texCoords = [
         0.0, this.height / this.T,
         this.width / this.S, this.height / this.T,
         0.0, 0.0,
         this.width / this.S, 0.0
     ];
     this.updateTexCoordsGLBuffers();
 };