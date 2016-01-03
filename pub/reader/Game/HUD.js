function HUD(graph) {
    Node.call(this, graph);
}

HUD.prototype = Object.create(Node.prototype);
HUD.prototype.constructor = HUD;

HUD.prototype.display = function(parentElement){
	Node.prototype.display.call(this, parentElement);
}