function Transformation(scene) {
    this.matrix = mat4.create();
    this.scene = scene;
};
Transformation.prototype.parseTransformation = function(currElement, type) {
    switch (type) {
        case TRANSLATE:
            this.parseTranslate(currElement);
            break;
        case ROTATE:
            this.parseRotate(currElement);
            break;
        case SCALE:
            this.parseScale(currElement);
            break;
    }


};
Transformation.prototype.setMatrix = function(newMatrix) {
    this.matrix = newMatrix;
};
Transformation.prototype.parseTranslate = function(currElement) {
    var translation = stringArrayToNumber(readElement([currElement], ["x", "y", "z"], 1), "translation", "inf", "inf", 1);
    mat4.translate(this.matrix, this.matrix, vec3.fromValues(translation[0], translation[1], translation[2]));
};

Transformation.prototype.parseScale = function(currElement) {

   
    var scale = stringArrayToNumber(readElement([currElement], ["sx", "sy", "sz"], 1), "scaleFactor", "inf", "inf", 1);
    mat4.scale(this.matrix, this.matrix, vec3.fromValues(scale[0], scale[1], scale[2]));
};



Transformation.prototype.parseRotate = function(currElement) {

    var rot = readElement([currElement], ["axis", "angle"], 1);
  // console.log("ROTATE: ",rot[1]  );
    switch (rot[0]) {
        case "x":
            {
 
                AxisX = true;  
                mat4.rotateX(this.matrix,  this.matrix, degToRad(rot[1]) );
              
                break;
            }
        case "y":
            { 
             
                AxisY = true;
 
                mat4.rotateY(this.matrix, this.matrix, degToRad(rot[1])) ;
                break;
            }
        case "z":
            {   
                AxisZ = true;
    
                mat4.rotateZ(this.matrix, this.matrix,  degToRad(rot[1])) ;
                break;
            }
        default:
            console.warn("Invalid Axis in Rotation: " + rot);
    }
};
Transformation.prototype.printMatrix = function() {
    console.log(mat4.str(this.matrix));
}
Transformation.prototype.reset = function() {
    this.matrix = mat4.create();
};
Transformation.prototype.addMatrix = function(toMultiplyMatrix) {
    mat4.multiply(this.matrix, this.matrix, toMultiplyMatrix);
};

Transformation.prototype.useTransformation = function() {
    this.scene.multMatrix(this.matrix);
};