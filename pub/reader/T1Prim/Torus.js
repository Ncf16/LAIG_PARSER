function Torus(scene, radius, tube, radialSeg, tubeSeg) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.tube = tube;
    this.radialSeg = radialSeg;
    this.tubeSeg = tubeSeg;

    this.minS = 0;
    this.minT = 0;
    this.maxS = 1;
    this.maxT = 1;

    this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.subNormalize = function(v1, v2){
    var x = v1[0] - v2[0];
    var y = v1[1] - v2[1];
    var z = v1[2] - v2[2];

    var length = Math.sqrt(x*x+y*y+z*z);
    return [x/length,y/length,z/length];
}

Torus.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var radialAngle = 2.0 * Math.PI / this.radialSeg;
    var tubeAngle = 2.0 * Math.PI / this.tubeSeg;

    for (var i = 0; i <= this.radialSeg; i++) {
        var cos = Math.cos(i*radialAngle);
        var sin = Math.sin(i*radialAngle);

        var center = [this.radius*cos,0,this.radius*sin];

        for(var j=0; j <= this.tubeSeg; j++){
            var innerCos = Math.cos(j*tubeAngle);
            var innerSin = Math.sin(j*tubeAngle);
            
            var x = (this.radius+this.tube*innerCos)*cos;
            var y = this.tube*innerSin;
            var z = (this.radius+this.tube*innerCos)*sin;

            this.vertices.push(x,y,z);
            this.texCoords.push(j/this.tubeSeg,i/this.radialSeg);
            var norms = this.subNormalize([x,y,z],center);
            this.normals.push(norms[0],norms[1],norms[2]);
        }
    }

    for(var i=0; i < this.radialSeg; i++){

        var currSeg = (this.tubeSeg + 1) * i;
        var nextSeg = (this.tubeSeg + 1) * (i+1);

        for(var j=0; j < this.tubeSeg; j++){
            this.indices.push(currSeg+j,currSeg+1+j,nextSeg+j);
            this.indices.push(currSeg+1+j,nextSeg+1+j,nextSeg+j);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}