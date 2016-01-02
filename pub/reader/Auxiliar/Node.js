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
    //animation
    this.animations = [];
    this.currentAnimation = null;
    this.index = 1;

    //different ambients
    this.materials = [];
    this.textures = [];
    this.ambientNodes = [];
    this.currentAmbient = "Default"
};

Node.prototype.getID = function() {

    return this.id;
}
Node.prototype.setAmbient = function() {

    text = this.graph.scene.ambientID;

    if (typeof text !== 'undefined' && typeof text === "string") {
        var tmpMaterial = this.materials[text];
        if (typeof tmpMaterial !== "undefined")
            this.material = tmpMaterial;
        var tmpTexture = this.textures[text];
        if (typeof tmpTexture !== "undefined")
            this.texture = tmpTexture;
    }
};
Node.prototype.copyTransformationInfo = function(toCopyNode) {
    this.transformation = toCopyNode.transformation;
    if (toCopyNode.currentAnimation != null) {
        this.animations.push(toCopyNode.currentAnimation);
        this.currentAnimation = toCopyNode.currentAnimation;
    }
};
Node.prototype.setNode = function(parentElement) {

    var nodeAmbient = this.graph.scene.ambientID;
    if (this.currentAmbient !== nodeAmbient && getIndexedArrayLength(this.ambientNodes) > 0) {
        var oldID = this.currentAmbient;
        this.currentAmbient = nodeAmbient;
        console.log(nodeAmbient, this.id);
        if (typeof nodeAmbient !== 'undefined' && typeof nodeAmbient === "string") {
            var tmpNodeID = this.ambientNodes[nodeAmbient];
            var index = getIndex(this.graph.nodes, tmpNodeID, compareWithID);

            var tmpNode = this.graph.nodes[index];
            console.log(tmpNode);
            if (typeof tmpNode !== "undefined") {
                tmpNode.currentAmbient = nodeAmbient;
                tmpNode.copyTransformationInfo(this);
                 this.descendents[0] = tmpNode;
            }
        }
    }
};
//garantir que os nodes alternativos são criados com tudo igual
Node.prototype.swapDescentds = function(idToSwap, node) {

    console.log(this.id, this.descendents,idToSwap);
    var index = getIndex(this.descendents, idToSwap, compareWithID);
    if (index > -1) {
        //TODO copy info from descendent to Node, just to be sure
        this.descendents[index] = node;
    }
    console.log(this.descendents);
};
Node.prototype.setPickingAmbient = function() {

};

Node.prototype.update = function(currTime) {

    if (this.graph.scene.Loop && this.animations.length > 0) {
        this.index = 0;
        this.currentAnimation = this.animations[this.index++];
        this.currentAnimation.init(currTime);

    }

    if (this.currentAnimation != null) {
        if (this.currentAnimation.validateAnimation(currTime))
            this.currentAnimation.update(currTime);
        else {

            if (this.index < this.animations.length) {
                this.currentAnimation = this.animations[this.index++];
                this.currentAnimation.init(currTime);
                this.currentAnimation.update(currTime);
            } else
                this.currentAnimation = null;
        }
    }

};

//function that use recursion to display the nodes
Node.prototype.display = function(parentElement) {
    //create the variables
    var material;
    var texture;
    //  console.log("AMBIENT: " + this.currentAmbient, this.id);
    this.setAmbient();
    this.setNode(parentElement);

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

        if (this.currentAnimation != null)
            this.currentAnimation.apply();

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
        else
            console.warn("Element with ID: " + idToFind + " does not exist");
    }
};

Node.prototype.clone = function() {

};
