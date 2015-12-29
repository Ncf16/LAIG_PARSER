function Info() {
    this.node = null;
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
    this.piece = new Info();
    this.cell = new Info();
    this.pickArray = ["",""];
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

            //end of animation
            this.piece.node.clearPicking();

            var orig = this.piece.coord;
            var dest = this.cell.coord;
            this.board.newPos(this.piece.id, [dest[0] - orig[0], dest[1] - orig[1], dest[2] - orig[2]], dest);
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

                if(obj){
                    var customId = this.scene.pickResults[i][1];
                    this.translateObj(obj,customId);
                    this.validateMove();
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
    }
};

MovTrack.prototype.setLastPick = function(obj){
    this.pickArray[0] = this.pickArray[1];
    this.pickArray[1] = obj;
};

MovTrack.prototype.stackToCell = function(){
    return (this.pickArray[0] == "piece" && this.pickArray[1] == "cell");
};

MovTrack.prototype.getPieceInfo = function(id){
    if (id > this.totalSize && id < this.totalSize + 1 + this.pieceCnt)
        return ["white","disk"];
    else if (id > this.totalSize + this.pieceCnt && id < this.totalSize + 1 + 2 * this.pieceCnt)
        return["white","ring"];
    else if (id > this.totalSize + 2 * this.pieceCnt && id < this.totalSize + 1 + 3 * this.pieceCnt)
        return["black","disk"];
    else if (id > this.totalSize + 3 * this.pieceCnt && id < this.totalSize + 1 + 4 * this.pieceCnt)
        return ["black","ring"];
};

MovTrack.prototype.getCellInfo = function(id){
    return [(id - 1) % this.sides,Math.floor((id - 1) / this.sides)];
};

MovTrack.prototype.translateObj = function(obj,id){
    if(obj instanceof Piece && !this.board.isPiecePicked(id)){
        var info = this.getPieceInfo(id);

        if(this.scene.canSelectPiece()){
            //clear first the previous object selection
            if(this.piece.node != null)
                this.piece.node.clearPicking();

            //set info
            this.piece.id = id;
            this.piece.info1 = info[0];
            this.piece.info2 = info[1];
            this.piece.node = obj;
            this.piece.coord = this.piece.node.getCoords(this.piece.info1, this.piece.info2);
            this.setLastPick("piece");

            //highlight
            this.piece.node.setPicking(this.piece.id);
        }
    }
    else if(obj instanceof BoardCell){
        var info = this.getCellInfo(id);

        if(this.scene.canSelectCell()){

            this.cell.id = id;
             this.cell.info1 = info[0]; //column
            this.cell.info2 = info[1]//line
            this.cell.node = obj;
            this.cell.coord = this.cell.node.getCoords(this.cell.info1,this.cell.info2);
            this.setLastPick("cell");
            this.cell.node.setPicking(this.cell.id);
        }
    }
};

MovTrack.prototype.copy = function(dest, orig) {
    dest.node = orig.node;
    dest.info1 = orig.info1;
    dest.info2 = orig.info2;
    dest.coord = orig.coord;
    dest.id = orig.id;
};

MovTrack.prototype.undo = function(worldCoords) {

    var index = this.board.getPieceId(worldCoords);
    if (index == -1) {
        console.log(worldCoords,"index not found");
        return;
    }

    this.scene.animationPlaying = true;
    // //cell [orig] = piece + translate;
    // //stack  [dest] = piece;
    // //dif [orig,dest] = [dest-orig] = piece - (piece + translate) = 0 - translate;
    // // ou seja [translate,0] em move
    // //reverse [0,translate]
    var cell = this.board.getPieceCell(index);
    var node = this.board.getPieceNode(index);
    var stack = [0, 0, 0];

    this.piece.id = index;
    this.piece.node = node;
    this.piece.coord = cell;
    this.cell.coord = stack;
    this.scene.animationPlaying = true;
    node.reverseMove(stack, cell);
    this.board.togglePicked(this.piece.id);
}

MovTrack.prototype.animate = function() {
    this.scene.animationPlaying = true;
    this.piece.node.move(this.piece.coord, this.cell.coord);
};


MovTrack.prototype.validateMove = function() {

    if (this.stackToCell() && !this.scene.animationPlaying && (botPlayers.indexOf(this.scene.currentPlayer) < 0)) {
        this.scene.moveSelected = true;
        play(this.scene, [this.cell.info2, this.cell.info1, convertToProlog(this.piece.info1, this.piece.info2)])
        console.log(this.scene.playResponse);
    }
};
MovTrack.prototype.response = function(result){
    if(result)
        this.board.togglePicked(this.piece.id);
    else
        this.piece.node.clearPicking();
};

MovTrack.prototype.removeTopPiece = function(type) {
    return this.board.removeTopPiece(type);
};
MovTrack.prototype.getPiece = function() {
    return this.piece;
};
MovTrack.prototype.resetBoard = function() {
    this.board.resetPieces();
};
MovTrack.prototype.getCell = function() {
    return this.cell;
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