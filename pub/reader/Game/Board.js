function Board(graph){
    Node.call(this,graph);
}

Board.prototype = Object.create(Node.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function(parentElement){
	this.graph.movTrack.resetId();
	Node.prototype.display.call(this,parentElement);
}