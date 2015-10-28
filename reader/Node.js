function Node(graph) {
    //scene graph
    this.graph = graph;
    //descent from this node
    this.descendentsID = [];
    this.descendents = [];
    this.texture = null;
    this.material = null;
    this.transformation = null;
    //unique id from this node
    this.id = "";
    this.visited = false;
    this.stillChecking = false;
    this.animations=[];
};

Node.prototype.getID = function() {

    return this.id;
}

//function that use recursion to display the nodes
Node.prototype.display = function(parentElement) {

    //create the variables
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

    //silimar to Material check
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
        this.transformation.useTransformation();

        //search if id exists in Node array

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
};


//look in the node if there is a cycle
Node.prototype.checkCycle = function() {
    this.visited = true;
    this.stillChecking = true;

    var nodesArray = this.graph.nodes;

    //iterate throught children array
    for (var key = 0; key < this.descendents.length; key++) {

        //if child Node exists
        var nextElem = getElement(nodesArray, this.descendents[key]);
        if (nextElem != null) {

            //child was checked and so there isn't a cycle
            if (nextElem.stillChecking)
                return true;
            else
            //child wasn't checked but already visited, then there is a cycle
            if (!nextElem.getVisited())
                if (nextElem.checkCycle()) {

                    console.log(nextElem.stillChecking, nextElem);
                    console.error("A cycle was detected in the following Nodes: ", this.id, "  ", this.descendents[key]);
                    return true;
                }
        }
    }


    this.stillChecking = false;
    return false;
};

Node.prototype.getVisited = function() {
    return this.visited;
};

Node.prototype.processDescendents = function() {

    for (var index = 0; index < this.descendentsID.length; index++) {
        var idToFind = this.descendentsID[index];
        var nextElem = getElement(this.graph.nodes, idToFind);
        if (nextElem != null)
            this.descendents.push(nextElem);
    }
};