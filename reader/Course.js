function Course(startPoint, endPoint, startTime, endTime) {
    this.startPoint = [];
    this.endPoint = [];
    copyArray(this.startPoint, startPoint);
    copyArray(this.endPoint, endPoint);
    this.startTime = startTime;
    this.endTime = endTime;
    this.deltaX = this.endPoint[0] - this.startPoint[0];
    this.deltaY = this.endPoint[1] - this.startPoint[1];

    this.deltaZ = this.endPoint[2] - this.startPoint[2];

};

Course.prototype.constructor = Course;
Course.prototype.calcSpeed = function(deltaT) {
    this.deltaT = deltaT;
    var tempDelta = deltaT / 1000.0;
    this.speedX = (this.deltaX / (tempDelta));
    this.speedY = (this.deltaY / (tempDelta));
    this.speedZ = (this.deltaZ / (tempDelta));

};
Course.prototype.updateTime = function(deltaT) {

    this.endTime = this.startTime + deltaT;


};
Course.prototype.calcPos = function(currTime) {
    var deltaTime = (currTime - this.startTime) / 1000.0;

    var newPos = [];
    copyArray(newPos, this.startPoint);

    var deltaX = this.speedX * deltaTime;
    var deltaY = this.speedY * deltaTime;
    var deltaZ = this.speedZ * deltaTime;


    newPos[0] += deltaX;
    newPos[1] += deltaY;
    newPos[2] += deltaZ;

    console.log("CALC POS ", deltaTime);
    return newPos;
};

Course.prototype.runCourse = function(currTime) {
    return between(currTime, this.startTime, this.endTime);
};
