function CircularAnimation(scene, deltaT) {
    Animation.call(this, scene, deltaT);
    this.center = [0, 0, 0];
    this.radius = 1;
    this.rotationAngle = 0;
    this.startAngle = 0;
    this.deltaAngle = 0;
};

function CircularAnimation(scene, deltaT, center, radius, rotationAngle, startAngle, deltaAngle, type, endTime, transformation) {
    Animation.call(this, scene, deltaT, type);
    this.center = center;
    this.radius = radius;
    this.rotationAngle = rotationAngle;
    this.startAngle = startAngle;
    this.deltaAngle = deltaAngle;
    this.calculateDelta();
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.calculateDelta = function() {
    this.secDelta = this.deltaT;
    this.deltaAngle = ((1.0 * this.rotationAngle)) / this.secDelta;
};

CircularAnimation.prototype.setCenter = function(center) {
    var processedArgs = deleteElement(center.toString().split(TO_ELIMINATE_CHAR), function(x) {
        if (isNaN(Number(x)) || (nonValidChar.indexOf(x) != -1))
            return true;
        else
            return false;
    });
    this.center = stringArrayToNumber(processedArgs, "center Coordinates", "inf", "inf", 1);
    this.startPos = [];
    copyArray(this.startPos, this.center);
};

CircularAnimation.prototype.setStartAngle = function(startAng) {
    var tempStartAng = Number(startAng);

    if (!isNaN(tempStartAng)) {
        this.startAngle = truncRadian(degToRad(tempStartAng));

    } else
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

CircularAnimation.prototype.clone = function(scene) {
    return new CircularAnimation(scene, this.deltaT, this.center, this.radius, this.rotationAngle, this.startAngle, this.deltaAngle, this.type, this.endTime, this.currentAngle, this.transformation, this.startPos);
};

// transformation == Node.transformation
CircularAnimation.prototype.update = function(currTime) {
    // console.log("Angle: " + this.currentAngle, currTime, this.startTime, this.deltaAngle);
    this.transformation.reset();
    var deltaTime = (currTime - this.startTime) / 1000.0;
    var currentAngle = (this.deltaAngle * deltaTime) + this.startAngle;
    
    this.transformation.doTranslate(this.center);
    this.transformation.doRotate(currentAngle, [0, 1, 0]);
    this.transformation.doTranslate([this.radius, 0, 0]);

    contador++;
};

CircularAnimation.prototype.init = function(currTime) {
    this.startTime = currTime;
    this.started = true;
    this.updateEndTime();
};
