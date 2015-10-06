function MyCilinder(scene, slices, stacks, choice, cilinderBaseAppearance, cilinderSideAppearance) {
    CGFobject.call(this, scene);

    this.cilinderBase = new MyCilinderBase(scene, slices, stacks, choice, 0, 1, 0, 1);
    this.cilinderSide = new MyCilinderSide(scene, slices, stacks, 0, 1, 0, 1);
    this.cilinderBaseAppearance = cilinderBaseAppearance;
    this.cilinderSideAppearance = cilinderSideAppearance;


};

MyCilinder.prototype = Object.create(CGFobject.prototype);
MyCilinder.prototype.constructor = MyCilinder;


//tex coords devem estar mal


MyCilinder.prototype.display = function() {
    this.scene.pushMatrix();
    //apos rodar 90º em torno do X z aponta para cima correcto?
    this.cilinderBaseAppearance.apply();
    this.cilinderBase.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.cilinderSideAppearance.apply();
    this.cilinderSide.display();
    this.scene.popMatrix();

};