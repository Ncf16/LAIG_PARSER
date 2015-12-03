function Plane(scene, numberOfDivisions) {
    
    var nurbsSurface = new CGFnurbsSurface(1, 1, [0, 0, 1, 1], [0, 0, 1, 1], [
        [vec4.fromValues(-0.5, -0.5, 0.0, 1), vec4.fromValues(-0.5, 0.5, 0.0, 1)

        ],
        [vec4.fromValues(0.5, -0.5, 0.0, 1), vec4.fromValues(0.5, 0.5, 0.0, 1)]
    ]);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, numberOfDivisions, numberOfDivisions);

    this.nurbsSurface = nurbsSurface;
};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;
