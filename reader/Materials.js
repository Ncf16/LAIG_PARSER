function Materials() {
	this.shininess = 0;
	this.ID = "";
	this.emission = [];
	this.amb = [];
	this.diff = [];
	this.spec = [];
};
Materials.prototype.getShininess = function() {
	return this.shininess;
};
Materials.prototype.getID = function() {
	return this.ID;
};
Materials.prototype.getEmission = function() {
	return this.emission;
};
Materials.prototype.getAmbient = function() {
	return this.amb;
};
Materials.prototype.getDiffuse = function() {
	return this.diff;
};
Materials.prototype.getSpecular = function() {
	return this.spec;
};
Materials.prototype.setShininess = function(newShininess) {

	var temp = Number(newShininess);
	if (validadeNumber(temp, function(x) {
			if (x < 0 || x == NaN)
				return false;
			else
				return true;
		})) {
		this.shininess = temp;
	} else {
		console.warn("Inpute in the Shininess section of a Material was invalide, the default value will be used (50)");
		this.shininess = 50;
	}
};
Materials.prototype.setID = function(newID) {
	this.ID = newID;
};
Materials.prototype.setEmission = function(newEmission) {
	this.emission = stringArrayToNumber(newEmission, "RGB", 0, 255, 255);
};
Materials.prototype.setAmbient = function(newAmbient) {
	this.amb = stringArrayToNumber(newAmbient, "RGB", 0, 255, 255);
};
Materials.prototype.setDiffuse = function(newDiffuse) {
	this.diff = stringArrayToNumber(newDiffuse, "RGB", 0, 255, 255);
};
Materials.prototype.setSpecular = function(newSpecular) {
	this.spec = stringArrayToNumber(newSpecular, "RGB", 0, 255, 255);
};