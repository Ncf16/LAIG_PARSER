function fullCylinder(scene, slices, stacks) {
    CGFobject.call(this, scene);
    console.log(slices, stacks);
    this.cilinderBase = new MyCylinderBase(scene, slices, stacks, 3);
    this.cilinderSide = new Cylinder(scene, 1, 1, 1, stacks, slices);
};

fullCylinder.prototype = Object.create(CGFobject.prototype);
fullCylinder.prototype.constructor = fullCylinder;

fullCylinder.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.35, 0.35, 1.5);
    this.scene.translate(0, 0, -1);

    this.scene.pushMatrix();
    this.cilinderBase.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.cilinderSide.display();
    this.scene.popMatrix();
    this.scene.popMatrix();

};
