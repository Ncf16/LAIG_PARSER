function Board(graph) {
    this.scene = graph.scene;
    Node.call(this, graph);
    this.min = 50;
    this.max = this.min + 4 * 24 + 1;

    this.pieceLocation = new Array();
    for (var id = this.min; id < this.max; id++) {
        var matrix = mat4.create();
        mat4.identity(matrix);
        this.pieceLocation[id] = matrix;
    }

    this.pieceCell = new Array();
}

Board.prototype = Object.create(Node.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function(parentElement) {
    this.graph.movTrack.resetId();
    Node.prototype.display.call(this, parentElement);
}

Board.prototype.apply = function(id) {
    this.scene.multMatrix(this.pieceLocation[id]);
}

Board.prototype.newPos = function(id, translate){
    mat4.translate(this.pieceLocation[id],this.pieceLocation[id],translate);
    this.pieceCell[id] = translate;
}

Board.prototype.getPieceCell = function(id){
    return this.pieceCell[id];
}