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
		var currentAmbient = this.graph.scene.ambientID;
		this.graph.scene.ambientID = "picking";
		this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
		Node.prototype.display.call(this, parentElement);
		this.graph.scene.ambientID = currentAmbient;
	}
	else{
		this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
		Node.prototype.display.call(this, parentElement);
	}

};

BoardCell.prototype.setPicking = function(id){
	this.requestId = id;
}

BoardCell.prototype.clearPicking = function(){
	this.requestId = 0;
}

BoardCell.prototype.getCoords = function(col, lin) {
    return boardCoordsToWorld(lin, col);
};

 BoardCell.prototype.getId = function(col,lin){
 	return (lin*7+col)+1;
 }