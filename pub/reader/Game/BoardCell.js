function BoardCell(graph) {
    Node.call(this, graph);

    this.requestId = 0;
    this.pickingMaterial = null;
    this.pickingTexture = null;
}

BoardCell.prototype = Object.create(Node.prototype);
BoardCell.prototype.constructor = BoardCell;

BoardCell.prototype.display = function(parentElement) {

	if(this.graph.movTrack.id == this.requestId){
		var tmpMaterial = this.material;
		this.material = this.pickingMaterial;
		var tmpTexture = this.texture;
		this.texture = this.pickingTexture;

		this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
		Node.prototype.display.call(this, parentElement);

		this.material = tmpMaterial;
		this.texture = tmpTexture;
	}
	else{
		this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
		Node.prototype.display.call(this, parentElement);
	}

}

BoardCell.prototype.setPickingAmbient = function(){

	this.pickingMaterial = this.material;
	this.pickingTexture = this.texture;

	var tmpMaterial = this.materials["picking"];
	if(typeof tmpMaterial !== "undefined")
		this.pickingMaterial = tmpMaterial;
	var tmpTexture = this.textures["picking"];
	if(typeof tmpTexture !== "undefined")
		this.pickingTexture = tmpTexture;
}

BoardCell.prototype.setPicking = function(id){
	this.requestId = id;
}

BoardCell.prototype.clearPicking = function(){
	this.requestId = 0;
}

BoardCell.prototype.getCoords = function(col, lin) {
    return boardCoordsToWorld(col, lin);
};

 BoardCell.prototype.getId = function(col,lin){
 	return (lin*7+col)+1;
 }