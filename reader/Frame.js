/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyFrame(scene) {
	CGFobject.call(this,scene);

	this.cube = new MyCube(this.scene);
};

MyFrame.prototype = Object.create(CGFobject.prototype);
MyFrame.prototype.constructor = MyFrame;

MyFrame.prototype.display = function () {

	this.scene.pushMatrix();
	this.scene.scale(1,8,9);
	this.cube.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.scale(1,3,1);
		this.scene.pushMatrix();
			this.scene.translate(20,0,0);
			this.cube.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(20,0,8);
			this.cube.display();
		this.scene.popMatrix();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(1,3,0);
		this.scene.scale(20,0.5,9);
		this.cube.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(1.25,3.5,0.25);
		this.scene.scale(19.5,0.8,8.5);
		this.cube.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(1,5.6,2.75);
		this.scene.rotate(-Math.PI/6, 0,0,1);
		this.scene.scale(2.5,0.3,4);
		this.cube.display();
	this.scene.popMatrix();
};