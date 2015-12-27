function Board(graph) {
    this.scene = graph.scene;
    Node.call(this, graph);
    this.min = 50;
    this.max = this.min + 4 * 24 + 1;
    this.whiteRings = [];
    this.whiteDisks = [];
    this.blackRings = [];
    this.blackDisks = [];
    this.stack = [this.whiteDisks, this.whiteRings, this.blackDisks, this.blackRings];
    var contador = 0;
    var currentStackIndex = 0;
    var currentStack = this.stack[currentStackIndex];
    for (var id = this.min; id < this.max; id++) {

        if (contador > 24 && currentStackIndex < this.stack.length) {
            contador = 0;
            currentStackIndex++;
            currentStack = this.stack[currentStackIndex];
            id--;
        }
        currentStack.push(id);
        contador++;
    }
    this.pieceLocation = new Array();
    for (var id = this.min; id < this.max; id++) {
        var matrix = mat4.create();
        mat4.identity(matrix);
        this.pieceLocation[id] = matrix;
    }
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

Board.prototype.newPos = function(id, translate) {

    mat4.translate(this.pieceLocation[id], this.pieceLocation[id], translate);
};

Board.prototype.getStackByPieceType = function(pieceType) {
    switch (pieceType) {
        case 1:
            return this.whiteRings;
        case 2:
            return this.whiteDisks;
        case 3:
            return this.blackRings;
        case 4:
            return this.blackDisks;
        default:
            return null;
    }

};
Board.prototype.addPiece = function(type, id) {
    var tempStack = this.getStackByPieceType(type);
    tempStack.push(id);
};
Board.prototype.removeTopPiece = function(type) {
    var tempStack = this.getStackByPieceType(type);
    var idToReturn = tempStack[0];
    tempStack.splice(0, 1);
    return idToReturn;
};
