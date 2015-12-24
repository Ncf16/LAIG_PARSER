function Board(graph){
    Node.call(this,graph);
    this.pieceLocation = new Array();
    for(var id=50; id < 98; id++){
    	var matrix = mat4.create();
    	mat4.identity(matrix);
    	this.pieceLocation[id] = matrix;
    }
}

Board.prototype = Object.create(Node.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function(parentElement){
	this.graph.movTrack.resetId();
	Node.prototype.display.call(this,parentElement);
}

Board.prototype.getMatrix = function(id){
	return this.pieceLocation[id];
}