function Transformation(scene) {
    this.matrix = mat4.create();
    mat4.identity(this.matrix);
    this.scene = scene;
};

Transformation.prototype.setMatrix = function(newMatrix) {
    this.matrix = newMatrix;
};
Transformation.prototype.reset = function() {
    mat4.identity(this.matrix);
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

Transformation.prototype.parseTranslate = function(currElement) {
    var translation = stringArrayToNumber(readElement([currElement], ["x", "y", "z"], 1), "translation", "inf", "inf", 1);
    this.doTranslate(vec3.fromValues(translation[0], translation[1], translation[2]));
};
Transformation.prototype.doTranslate = function(translation) {
    mat4.translate(this.matrix, this.matrix, translation);
};
Transformation.prototype.doScale = function(scale) {
    mat4.scale(this.matrix, this.matrix, scale);
};
Transformation.prototype.doRotate = function(angle, axis) {
    if (axis == "X" || axis == "x") {
        axis = [1, 0, 0];
    }
    if (axis == "Y" || axis == "y") {
        axis = [0, 1, 0];
    }
    if (axis == "Z" || axis == "z") {
        axis = [0, 0, 1];
    }
    
    mat4.rotate(this.matrix, this.matrix, angle, axis);
};
Transformation.prototype.parseScale = function(currElement) {
    var scale = stringArrayToNumber(readElement([currElement], ["sx", "sy", "sz"], 1), "scaleFactor", "inf", "inf", 1);
    this.doScale(vec3.fromValues(scale[0], scale[1], scale[2]));
};

Transformation.prototype.parseRotate = function(currElement) {
    var rot = readElement([currElement], ["axis", "angle"], 1);
    // console.log("ROTATE: ",rot[1]  );
    switch (rot[0]) {
        case "x":
        case "X":
            {
                AxisX = true;
                mat4.rotateX(this.matrix, this.matrix, degToRad(rot[1]));
                break;
            }
        case "y":
        case "Y":
            {
                AxisY = true;
                mat4.rotateY(this.matrix, this.matrix, degToRad(rot[1]));
                break;
            }
        case "z":
        case "Z":
            {
                AxisZ = true;
                mat4.rotateZ(this.matrix, this.matrix, degToRad(rot[1]));
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

Transformation.prototype.apply = function() {
    this.scene.multMatrix(this.matrix);
};
