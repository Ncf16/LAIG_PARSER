function Frustum() {
	this.near = 0;
	this.far = 1;
};

Frustum.prototype.setNear = function(newNear) {
	var temp=Number(newNear);
	if(isNaN(temp) || temp <0)
	{
		temp=0.1;
	}
	this.near = temp;
};
Frustum.prototype.setFar = function(newFar) {
	var temp=Number(newFar);
	if(isNaN(temp) || temp <0)
	{
		temp=500;
	}
	this.far = temp;
};

 