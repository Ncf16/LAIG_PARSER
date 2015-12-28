function Info() {
    this.node = null;
    this.obj;
    this.info1;
    this.info2;
    this.coord;
    this.id;
};

function MovTrack(scene) {
    this.sides = 7;
    this.totalSize = this.sides * this.sides;
    this.pieceCnt = 24;
    this.scene = scene;
    this.animation = null;
    this.lastPick = new Info();
    this.newPick = new Info();
    this.animationElements = new Array();
    this.animationElements['piece'] = new Info();
    this.animationElements['cell'] = new Info();
    this.id = 1;
    this.board = null;
};

MovTrack.prototype.resetId = function() {
    this.id = 1;
};

MovTrack.prototype.update = function(currTime) {

    if (this.animation != null) {
        if (this.animation.validateAnimation(currTime))
            this.animation.update(currTime);
        else {
            this.animationElements['piece'].node.clearPicking();
            var orig = this.animationElements['piece'].coord;
            var dest = this.animationElements['cell'].coord;
            this.board.newPos(this.animationElements['piece'].id, [dest[0] - orig[0], dest[1] - orig[1], dest[2] - orig[2]], this.animationElements['piece'].node, dest);
            this.animation = null;
            this.scene.animationPlaying = false;
            this.scene.replayingMove = false;
        }
    }
};

MovTrack.prototype.listen = function() {

    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];

                if (obj) {
                    this.copy(this.lastPick, this.newPick);
                    var customId = this.scene.pickResults[i][1];
                    if(obj instanceof Piece && !this.board.isPiecePicked(customId) || obj instanceof BoardCell){
                        // console.log(obj, customId, this.scene);
                        if(this.newPick.node != null && this.newPick.node instanceof Piece && obj instanceof Piece && this.newPick.node.id != obj.id)
                            this.newPick.node.clearPicking();
                        obj.setPicking(customId);
                        this.translateId(obj, customId);
                    }
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
    }
};

MovTrack.prototype.copy = function(dest, orig) {
    dest.node = orig.node;
    dest.obj = orig.obj;
    dest.info1 = orig.info1;
    dest.info2 = orig.info2;
    dest.coord = orig.coord;
    dest.id = orig.id;
};

MovTrack.prototype.translateId = function(obj, id) {

    if (id > 0 && id < this.totalSize + 1) {
        var col = (id - 1) % this.sides;
        var lin = Math.floor((id - 1) / this.sides);
        this.newPick.obj = "cell";
        this.newPick.info1 = col;
        this.newPick.info2 = lin;
    } else if (id > this.totalSize && id < this.totalSize + 1 + this.pieceCnt) {
        this.newPick.obj = "piece";
        this.newPick.info1 = "white";
        this.newPick.info2 = "disk";
    } else if (id > this.totalSize + this.pieceCnt && id < this.totalSize + 1 + 2 * this.pieceCnt) {
        this.newPick.obj = "piece";
        this.newPick.info1 = "white";
        this.newPick.info2 = "ring";
    } else if (id > this.totalSize + 2 * this.pieceCnt && id < this.totalSize + 1 + 3 * this.pieceCnt) {
        this.newPick.obj = "piece";
        this.newPick.info1 = "black";
        this.newPick.info2 = "disk";
    } else if (id > this.totalSize + 3 * this.pieceCnt && id < this.totalSize + 1 + 4 * this.pieceCnt) {
        this.newPick.obj = "piece";
        this.newPick.info1 = "black";
        this.newPick.info2 = "ring";
    }

    this.newPick.id = id;
    this.newPick.node = obj;
    this.newPick.coord = this.newPick.node.getCoords(this.newPick.info1, this.newPick.info2);

    this.validateMove();
};

MovTrack.prototype.undo = function(worldCoords) {

    var index = this.board.getPieceId(worldCoords);
    if (index == -1) {
        console.log("index not found");
        return;
    }

    // this.scene.animationPlaying = true;
    // //cell [orig] = piece + translate;
    // //stack  [dest] = piece;
    // //dif [orig,dest] = [dest-orig] = piece - (piece + translate) = 0 - translate;
    // // ou seja [translate,0] em move
    // //reverse [0,translate]
    var cell = this.board.getPieceCell(index);
    var node = this.board.getPieceNode(index);
    var stack = [0, 0, 0];

    this.animationElements['piece'].id = index;
    this.animationElements['piece'].node = node;
    this.animationElements['piece'].coord = cell;
    this.animationElements['cell'].coord = stack;

    node.reverseMove(stack, cell);
    this.board.togglePicked(this.animationElements['piece'].id);
}

MovTrack.prototype.animate = function() {
    if (this.animationElements['piece'].obj != "piece" || this.animationElements['cell'].obj != "cell")
        return false;
    this.scene.animationPlaying = true;
    this.animationElements['piece'].node.move(this.animationElements['piece'].coord, this.animationElements['cell'].coord);
    this.board.togglePicked(this.animationElements['piece'].id);
    return true;
};


MovTrack.prototype.validateMove = function() {

    if (this.lastPick.node != null && this.newPick.node != null && this.lastPick.obj == "piece" && this.newPick.obj == "cell") {
        if (!this.scene.animationPlaying && ((botPlayers.indexOf(this.scene.currentPlayer) < 0))) {
            this.scene.moveSelected = true;
            this.copy(this.animationElements['piece'], this.lastPick);
            this.copy(this.animationElements['cell'], this.newPick);

            play(this.scene, [this.newPick.info2, this.newPick.info1, convertToProlog(this.lastPick.info1, this.lastPick.info2)]);
            //this.animate();
        }
    }
};
MovTrack.prototype.removeTopPiece = function(type) {
    return this.board.removeTopPiece(type);
};

function convertToProlog(colour, pieceType) {

    switch (colour) {
        case "black":
            if (pieceType == "ring")
                return 3;
            else
                return 4;
            break;
        case "white":
            if (pieceType == "ring")
                return 1;
            else
                return 2;

            break;
    }
};

function prologToInfo(pieceType, obj) {

    switch (pieceType) {
        case 1:
            obj.info1 = "white";
            obj.info2 = "ring";
            break;
        case 2:
            obj.info1 = "white";
            obj.info2 = "disk";
            break;
        case 3:
            obj.info1 = "black";
            obj.info2 = "ring";
            break;
        case 4:
            obj.info1 = "black";
            obj.info2 = "disk";
            break;

    }
};
MovTrack.prototype.getPiece = function() {
    return this.animationElements['piece'];
};
MovTrack.prototype.resetBoard = function() {
    this.board.resetPieces();
};
MovTrack.prototype.getCell = function() {
    return this.animationElements['cell'];
};
