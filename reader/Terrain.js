function Terrain(scene, texture, heightmap) {

    this.texture = new CGFtexture(scene, texture);
    this.heightmap = new CGFtexture(scene, heightmap);
    //TODO change from MyPlane to Plain
    this.plane = new MyPlane(scene, 20, 20);
    this.scene = scene;
    this.shader=this.scene.CustomShader;

};
Terrain.prototype.constructor = Terrain;

Terrain.prototype.display = function() {

   this.scene.setActiveShader(this.shader);
    this.texture.bind(0);
    this.heightmap.bind(1);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader); 
};
