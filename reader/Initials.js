//check types

function initials() {
    this.frustum = new Frustum();
    this.axisLength = 1;
    this.LightsID = [];
    this.materialsID = [];
    this.lights = [];
    this.materials = [];
    this.leavesID = [];
    this.leaves = [];
    this.nodesID = [];
    this.nodes = [];
};
initials.prototype.getNear = function() {
    return this.frustum.near;
};
initials.prototype.getFar = function() {
    return this.frustum.far;
};
initials.prototype.setNear = function(newNear) {
    this.frustum.near = newNear;
};
initials.prototype.setFar = function(newFar) {
    this.frustum.far = newFar;
};
initials.prototype.setAxisLength = function(newLength) {
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
initials.prototype.getLights = function() {
    return this.lights;
};
initials.prototype.getMaterials = function() {
    return this.materials;
};