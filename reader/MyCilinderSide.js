function MyCilinderSide(scene, slices, stacks, minS, maxS, minT, maxT) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;

    this.minS = minS;
    this.maxS = maxS;
    this.minT = minT;
    this.maxT = maxT;


    this.initBuffers();

};

MyCilinderSide.prototype = Object.create(CGFobject.prototype);
MyCilinderSide.prototype.constructor = MyCilinderSide;

MyCilinderSide.prototype.initBuffers = function() {
    /*
     * TODO:
     * Replace the following lines in order to build a prism with a **single mesh**.
     *
     * How can the vertices, indices and normals arrays be defined to
     * build a prism with varying number of slices and stacks?
     */

    var deg2rad = Math.PI / 180;
    var alfa = deg2rad * 360 / this.slices;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var k = 0;

    //minS will always be = 0 for the moment, hence why moveX is calculated this way
    var moveX = this.maxS / this.slices;
    var moveY = this.maxT / this.stacks;

    var k = 0;
    for (var j = 0; j <= this.stacks; j++) {

        for (var i = 0; i <= this.slices; i++) {

            if (i < this.slices) {
                this.vertices.push(Math.cos(alfa * i), Math.sin(alfa * i), j / this.stacks);
                this.normals.push(Math.cos(alfa * i), Math.sin(alfa * i), 0);
                this.texCoords.push(this.maxS - i * moveX, this.minT + j * moveY);
            }
            if (i == this.slices) {
                this.vertices.push(Math.cos(alfa * 0), Math.sin(alfa * 0), j / this.stacks);
                this.normals.push(Math.cos(alfa * 0), Math.sin(alfa * 0), 0);
                this.texCoords.push(this.maxS - i * moveX, this.minT + j * moveY);
            }
        }
        //this.texCoords.push(this.minS,this.minT+j*moveY);
    }


    for (var stack = 0; stack < this.stacks; stack++) {

        for (var aresta = 0; aresta < this.slices; aresta++) {
            /*
			this.indices.push(0);
			this.indices.push(1);
			this.indices.push(10);
			
			this.indices.push(10);
			this.indices.push(9);
			this.indices.push(0);
			*/
            this.indices.push((this.slices + 1) * (stack) + aresta);
            this.indices.push((this.slices + 1) * (stack) + 1 + aresta);
            this.indices.push((this.slices + 1) * (stack + 1) + 1 + aresta);
            this.indices.push((this.slices + 1) * (stack + 1) + 1 + aresta);
            this.indices.push((this.slices + 1) * (stack + 1) + aresta);
            this.indices.push((this.slices + 1) * (stack) + aresta);
        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};