this.stackTex = [];
this.stackMat = [];
MySceneGraph.prototype.processNode = function() {

	var nodes = this.rootNode.descendents;
	for (key in nodes) {
		if (this.nodes[key] != undefined)
			this.nodes[key].visited = false;
	}

	for (key in nodes) {

		//não existe nas leaves logo tem que ser um node
		if (this.leaves[key] == undefined) {
			if (this.nodes[key] != undefined) {
				if (!nodes[key].visited) {
					this.processNode(this.nodes[key]);
				}
			} else {


			}
		}
	}
};

function processNode(node) {
	node.visited = true;

	var desc = node.descendent;
	for (key in desc) {

		if (this.leaves[key] != undefined) {


		} else {
			if (!desc[i].visited) {

				desc[i].transformation.addMatrix(node.transformation.matrix);
				processNode(desc[i]);

			} else {
				console.error("Graph is in a circle: " + desc[i] + " has already been processed");
			}
		}
	}
};