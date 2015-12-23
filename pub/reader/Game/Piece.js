function Piece(graph){
    Node.call(this,graph);
    this.xStackPos = -10.65;
    this.yStackPosI = 0.5;
    this.yStackPosF = 9.892;
    this.deltaObj = 2;
}

Piece.prototype = Object.create(Node.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function(parentElement){
	this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
	Node.prototype.display.call(this,parentElement);
}

Piece.prototype.getCoords = function(color,type){
	if(color == "white" && type=="disk"){
		var coords = [this.xStackPos,0,this.yStackPosI];
		return coords;
	}
	else if(color == "white" && type=="ring"){
		var coords = [this.xStackPos,0,this.yStackPosI+this.deltaObj];
		return coords;
	}
	else if(color == "black" && type=="disk"){
		var coords = [this.xStackPos,0,this.yStackPosF];
		return coords;
	}
	else if(color == "black" && type=="ring"){
		var coords = [this.xStackPos,0,this.yStackPosF-this.deltaObj];
		return coords;
	}

}