function MyCamera(fov, near, far, position, target) {
    CGFcamera.call(this, fov, near, far, position, target);
    this.zoomValue = 1;
    this.radius = this.zoomValue * distanceBetweenVectors(position, [0, 0, 0]);
    this.fi = Math.acos(position[2] / this.radius); //angleBetweenVectors([position[0], position[1]], [0, 1]);
    this.teta = Math.atan(position[1] / position[0]); //angleBetweenVectors([position[2], position[1]], [1, 0]);
    console.log("X", this.radius * Math.sin(this.teta) * Math.sin(this.fi));
    console.log("Y", this.radius * Math.cos(this.fi));
    console.log("Z", this.radius * Math.cos(this.teta) * Math.sin(this.fi));
    console.log(this);
};
MyCamera.prototype = Object.create(CGFcamera.prototype);
MyCamera.prototype.constructor = MyCamera;
MyCamera.prototype.setTeta = function(angle) {
    this.teta = truncRadian(angle);
};
MyCamera.prototype.addTeta = function(angle) {
    this.teta += angle;
    this.teta = truncRadian(this.teta);
};
MyCamera.prototype.addFi = function(angle) {
    this.fi += angle;
    if (this.fi >= Math.PI)
        this.fi = Math.PI;
    else
    if (this.fi <= 0)
        this.fi = 0;
};

MyCamera.prototype.updatePos = function() {
    this.setPosition([this.radius * Math.sin(this.teta) * Math.sin(this.fi),
        this.radius * Math.cos(this.fi),
        this.radius * Math.cos(this.teta) * Math.sin(this.fi), 0
    ]);
};

MyCamera.prototype.calcAngles = function(pos) {

    if (typeof pos === 'undefined') {
        position = this.position;
    } else {
        position = pos;
    }

    this.radius = distanceBetweenVectors(position, [0, 0, 0]);
    //Angle between the Y axis and the (X,Y) componentes of the position
    this.teta = angleBetweenVectors([position[0], position[1]], [0, 1]);

};
MyCamera.prototype.calcRadius = function(pos) {
    if (typeof pos === 'undefined') {
        position = this.position;
    } else {
        position = pos;
    }

    this.radius = this.zoomValue * distanceBetweenVectors(position, [0, 0, 0]);
};
