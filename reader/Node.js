function Node(graph) {
	this.graph = graph;
	this.descendents = [];
	this.texture = null;
	this.transformation = null;
	this.id = "";
	this.visited = false;

	//debug
	this.repeat = 0;
};

Node.prototype.getID = function() {
	return this.id;
}

Node.prototype.display = function(parentElement) {

	var material;
	var texture;

	if (this.material != null) {
		material = this.graph.materials[this.material];
		if (material != null)
			this.graph.matArray.push(material);
	}

	if(this.texture != "null"){
		texture = this.graph.textures[this.texture];
		if(texture != null)
			this.graph.texArray.push(texture);
	}

/*
	if(this.repeat == 0){

	console.log("Start");
	console.log(this.id, " ", this.graph.matArray);
	console.log(this.texture);
	console.log(this.graph.texArray);

	for(key in this.graph.matArray)
		console.log(this.graph.matArray[key]);

	for(key in this.graph.texArray)
		console.log(this.graph.texArray[key]);
}
*/

	for (var i = 0; i < this.descendents.length; i++) {
		this.graph.scene.pushMatrix();
		this.transformation.useTransformation();
		var nodesArray = this.graph.nodes;
		var idToFind = this.descendents[i];

		var nextElem = getElement(nodesArray, idToFind);
		if (nextElem != null)
			nextElem.display(this);
		else
			console.error("Element does not exist");
		this.graph.scene.popMatrix();
	}

	if (this.texture != "null")
		this.graph.texArray.pop();
	
	if (material != null)
		this.graph.matArray.pop();

/*
if(this.repeat == 0){
	console.log("End");
	console.log(this.id, this.graph.matArray);
	console.log(this.graph.texArray);

		for(key in this.graph.matArray)
		console.log(this.graph.matArray[key]);

		for(key in this.graph.texArray)
		console.log(this.graph.texArray[key]);

	this.repeat++;
}
*/

};

Node.prototype.checkCycle = function() {
    this.visited = true;
    var nodesArray = this.graph.nodes;
    for (var key = 0; key < this.descendents.length; key++) {

        var idToFind = this.descendents[key];

        var nextElem = getElement(nodesArray, idToFind);
        if (nextElem != null) {
            if (!nextElem.getVisited()) {
                if (nextElem.checkCycle()) {
                    return true;
                }
            } else {
                console.error( "A cycle was detected in the following Nodes: ", this.id, "  ", this.descendents[key]);
                return true;
            }
     

        }
    
 this.graph .setAllUnvisited();
    }
    return false;
};

Node.prototype.getVisited = function() {
    return this.visited;
};