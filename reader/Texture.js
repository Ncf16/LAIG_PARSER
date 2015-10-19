function Texture() {
	//set the default values to texture
	this.id = "";
	this.path = "";
	this.amplif_factor = [];
};

Texture.prototype.createTexture = function(scene){

	//if the id is clear the texture shall not be created
	//otherwise call CGFTexture with location of file
	if(this.id != "clear")
		this.cgf = new CGFtexture(scene, this.path);
}