function Info() {
    this.node = null;
    this.obj;
    this.info1;
    this.info2;
    this.coord;
    this.id;
}

function MovTrack(scene) {
    this.sides = 7;
    this.totalSize = this.sides * this.sides;
    this.pieceCnt = 12;
    this.scene = scene;
    this.animation = null;
    this.lastPick = new Info();
    this.newPick = new Info();
    this.animationElements = new Array();
    this.animationElements['piece'] = new Info();
    this.animationElements['cell'] = new Info();
    this.id = 1;
}

MovTrack.prototype.resetId = function() {
    this.id = 1;
};

MovTrack.prototype.update = function(currTime) {

    if (this.animation != null) {
        if (this.animation.validateAnimation(currTime))
            this.animation.update(currTime);
        else
            this.animation = null;
    }
};

MovTrack.prototype.listen = function() {

    this.copy(this.lastPick, this.newPick);

    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj) {
                    var customId = this.scene.pickResults[i][1];
                    this.translateId(obj, customId);
                    //if(this.validateMove())
                    // console.log(customId, "move " + this.lastPick.info1 + " " + this.lastPick.info2, " to column: ", this.newPick.info1, " line: ", this.newPick.info2);
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

MovTrack.prototype.animate = function() {
    if (this.animationElements['piece'].obj != "piece" || this.animationElements['cell'].obj != "cell")
        return false;
    else {
        this.copy(this.animationElements['piece'], this.lastPick);
        this.copy(this.animationElements['cell'], this.newPick);
        this.animationElements['piece'].node.move(this.animationElements['piece'].coord, this.animationElements['cell'].coord);
        return true;
    }
}

MovTrack.prototype.validateMove = function() {
    //chamar a função da scene que valida os movimentos
    convertToProlog(this.lastPick.info1, this.lastPick.info2);
    if (this.lastPick.node != null && this.newPick.node != null && this.lastPick.obj == "piece" && this.newPick.obj == "cell") {
        this.scene.moveSelected = true;
        play(this.scene, [this.newPick.info2, this.newPick.info1, convertToProlog(this.lastPick.info1, this.lastPick.info2)]);
    }
};

function convertToProlog(colour, pieceType) {
    console.log(colour, pieceType);
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

MovTrack.prototype.getPiece = function() {
    return this.animationElements['piece'];
};

MovTrack.prototype.getCell = function() {
    return this.animationElements['cell'];
};
