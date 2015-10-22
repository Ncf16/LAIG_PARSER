function Animation(scene) {
    CGFobject.call(this, scene);
    this.deltaT = 0;
    this.type = "";
};

Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;


function LinearAnimation(scene) {
    Animation.call(this, scene);
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