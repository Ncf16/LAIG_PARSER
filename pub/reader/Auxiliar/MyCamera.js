function MyCamera(fov, near, far, position, target) {
    CGFcamera.call(this, fov, near, far, position, target);
    console.log(this.position);

    this.zoomValue = 1;
    this.calcRadius();
    this.calcAngles();
    this.updateZeros();
    this.updatePos();
    console.log(this.radius, this.theta, this.phi, this.position);

};
MyCamera.prototype = Object.create(CGFcamera.prototype);
MyCamera.prototype.constructor = MyCamera;

MyCamera.prototype.setTheta = function(angle) {
    this.theta = angle;
};
MyCamera.prototype.setPhi = function(angle) {
    this.phi = angle;
};
MyCamera.prototype.setRadius = function(radius) {
    this.radius = radius;
};
MyCamera.prototype.updateZeros = function() {
    // console.log("updateZeros");
    this.thetaZero = this.theta;
    this.phiZero = this.phi;
    this.radiusZero = this.radius;
};

MyCamera.prototype.orbit = function(a, b) {
    //prevent changing 2 Q (isto é não pode haver mudanças de sinal em + que 1 das coordenadas)
    var c = vec4.sub(vec4.create(), this.position, this.target);
    c[3] = 0;
    var d;
    var e;

    if (a == CGFcameraAxisID.X) {
        d = vec3.cross(vec3.create(), c, this._up);
        var f = mat4.rotate(mat4.create(), mat4.create(), b, d);
        e = vec4.transformMat4(vec4.create(), c, f);
    } else {
        d = this._up;

        e = vec4.transformMat4(vec4.create(), c, mat4.rotate(mat4.create(), mat4.create(), b, d));


    }
    if (!check2Qchange(c, e)) {
        vec4.add(this.position, this.target, e);
        this.direction = this.calculateDirection();
    }
};

function check2Qchange(vec1, vec2) {
    if (signalChange(vec1[0], vec2[0]) && (signalChange(vec1[1], vec2[1]) || signalChange(vec1[2], vec2[2])))
        return true;
    else
    if (signalChange(vec1[1], vec2[1]) && (signalChange(vec2[0], vec1[0]) || signalChange(vec1[2], vec2[2])))
        return true;
    else
    if (signalChange(vec1[2], vec2[2]) && (signalChange(vec1[1], vec2[1]) || signalChange(vec1[0], vec2[0])))
        return true;

    return false;
};

function signalChange(ele1, ele2) {
    return ((ele1 > 0 && ele2 < 0) || (ele1 < 0 && ele2 > 0));
};

MyCamera.prototype.updatePos = function() {
    var newPos = [this.radius * Math.cos(this.theta) * Math.sin(this.phi),
        this.radius * Math.cos(this.phi),
        this.radius * Math.sin(this.theta) * Math.sin(this.phi), 0
    ]
    this.setPosition(newPos);
};

MyCamera.prototype.calcAngles = function() {
    //y/r 
    this.phi = Math.acos(this.position[1] / this.radius);
    //z/x
    this.theta = Math.atan2(this.position[2], this.position[0]);
};
MyCamera.prototype.calcRadius = function() {
    this.radius = this.zoomValue * distanceBetweenVectors(this.position, [0, 0, 0, 0]);
};
