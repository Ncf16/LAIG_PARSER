function Text(scene,element,text){
	this.scene = scene;
	this.element = element;
	this.text = text;
	this.limits = 16;
}

Text.prototype.constructor = Text;

Text.prototype.display = function(){

	this.scene.setActiveShaderSimple(this.scene.textShader);

	for(var i=0; i < this.text.length; i++){
		this.scene.pushMatrix();
		var coords = this.findLocation(this.text.charCodeAt(i));
		console.log(coords);
		this.scene.activeShader.setUniformsValues({'charCoords': coords});
		this.scene.translate(i,0,0);
		this.element.display();
		this.scene.popMatrix();
	}

	this.scene.setActiveShaderSimple(this.scene.defaultShader);
}

Text.prototype.findLocation = function(code){

	return[code%this.limits,Math.floor(code/this.limits)];
}