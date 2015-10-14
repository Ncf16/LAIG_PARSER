/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCube(scene) {
	CGFobject.call(this,scene);

	this.rect = new Rectangle(this.scene);
	this.rect.initBuffers();
};

MyCube.prototype = Object.create(CGFobject.prototype);
MyCube.prototype.constructor = MyCube;

MyCube.prototype.display = function () {

	//front face
	this.scene.pushMatrix();
	this.scene.translate(0,0,1);
	this.rect.display();
	this.scene.popMatrix();

	// back face
	this.scene.pushMatrix();
	this.scene.translate(0,1,0);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.rect.display();
	this.scene.popMatrix();
	
	//right face
	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI/2,0,1,0);
	this.rect.display();
	this.scene.popMatrix();

	
	//left face
	this.scene.pushMatrix();
	this.scene.translate(1,0,1);
	this.scene.rotate(Math.PI/2,0,1,0);
	this.rect.display();
	this.scene.popMatrix();
	
	//top face
	this.scene.pushMatrix();
	this.scene.translate(0,1,1);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.rect.display();
	this.scene.popMatrix();

	//bottom face
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI/2,1,0,0);
	this.rect.display();
	this.scene.popMatrix();
	
};