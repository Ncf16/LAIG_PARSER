function Board(graph){
    this.scene = graph.scene;
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

Board.prototype.apply = function(id){
    this.scene.multMatrix(this.pieceLocation[id]);
}

Board.prototype.newPos = function(id, translate){
    mat4.translate(this.pieceLocation[id],this.pieceLocation[id],translate);
}