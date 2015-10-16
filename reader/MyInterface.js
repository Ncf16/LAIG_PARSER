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
    this.lights = this.gui.addFolder("Lights");
    return true;
};
 MyInterface.prototype.addLights = function() {
 
     //for (var i = 0; i < this.scene.lightsEnable.length; i++) {
        //console.log(i);
        //this.lights.add(this.scene.lightsEnable, i, this.scene.lightsEnable[i]);
    // }
 
 };