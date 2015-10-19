function Frustum() {
    //Default values for Frustum
    this.near = 0.1;
    this.far = 1;
};

Frustum.prototype.setNear = function(newNear) {
    console.log("AQUI", newNear);
    if (isNaN(newNear) || newNear <= 0.1) {
        newNear = 0.1;
    } else
        this.near = newNear;
};
Frustum.prototype.setFar = function(newFar) {
    if (isNaN(newFar) || newFar < 0) {
        newFar = 500;
    } else
        this.far = newFar;
};