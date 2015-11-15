var defaultOrder = 1;
var defaultDivisions = 20;

function Patch(scene, order, partsU, partsV, control) {
    var possibleCurveOrders = [1, 2, 3];
    //order is the same for both if it wasn´t it should be (OrderInU+1)*(OrderInV+1)
    var controlLength = Math.pow(order + 1, 2);
    var knots = [];
    var checkOrder;
    var nurbsSurface;

    if (!checkNumber(order)) {
        order = defaultOrder;
    }
    if (!checkNumber(partsU)) {
        partsU = defaultDivisions;
    }
    if (!checkNumber(partsV)) {
        partsV = defaultDivisions;
    }

    checkOrder = possibleCurveOrders.indexOf(order);
    if (checkOrder == -1) {
        console.warn("Non valid Curve Order: " + order);
        order = 1;
    }

    if (controlLength != control.length) {
        console.error("Control Points in patch not correct you have: " + control.length + " and you should have " + controlLength);
    }

    addElementXtimes(knots, 0, order + 1);
    addElementXtimes(knots, 1, order + 1);
    control = dividIntoParts(control, order + 1);

    for (var index = 0; index < control.length; index++) {
        for (var i = 0; i < control[index].length; i++) {
            addElementXtimes(control[index][i], 1, 1);
        }
    }
    nurbsSurface = new CGFnurbsSurface(order, order, knots, knots, control);
    
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
    this.surface = nurbsSurface;
};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;
