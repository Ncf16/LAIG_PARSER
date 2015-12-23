function Info(){
	this.node = null;
	this.obj;
	this.info1;
	this.info2;
	this.coord;
}

function MovTrack(scene){
	this.sides = 7;
	this.totalSize = this.sides * this.sides;
	this.pieceCnt = 12;
	this.scene = scene;
	this.lastPick = new Info();
	this.newPick = new Info();
	this.id = 1;
}

MovTrack.prototype.resetId = function(){
	this.id = 1;
};

MovTrack.prototype.listen = function(){

	this.copy(this.lastPick, this.newPick);

	if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i=0; i< this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj)
                {
                    var customId = this.scene.pickResults[i][1];              
                    this.translateId(obj,customId);
                    //if(this.validMove())
                    //	console.log("move " + this.lastPick.info1 + " " + this.lastPick.info2, " to column: ", this.newPick.info1, " line: ", this.newPick.info2);
                }
            }
            this.scene.pickResults.splice(0,this.scene.pickResults.length);
        }       
    }
};

MovTrack.prototype.copy = function(dest, orig){
	dest.node = orig.node;
	dest.obj = orig.obj;
	dest.info1 = orig.info1;
	dest.info2 = orig.info2;
	dest.coord = orig.coord;
};

MovTrack.prototype.translateId = function(obj,id){

	
	if(id > 0 && id < this.totalSize + 1){
		var col = (id -1) % this.sides;
		var lin = Math.floor((id-1)/this.sides);
		this.newPick.obj = "cell";
		this.newPick.info1 = col;
		this.newPick.info2 = lin;
	}
	else if(id > this.totalSize && id < this.totalSize + 1 + this.pieceCnt){
		this.newPick.obj = "piece";
		this.newPick.info1 = "white";
		this.newPick.info2 = "disk";
	}
	else if (id > this.totalSize + this.pieceCnt && id < this.totalSize + 1 + 2*this.pieceCnt){
		this.newPick.obj = "piece";
		this.newPick.info1 = "white";
		this.newPick.info2 = "ring";
	}
	else if (id > this.totalSize + 2*this.pieceCnt && id < this.totalSize + 1 + 3*this.pieceCnt){
		this.newPick.obj = "piece";
		this.newPick.info1 = "black";
		this.newPick.info2 = "disk";
	}
	else if (id > this.totalSize + 3*this.pieceCnt && id < this.totalSize + 1 + 4*this.pieceCnt){
		this.newPick.obj = "piece";
		this.newPick.info1 = "black";
		this.newPick.info2 = "ring";
	}
	
	this.newPick.node = obj;
	this.newPick.coord = this.newPick.node.getCoords(this.newPick.info1,this.newPick.info2);
};

MovTrack.prototype.validMove = function(){
	if (this.lastPick.node!= null && this.newPick.node != null && this.lastPick.obj == "piece" && this.newPick.obj == "cell")
		return true;
	else
		return false;
};

MovTrack.prototype.getPiece = function(){
	if(this.validMove())
		return this.lastPick;
	else
		return null;
};

MovTrack.prototype.getCell = function(){
	if(this.validMove())
		return this.newPick;
	else
		return null;
};