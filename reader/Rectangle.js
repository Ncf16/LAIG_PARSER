//
function Rectangle(scene, leftTop, rightBottom) {

     CGFobject.call(this, scene);

     //set the default values if undefined or the ones passed as argument
     this.leftTop = typeof leftTop !== 'undefined' ? leftTop : [0, 1, 0];
     this.rightBottom = typeof rightBottom !== 'undefined' ? rightBottom : [1, 0, 0];

     //texture
     this.S = 1;
     this.T = 1;

     this.initBuffers();
 };


 Rectangle.prototype = Object.create(CGFobject.prototype);
 Rectangle.prototype.constructor = Rectangle;


 Rectangle.prototype.initBuffers = function() {

    //calculate the height and distance given the points
     this.height = this.leftTop[1] - this.rightBottom[1];
     this.width = this.rightBottom[0] - this.leftTop[0];

     //calculate the others two points from rectangle
     var leftBottom = [this.leftTop[0], this.leftTop[1] - this.height, 0];
     var topRight = [this.rightBottom[0], this.rightBottom[1] + this.height, 0];

     //set the position from vertices
     this.vertices = [
         this.leftTop[0], this.rightBottom[1], 0,  //left Bottom
         this.rightBottom[0], this.rightBottom[1], 0, //right Bottom
         this.leftTop[0], this.leftTop[1], 0, //left Top
         this.rightBottom[0], this.leftTop[1], 0 //right Top

     ];

   
     this.indices = [
         0, 1, 2, //left Bottom -> right Bottom -> left Top
         3, 2, 1 //right Top -> left Top -> right Bottom
     ];

    
    //distance between points
     var P1_P2 = [this.leftTop[0] - topRight[0], this.leftTop[1] - topRight[1], this.leftTop[2] - topRight[2]];
     var P2_P3 = [leftBottom[0] - topRight[0], leftBottom[1] - topRight[1], leftBottom[2] - topRight[2]];

     //calculate the normals from cross Product
     var normal = crossProduct(P2_P3,P1_P2  );
        normalVector(normal);
     
    //set the previously calculated normals
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

//set the amplification factor and update text coords
 Rectangle.prototype.setAmplif = function(amplifS, amplifT) {
     this.S = amplifS;
     this.T = amplifT;
     this.updateTexCoords();
 };

 //update Text Coords
 Rectangle.prototype.updateTexCoords = function() {
     this.texCoords = [
         0.0, this.height / this.T,
         this.width / this.S, this.height / this.T,
         0.0, 0.0,
         this.width / this.S, 0.0
     ];
     this.updateTexCoordsGLBuffers();
 };