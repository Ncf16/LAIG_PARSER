function Node(graph) {
	this.graph = graph;
	this.descendents = [];
	this.texture = null;
	this.transformation = null;
	this.id = "";
};

Node.prototype.getID = function() {
	return this.id;
}

Node.prototype.display = function(parentElement) {

	if (this.texture != null) {
		//add
		var texture = this.graph.textures[this.texture];
		//console.log(texture);
		if (texture != null)
			this.graph.texArray.push(texture);
		else {

		}
	}
	if (this.material != null) {
		var material = this.graph.materials[this.material];
		if (material != null)
			this.graph.matArray.push(material);
		else {
			this.graph.matArray.push(this.graph.defaultMaterial);
		}
	}

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
	if (this.texture != null) {
		this.graph.texArray.pop();
	}
	if (this.material != null) {
		this.graph.matArray.pop();

	}

};

