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

Node.prototype.checkDescedents = function(currentAmbient,ambient){
    if(ambient == "picking")
        return currentAmbient;
    if(typeof this.descendents[ambient] !== "undefined")
        return ambient;
    else
        return this.defautlAmbient;

};

Piece.prototype.setPicking = function(id){
    this.requestId = id;
};

Piece.prototype.clearPicking = function(){
    this.requestId = 0;
};


Piece.prototype.display = function(parentElement){
	
    var pieceId;
	var piece = this.graph.movTrack.getPiece();
	if(piece != null)
		pieceId = piece.id;
	id = this.graph.movTrack.id;
    if(id == this.requestId){
       var currentAmbient = this.graph.scene.ambientID;
       this.graph.scene.ambientID = "picking";
    }
	this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
	
	var material;
    var texture;

     var ambientDes, ambientMat, ambientText;
    ambient = this.graph.scene.ambientID;

    ambientMat = this.checkMaterial(ambient);
    ambientText = this.checkTexture(ambient);
    ambientDes = this.checkDescedents(currentAmbient,ambient);

    //if string Material from node is different from null is necessary to push the material to material Stack
    if (this.materials[ambientMat] != "null") {
        //search from material with "this.material" string in Materials array
        material = this.graph.materials[this.materials[ambientMat]];

        //if found push it, else didn't find it
        if (material != null)
            this.graph.matArray.push(material);
    }

    //similar to Material check
    if (this.textures[ambientText] != "null") {
        texture = this.graph.textures[this.textures[ambientText]];
        if (texture != null)
            this.graph.texArray.push(texture);
    }

    //iterate for each children
    for (var i = 0; i < this.descendents[ambientDes].length; i++) {
        //set Matrix in order to transformation being applied correctly
        //apply transformations
        this.graph.scene.pushMatrix();

        this.transformation.apply();

        if (this.graph.movTrack.animation != null && id == pieceId)
            this.graph.movTrack.animation.apply();
        else
            this.graph.movTrack.board.apply(id);

        //if Node exists calls recursily, else displays that Node doesn't exist
        if (this.descendents[ambientDes][i] != null)
            this.descendents[ambientDes][i].display(this);
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

    if(id == this.requestId)
        this.graph.scene.ambientID = currentAmbient;
}

Piece.prototype.getCoords = function(color, type) {
    if (color == "white" && type == "disk")
        return stackCoordsToWorld(4,0,1);
    else if (color == "white" && type == "ring")
        return  stackCoordsToWorld(1,0,1);
    else if (color == "black" && type == "disk")
        return  stackCoordsToWorld(0,4,-1);
    else if (color == "black" && type == "ring")
        return  stackCoordsToWorld(0,1,-1);
    return [];
};

Piece.prototype.move = function(orig, dest) {

    var deltaX = dest[0] - orig[0];
    var deltaY = dest[1] - orig[1];
    var deltaZ = dest[2] - orig[2];
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    var deltaT = this.deltaT + (0.01 * distance);
    var control = [this.origin, [this.origin[0], this.deltaY, this.origin[2]],[deltaX, this.deltaY, deltaZ],[deltaX, deltaY, deltaZ]];
    this.animate(deltaT,control);
};

Piece.prototype.reverseMove = function(orig,dest){
    
    var deltaX = dest[0] - orig[0];
    var deltaY = dest[1] - orig[1];
    var deltaZ = dest[2] - orig[2];
    var distance = Math.sqrt(deltaX*deltaX + deltaY * deltaY + deltaZ * deltaZ);
    var deltaT = this.deltaT + (0.01* distance);
    var control = [[deltaX,deltaY,deltaZ], [deltaX,this.deltaY,deltaZ], [this.origin[0],this.deltaY,this.origin[2]], this.origin];
    this.animate(deltaT,control);
};

Piece.prototype.animate = function(deltaT,control){
    var tempAnimation = new LinearAnimation(this.graph.scene, deltaT, control);
    tempAnimation.type = "linear";
    this.graph.movTrack.animation = tempAnimation;
    tempAnimation.init(this.graph.scene.currTime);
}