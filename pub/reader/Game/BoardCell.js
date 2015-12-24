function BoardCell(graph) {
    Node.call(this, graph);
}

BoardCell.prototype = Object.create(Node.prototype);
BoardCell.prototype.constructor = BoardCell;

BoardCell.prototype.display = function(parentElement) {
    this.graph.scene.registerForPick(this.graph.movTrack.id++, this);
    Node.prototype.display.call(this, parentElement);
}

BoardCell.prototype.getCoords = function(col, lin) {
    var coords = [1.5 * (col - lin), 0, 0.866 * (col + lin)];
    return coords;
}
