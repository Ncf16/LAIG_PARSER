function fullCylinder(scene, slices, stacks) {
    CGFobject.call(this, scene);

    this.cilinderBase = new MyCylinderBase(scene, slices, stack, 3, 0, 1, 0, 1);
    this.cilinderSide = new Cylinder(scene, 1, 1, 1, stack, slices);
};

fullCylinder.prototype = Object.create(CGFobject.prototype);
fullCylinder.prototype.constructor = fullCylinder;

fullCylinder.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.translate(0, 0, -1);

    this.scene.pushMatrix();
    this.cilinderBase.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.cilinderSide.display();
    this.scene.popMatrix();
    this.scene.popMatrix();

};
