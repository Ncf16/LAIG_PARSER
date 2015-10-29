function Animation(scene) {
    CGFobject.call(this, scene);
    this.deltaT = 0;
    this.type = "";
    this.initialSpeed = 0;
    this.startingTime = 0;
    this.totalDistance = 0;
};
//Do getters and setters
//Create functions to do animations, either create a general function or do necessary changes in the lsx
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
LinearAnimation.prototype.setControlPoints = function(controlPoints) {
    this.controlPoints = [];
    var numberOfPoints = controlPoints.length;
    for (var index = 0; index < numberOfPoints;) {
        var tempControlPoint = [controlPoints[index++], controlPoints[index++], controlPoints[index++]];
        var temp = stringArrayToNumber(tempControlPoint, "ControlPoint Coordinates", "inf", "inf", 1);
        this.controlPoints.push(temp);
    }
    for (var i = 0; i <= this.controlPoints.length - 2; i++) {
        this.totalDistance += distanceBetweenVectors(this.controlPoints[i], this.controlPoints[i + 1]);
    }
    console.log("Distance: "+this.totalDistance);
};

function CircularAnimation(scene) {
    Animation.call(this, scene);
    this.center = [0, 0, 0];
    this.radius = 1;
    this.rotationAngle = 0;
    this.startAngle = 0;
};

CircularAnimation.prototype.setCenter = function(center) {

    var processedArgs = deleteElement(center.toString().split(TO_ELIMINATE_CHAR), function(x) {
        if (isNaN(Number(x)) || (nonValidChar.indexOf(x) != -1))
            return true;
        else
            return false;
    });
    this.center = stringArrayToNumber(processedArgs, "center Coordinates", "inf", "inf", 1);
};
CircularAnimation.prototype.setStartAngle = function(startAng) {
    var tempStartAng = Number(startAng);

    if (!isNaN(tempStartAng))
        this.startAngle = degToRad(tempStartAng);
    else
        this.startAngle = 0;
};
CircularAnimation.prototype.setRotateAngle = function(rotAng) {
    var tempRotAng = Number(rotAng);

    if (!isNaN(tempRotAng))
        this.rotationAngle = degToRad(tempRotAng);
    else
        this.rotationAngle = 0;
};
CircularAnimation.prototype.setRadius = function(radius) {
    var tempRadius = Number(radius);
    if (!isNaN(tempRadius))
        this.radius = tempRadius;
    else
        this.radius = 0;
};