function Animation() {
    CGFobject.call(this, scene);
    this.deltaT = 0;
};

Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;


function LinearAnimation() {
    Animation.call(this);
    this.controlPoints = [
        [0, 0, 0]
    ];
};

function CircularAnimation() {
    Animation.call(this);
    this.center = [0, 0, 0];
    this.radius = 1;
    this.rotationAngle = 0;

};

