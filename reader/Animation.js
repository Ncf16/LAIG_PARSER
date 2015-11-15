var defaultStartingPos = [0, 0, 0];
var contador = 0;

function Animation(scene, deltaT, type) {
    this.deltaT = deltaT; //init do lsx
    this.type = type; //init do lsx
    this.startTime = 0;
    this.endTime = 0;
    this.started = false;

    this.transformation = new Transformation(scene);
};

Animation.prototype.constructor = Animation;

Animation.prototype.setDeltaT = function(newDeltaT) {
    var tempNewDeltaT = Number(newDeltaT);

    if (!isNaN(tempNewDeltaT))
        this.deltaT = tempNewDeltaT * 1000.0;
    else
        this.deltaT = 0;
};

Animation.prototype.validateAnimation = function(currTime) {
    // console.log(currTime, this.startTime, this.endTime, between(currTime, this.startTime, this.endTime));
    //Devolver overhead time
    return between(currTime, this.startTime, this.endTime);
};
Animation.prototype.apply = function() {
    this.transformation.apply();
};

Animation.prototype.updateEndTime = function() {
    this.endTime = this.startTime + this.deltaT*1000.0;
};
