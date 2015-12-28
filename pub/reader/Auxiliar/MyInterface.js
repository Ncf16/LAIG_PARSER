/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
};


MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();
    this.game = this.gui.addFolder("DuploHex");
    this.lights = this.gui.addFolder("Lights");

    return true;
};

MyInterface.prototype.addCameraDropdown = function(scene,array) {

    this.scene = scene;
    this.game.add(this.scene, 'rotateCamera',array).onChange((function() {
    	this.scene.cameraChange();
    }).bind(this));
};
