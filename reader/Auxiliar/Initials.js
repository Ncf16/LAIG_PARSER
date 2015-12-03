//Creates a new object of the class Initials
function initials() {
    //Default values
    this.frustum = new Frustum();
    this.axisLength = 1;

};
initials.prototype.getNear = function() {
    return this.frustum.near;
};
initials.prototype.getFar = function() {
    return this.frustum.far;
};
initials.prototype.setNear = function(newNear) {
    this.frustum.setNear(newNear);
};
initials.prototype.setFar = function(newFar) {
    this.frustum.setFar(newFar);
};
initials.prototype.setAxisLength = function(newLength) {
    //validades the length given
    if (validadeNumber(newLength, function(x) {
        if (x > 0)
            return true;
        else
            return false;
    }))
        this.axisLength = newLength;
};
initials.prototype.getAxisLength = function() {
    return this.axisLength;
};