function Piece(graph){
    Node.call(this,graph);

    this.xStackPos = 5;
    this.yStackPosW = 12;
    this.yStackPosB = 10;
    this.deltaObj = 2;
    this.origin = [0,0,0];
    this.deltaY = 3;
    this.deltaT = 1.2;
}

Piece.prototype = Object.create(Node.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function(parentElement){
	
	var piece = this.graph.movTrack.getPiece();
	var pieceId;
	if(piece != null)
		pieceId = piece.id;
	id = this.graph.movTrack.id;

	//console.log(id);
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
}

Piece.prototype.getCoords = function(color,type){
	if(color == "white" && type=="disk"){
		var coords = [this.xStackPos,0,this.yStackPosW];
		return coords;
	}
	else if(color == "white" && type=="ring"){
		var coords = [this.xStackPos,0,this.yStackPosW+this.deltaObj];
		return coords;
	}
	else if(color == "black" && type=="disk"){
		var coords = [this.xStackPos,0,this.yStackPosB];
		return coords;
	}
	else if(color == "black" && type=="ring"){
		var coords = [this.xStackPos,0,this.yStackPosB+this.deltaObj];
		return coords;
	}
}

Piece.prototype.move = function(orig,dest){
	
	var deltaX = dest[0] - orig[0];
	var deltaZ = dest[2] - orig[2];

	var distance = Math.sqrt(deltaX*deltaX + deltaZ * deltaZ);
	var deltaT = this.deltaT + (0.01* distance);
	var control = [this.origin, [this.origin[0],this.deltaY,this.origin[2]], [deltaX,this.deltaY,deltaZ], [deltaX,0,deltaZ]];

	var tempAnimation = new LinearAnimation(this.graph.scene, deltaT, control);
    tempAnimation.type = "linear";
    this.graph.movTrack.animation = tempAnimation;
	tempAnimation.init(this.graph.scene.currTime);
}