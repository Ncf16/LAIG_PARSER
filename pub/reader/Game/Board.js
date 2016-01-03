function Board(graph) {
    this.scene = graph.scene;
    Node.call(this, graph);
    this.min = 50;
    this.max = this.min + 4 * 24;
    this.pieces = new Array();

    this.createStacks();
    this.createPieces();
}

Board.prototype = Object.create(Node.prototype);
Board.prototype.constructor = Board;

Board.prototype.createStacks = function() {
    this.whiteRings = [];
    this.whiteDisks = [];
    this.blackRings = [];
    this.blackDisks = [];
    this.stack = [this.whiteDisks, this.whiteRings, this.blackDisks, this.blackRings];
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
}

Board.prototype.createPieces = function() {
    for (var id = this.min; id < this.max; id++) {
        var piece = [];
        resetPiece(piece);
        piece.node = null;
        this.pieces[id] = piece;
    }

};
Board.prototype.resetPieces = function() {
    for (var id = this.min; id < this.max; id++) {
        resetPiece(this.pieces[id]);
    }
};

function resetPiece(piece) {
    var matrix = mat4.create();
    mat4.identity(matrix);
    piece.location = matrix;
    piece.picked = false;
    piece.transformation = null;
    piece.cell = null;
};
Board.prototype.display = function(parentElement) {
    this.graph.movTrack.resetId();
    Node.prototype.display.call(this, parentElement);
};

Board.prototype.apply = function(id) {
    this.scene.multMatrix(this.pieces[id].location);
};

Board.prototype.newPos = function(id, translate, newPos) {
    mat4.translate(this.pieces[id].location, this.pieces[id].location, translate);
    this.pieces[id].transformation = translate;
    this.pieces[id].cell = newPos;
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
Board.prototype.setPieceNode = function(id, node) {
    this.pieces[id].node = node;
};
Board.prototype.togglePicked = function(id) {
    this.pieces[id].picked = !this.pieces[id].picked;
};
Board.prototype.isPiecePicked = function(id) {
    return this.pieces[id].picked;
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
