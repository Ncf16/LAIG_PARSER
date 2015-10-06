 function MyCilinderBase(scene, slices, stacks, choice, minS, maxS, minT, maxT) {
     CGFobject.call(this, scene);

     this.slices = typeof slices !== 'undefined' ? slices : 8;
     this.stacks = typeof stacks !== 'undefined' ? stacks : 20;
     this.choice = typeof choice !== 'undefined' ? choice : 1;

     this.minS = typeof minS !== 'undefined' ? minS : 0;
     this.maxS = typeof maxS !== 'undefined' ? maxS : 1;
     this.minT = typeof minT !== 'undefined' ? minT : 0;
     this.maxT = typeof maxT !== 'undefined' ? maxT : 1;

     this.initBuffers();
 };

 MyCilinderBase.prototype = Object.create(CGFobject.prototype);
 MyCilinderBase.prototype.constructor = MyCilinderBase;

 MyCilinderBase.prototype.initBuffers = function() {
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


     var moveX;
     var moveY;
     moveX = (this.maxS + this.minS) / 2;
     moveY = (this.maxT + this.minT) / 2;
     var raioY = this.maxT - moveY;
     var raioX = this.maxS - moveX;


     if (this.choice == 1 || this.choice == 3) {

         this.vertices.push(0, 0, 1);
         this.normals.push(0, 0, 1);
         this.texCoords.push(moveX, moveY);
         var indiceLast = k;
         k++;
         var avanco;
         for (var i = 0; i < this.slices; i++) {


             var x1 = Math.cos(alfa * i);
             var y1 = Math.sin(alfa * i);
             var x2 = Math.cos(alfa * (i + 1));
             var y2 = Math.sin(alfa * (i + 1));

             this.vertices.push(x1, y1, 1);
             this.vertices.push(x2, y2, 1);

             this.indices.push(indiceLast);
             this.indices.push(k);
             this.indices.push(k + 1);


             this.texCoords.push(moveX + x1 * raioX, this.maxT - moveY - y1 * raioY);
             this.texCoords.push(moveX + x2 * raioX, this.maxT - moveY - y2 * raioY);

             this.normals.push(0, 0, 1);
             this.normals.push(0, 0, 1);

             k += 2;
         }
     }
     if (this.choice == 2 || this.choice == 3) {

         this.vertices.push(0, 0, 0);
         this.texCoords.push(moveX, moveY);
         this.normals.push(0, 0, -1);
         var indiceLast2 = k;
         k++;
         for (var i = 0; i < this.slices; i++) {

             var x1 = Math.cos(alfa * i);
             var y1 = Math.sin(alfa * i);
             var x2 = Math.cos(alfa * (i + 1));
             var y2 = Math.sin(alfa * (i + 1));

             this.vertices.push(x1, y1, 0);
             this.vertices.push(x2, y2, 0);

             this.indices.push(indiceLast2);
             this.indices.push(k + 1);
             this.indices.push(k);


             this.texCoords.push(moveX - x1 * raioX, this.maxT - moveY - y1 * raioY);
             this.texCoords.push(moveX - x2 * raioX, this.maxT - moveY - y2 * raioY);

             this.normals.push(0, 0, -1);
             this.normals.push(0, 0, -1);

             k += 2;
         }
     }
     this.primitiveType = this.scene.gl.TRIANGLES;
     this.initGLBuffers();
 };