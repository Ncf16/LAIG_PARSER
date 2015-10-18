function Texture() {
	this.id = "";
	this.path = "";
	this.amplif_factor = [];
};

Texture.prototype.createTexture = function(scene){

	if(this.id != "clear")
		this.cgf = new CGFtexture(scene, this.path);
}