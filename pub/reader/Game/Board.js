function Board(graph) {
    this.scene = graph.scene;
    Node.call(this, graph);
    this.min = 50;
    this.max = this.min + 4 * 24;
    this.whiteRings = [];
    this.whiteDisks = [];
    this.blackRings = [];
    this.blackDisks = [];
    this.pieces = new Array();
    this.stack = [this.whiteDisks, this.whiteRings, this.blackDisks, this.blackRings];
    this.createStacks();
    this.createPieces();
}

Board.prototype = Object.create(Node.prototype);
Board.prototype.constructor = Board;

Board.prototype.createStacks = function() {
    var contador = 0;
    var currentStackIndex = 0;
    var currentStack = this.stack[currentStackIndex];
    for (var id = this.min; id < this.max; id++) {
        if (contador > 23 && currentStackIndex < this.stack.length) {
            contador = 0;
            currentStackIndex++;
            currentStack = this.stack[currentStackIndex];
        }
        currentStack.push(id);
        contador++;
    }

    /* for (var i = 0; i < this.stack.length; i++)
         console.log(this.stack[i]);*/
}

Board.prototype.createPieces = function() {
    for (var id = this.min; id < this.max; id++) {
        var piece = [];
        var matrix = mat4.create();
        mat4.identity(matrix);
        piece.location = matrix;
        piece.node = null;
        piece.transformation = null;
        piece.cell = null;

        this.pieces[id] = piece;
    }

}

Board.prototype.display = function(parentElement) {
    this.graph.movTrack.resetId();
    Node.prototype.display.call(this, parentElement);
}

Board.prototype.apply = function(id) {
    this.scene.multMatrix(this.pieces[id].location);
}

Board.prototype.newPos = function(id, translate, node, newPos) {
    mat4.translate(this.pieces[id].location, this.pieces[id].location, translate);
    this.pieces[id].transformation = translate;
    this.pieces[id].node = node;
    this.pieces[id].cell = newPos;
    console.log(id, this.pieces[id]);
}

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
    var idToReturn = tempStack[tempStack.length - 1];
    tempStack.splice(tempStack.length - 1, 1);
    return idToReturn;
};
Board.prototype.getPieceCell = function(id) {
    return this.pieces[id].transformation;
};

Board.prototype.getPieceNode = function(id) {
    return this.pieces[id].node;
};
Board.prototype.getPiece = function(id) {
    return this.pieces[id];
};
Board.prototype.getPieceId = function(world) {
    for (var key in this.pieces) {
        if (this.pieces[key].cell != null && equalCoords(this.pieces[key].cell, world))
            return key;
    }
    return -1;
};
