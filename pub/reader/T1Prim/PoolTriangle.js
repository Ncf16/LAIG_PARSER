 function PoolTriangle(sideScene) {
     CGFobject.call(this, sideScene);
     this.scene = sideScene;
     this.T1 = new Triangle(sideScene, [-1.5, 0, 1], [1.5, 0, 1], [-1.5, 0.5, 1]);
     this.T2 = new Triangle(sideScene, [-1.5, 0.5, 1], [1.5, 0, 1], [1.5, 0.5, 1]);
     this.T3 = new Triangle(sideScene, [-1.5, 0.5, 1], [0, 0, -1.5], [-1.5, 0, 1]);
     this.T4 = new Triangle(sideScene, [0, 0.5, -1.5], [0, 0, -1.5], [-1.5, 0.5, 1]);
     this.T5 = new Triangle(sideScene, [-1.5, 0.5, 1], [1.5, 0, 1], [-1.5, 0, 1]);
     this.T6 = new Triangle(sideScene, [1.5, 0, 1], [-1.5, 0.5, 1], [1.5, 0.5, 1]);
     this.T7 = new Triangle(sideScene, [0, 0, -1.5], [-1.5, 0.5, 1], [-1.5, 0, 1]);
     this.T8 = new Triangle(sideScene, [0, 0, -1.5], [0, 0.5, -1.5], [-1.5, 0.5, 1]);
     this.T9 = new Triangle(sideScene, [1.5, 0.5, 1], [1.5, 0, 1], [0, 0, -1.5]);
     this.T10 = new Triangle(sideScene, [1.5, 0, 1], [1.5, 0.5, 1], [0, 0, -1.5]);
     this.T11 = new Triangle(sideScene, [0, 0.5, -1.5], [1.5, 0.5, 1], [0, 0, -1.5]);
     this.T12 = new Triangle(sideScene, [1.5, 0.5, 1], [0, 0.5, -1.5], [0, 0, -1.5]);

 };
 PoolTriangle.prototype = Object.create(CGFobject.prototype);
 PoolTriangle.prototype.constructor = PoolTriangle;

 PoolTriangle.prototype.display = function() {
     this.scene.pushMatrix();
     this.scene.scale(1.5, 1.5, 1.5);
     this.T1.display();
     this.T2.display();
     this.T3.display();
     this.T4.display();
     this.T5.display();
     this.T6.display();
     this.T7.display();
     this.T8.display();
     this.T9.display();
     this.T10.display();
     this.T11.display();
     this.T12.display();
     this.scene.popMatrix();
 };
