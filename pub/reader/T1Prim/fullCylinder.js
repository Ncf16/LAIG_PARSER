function fullCylinder(scene, slices, stacks) {
    CGFobject.call(this, scene);
    console.log(slices, stacks);
    this.cilinderBase = new MyCylinderBase(scene, slices, stacks, 3);
    this.cilinderSide = new Cylinder(scene, 1, 1, 1, stacks, slices);
};

fullCylinder.prototype = Object.create(CGFobject.prototype);
fullCylinder.prototype.constructor = fullCylinder;

fullCylinder.prototype.display = function() {
    this.cilinderBase.display();
    this.cilinderSide.display();

};
