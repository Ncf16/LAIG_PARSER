function Animation(scene) {
    CGFobject.call(this, scene);
    this.deltaT = 0;
    this.type = "";
};
//Do getters and setters
Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.setDeltaT = function(newDeltaT) {
    if (!isNaN(newDeltaT))
        this.deltaT = newDeltaT;
    else
        this.deltaT = 0;
};

function LinearAnimation(scene) {
    Animation.call(this, scene);
    this.controlPoints = [
        [0, 0, 0]
    ];
};
LinearAnimation.prototype.setControlPoints = function(controlPoints) {};

function CircularAnimation(scene) {
    Animation.call(this, scene);
    this.center = [0, 0, 0];
    this.radius = 1;
    this.rotationAngle = 0;
    this.startAngle = 0;
};

CircularAnimation.prototype.setCenter = function(center) {

};
CircularAnimation.prototype.setStartAngle = function(startAng) {
    var tempStartAng = Number(startAng);
    
    if (!isNaN(tempStartAng))
        this.startAng = degToRad(tempStartAng);
    else
        this.startAng = 0;
};
CircularAnimation.prototype.setRotateAngle = function(rotAng) {
    var tempRotArg = Number(rotAng);

    if (!isNaN(tempRotAng))
        this.rotAng = degToRad(tempRotAng);
    else
        this.rotAng = 0;
};
CircularAnimation.prototype.setRadius = function(radius) {
    var tempRadius = Number(radius);
    if (!isNaN(tempRadius))
        this.radius = tempRadius;
    else
        this.radius = 0;
};