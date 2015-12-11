function LinearAnimation(scene, deltaT, control, type) {
    Animation.call(this, scene, deltaT, type);
    this.control = [];
    this.time = [];
    this.courses = [];
    this.totalDistance = 0;
    this.distancePerCourse = [];

    if (control.length <= 1) {
        console.error("There must be more than 1 control Point");
        return null;
    }
    if (isNaN(deltaT)) {
        console.error("invalid deltaT");
        deltaT = 1;
    }

    for (var key = 0; key < control.length - 1; key++) {
        var distance = distanceBetweenVectors(control[key], control[key + 1]);
        this.totalDistance += distance;
        this.courses.push(createVector(control[key], control[key + 1]));
        this.distancePerCourse.push(distance);

    }
    this.speed = this.totalDistance / deltaT;
    this.time.push(0);
    for (var key = 1; key < control.length; key++) {
        if (this.speed != 0)
            this.time.push(this.distancePerCourse[key - 1] / this.speed + this.time[key - 1]);
        else
            this.time.push(deltaT);
    }
    for (var key = 0; key < control.length; key++) {
        this.control[key] = [];
        copyArray(this.control[key], control[key]);
    }

};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.clone = function(scene) {
    return new LinearAnimation(scene, this.deltaT, this.control, this.type)

};

LinearAnimation.prototype.update = function(currTime) {
    this.transformation.reset();
    //tempo que passou desde do inicio
    var delta = (currTime - this.startTime) / 1000.0;
    var currentCourse;
    var currentAngle;
    var currentPos = [];

    for (var i = 0; i < this.time.length - 1; i++) {
        if (this.time[i] <= delta && delta <= this.time[i + 1]) {
            currentCourse = i;
            break;
        }
    }
    var timePassed = delta - this.time[currentCourse];

    //Time needed in each course 
    var deltaCourse = this.time[currentCourse + 1] - this.time[currentCourse];
    var pathDone = timePassed / deltaCourse;


    if (this.courses[currentCourse][0] == 0)
        currentAngle = 0;
    else {
        currentAngle = Math.PI / 2 - Math.atan(this.courses[currentCourse][2] / this.courses[currentCourse][0]);

        if (this.courses[currentCourse][0] < 0)
            currentAngle += Math.PI;
    }

    currentPos[0] = this.control[currentCourse][0];
    currentPos[1] = this.control[currentCourse][1];
    currentPos[2] = this.control[currentCourse][2];

    currentPos[0] += this.courses[currentCourse][0] * pathDone;
    currentPos[1] += this.courses[currentCourse][1] * pathDone;
    currentPos[2] += this.courses[currentCourse][2] * pathDone;

    this.transformation.doTranslate(currentPos);
    this.transformation.doRotate(currentAngle, "y");
};
LinearAnimation.prototype.init = function(currTime) {
    this.startTime = currTime;
    this.endTime = this.startTime + this.deltaT * 1000.0;
    this.started = true;
};