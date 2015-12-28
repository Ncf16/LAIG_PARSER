function Piece(graph) {
    Node.call(this, graph);

    this.xStackPos = 5;
    this.yStackPos = 14;
    this.deltaObj = 2;
    this.origin = [0, 0, 0];
    this.deltaY = 5;
    this.deltaT = 2;

    this.requestId = 0;
    this.pickingMaterial = null;
    this.pickingTexture = null;
}

Piece.prototype = Object.create(Node.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.setObjects = function(idObject){
    var id = 0;
    if(idObject == "ringObject")
        id = 24;

    for(var i=0; i < 48; i++){
        if(i < 24)
            this.graph.movTrack.board.setPieceNode(50+i+id,this);
        else
            this.graph.movTrack.board.setPieceNode(74+i+id,this);
    }
}

Piece.prototype.setPickingAmbient = function(){

    this.pickingMaterial = this.material;
    this.pickingTexture = this.texture;

    var tmpMaterial = this.materials["picking"];
    if(typeof tmpMaterial !== "undefined")
        this.pickingMaterial = tmpMaterial;
    var tmpTexture = this.textures["picking"];
    if(typeof tmpTexture !== "undefined")
        this.pixkingTexture = tmpTexture;
}

Piece.prototype.setPicking = function(id){
    this.requestId = id;
}

Piece.prototype.clearPicking = function(){
    console.log("clear");
    this.requestId = 0;
}


Piece.prototype.display = function(parentElement){
	
    var pieceId;
	var piece = this.graph.movTrack.getPiece();
	if(piece != null)
		pieceId = piece.id;
	id = this.graph.movTrack.id;
    if(id == this.requestId){
        var tmpMaterial = this.material;
        this.material = this.pickingMaterial;
        var tmpTexture = this.texture;
        this.texture = this.pickingTexture;
    }
	this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
	
	var material;
    var texture;

    //if string Material from node is different from null is necessary to push the material to material Stack
    if (this.material != "null") {
        //search from material with "this.material" string in Materials array
        material = this.graph.materials[this.material];

        //if found push it, else didn't find it
        if (material != null)
            this.graph.matArray.push(material);
    }

    //similar to Material check
    if (this.texture != "null") {
        texture = this.graph.textures[this.texture];
        if (texture != null)
            this.graph.texArray.push(texture);
    }

    //iterate for each children
    for (var i = 0; i < this.descendents.length; i++) {
        //set Matrix in order to transformation being applied correctly
        //apply transformations
        this.graph.scene.pushMatrix();

        this.transformation.apply();

        if (this.graph.movTrack.animation != null && id == pieceId)
            this.graph.movTrack.animation.apply();
        else
            this.graph.movTrack.board.apply(id);

        //if Node exists calls recursily, else displays that Node doesn't exist
        if (this.descendents[i] != null)
            this.descendents[i].display(this);
        else
            console.error("Element does not exist");

        //unset Matrix
        this.graph.scene.popMatrix();
    }
    //remove texture and Material from stack
    if (texture != null)
        this.graph.texArray.pop();

    if (material != null)
        this.graph.matArray.pop();

    if(id == this.requestId){
        this.material = tmpMaterial;
        this.texture = tmpTexture;
    }
}

Piece.prototype.getCoords = function(color, type) {
    if (color == "white" && type == "disk")
        return [this.xStackPos - this.deltaObj, 0, this.yStackPos];
    else if (color == "white" && type == "ring")
        return [this.xStackPos, 0, this.yStackPos];
    else if (color == "black" && type == "disk")
        return [this.xStackPos - this.deltaObj, 0, this.yStackPos - this.deltaObj];
    else if (color == "black" && type == "ring")
        return [this.xStackPos, 0, this.yStackPos - this.deltaObj];
    return [];
};

Piece.prototype.move = function(orig, dest) {

    var deltaX = dest[0] - orig[0];
    var deltaZ = dest[2] - orig[2];
    var distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
    var deltaT = this.deltaT + (0.01 * distance);
    var control = [this.origin, [this.origin[0], this.deltaY, this.origin[2]],[deltaX, this.deltaY, deltaZ],[deltaX, 0, deltaZ]];
    this.animate(deltaT,control);
};

Piece.prototype.reverseMove = function(orig,dest){
    
    var deltaX = dest[0] - orig[0];
    var deltaZ = dest[2] - orig[2];
    var distance = Math.sqrt(deltaX*deltaX + deltaZ * deltaZ);
    var deltaT = this.deltaT + (0.01* distance);
    var control = [[deltaX,0,deltaZ], [deltaX,this.deltaY,deltaZ], [this.origin[0],this.deltaY,this.origin[2]], this.origin];
    this.animate(deltaT,control);
};

Piece.prototype.animate = function(deltaT,control){
    var tempAnimation = new LinearAnimation(this.graph.scene, deltaT, control);
    tempAnimation.type = "linear";
    this.graph.movTrack.animation = tempAnimation;
    tempAnimation.init(this.graph.scene.currTime);
}