var CONVERTER = 1;

function Lights() {
    this.enabled = false;
    this.ID = "";
    this.pos;
    this.amb;
    this.diff;
    this.spec;
};

Lights.prototype.isEnabled = function() {
    return this.enabled;
};
Lights.prototype.getID = function() {
    return this.ID;
};
Lights.prototype.getPosition = function() {
    return this.pos;
};
Lights.prototype.getAmbient = function() {
    return this.amb;
};
Lights.prototype.getDiffuse = function() {
    return this.diff;
};
Lights.prototype.getSpecular = function() {
    return this.spec;
};
Lights.prototype.setEnabled = function(newEnabled) {
    var temp = Number(newEnabled);
    if (validadeNumber(temp, function(x) {
        if ((x != 0 && x != 1) || isNaN(x))
            return false;
        else
            return true;
    })) {
        this.enabled = temp;
    } else {
        console.warn("Inpute in the Enable section of a Light was invalide, the default value will be used (false)");
        this.enabled = 0;
    }
};


Lights.prototype.setID = function(newID) {
    this.ID = newID;
}
Lights.prototype.setPosition = function(newPos) {
    this.pos = stringArrayToNumber(newPos, "Position", "inf", "inf", 1);
};
Lights.prototype.setAmbient = function(newAmb) {
    this.amb = stringArrayToNumber(newAmb, "RGB", 0, 1, CONVERTER, 255);
};
Lights.prototype.setDiffuse = function(newDiff) {
    this.diff = stringArrayToNumber(newDiff, "RGB", 0, 1, CONVERTER, 255);
};
Lights.prototype.setSpecular = function(newSpec) {
    this.spec = stringArrayToNumber(newSpec, "RGB", 0, 1, CONVERTER, 255);
};