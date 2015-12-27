function validadeNumber(numberToBeValidated, validationFunction) {

    return validationFunction(numberToBeValidated);
};

function copyArray(A1, A2) {
    undefinedArray(A1);
    undefinedArray(A2);
    for (var i = 0; i < A2.length; i++) {
        A1.push(A2[i]);
    }
};

function truncRadian(angle) {
    return (angle % (2 * Math.PI));
};

function cartesianToSphericCoords(cartesianCoords) {
    var radius = distanceBetweenVectors(cartesianCoords, [0, 0, 0, 0]);
    return [radius, Math.atan2(cartesianCoords[2], cartesianCoords[0]), Math.acos(cartesianCoords[1] / radius)];
};

function mod(number1, number2) {
    return number1 - Math.floor(number1 / number2) * number2
};
/*
Beware in many languages the modulo operation returns a value with the same sign as the dividend 
(like C, C++, C#, JavaScript, full list here). This requires a custom mod function like so:
*/
function differenceBetweenAngles(sourceA, targetA) {

    var temp;
    temp = targetA - sourceA
    temp = mod((temp + Math.PI), 2 * Math.PI) - Math.PI;
    return temp;
};

function distanceBetweenTwoSphericPoint(point1, point2) {
    return [point2.radius - point1.radius,
        differenceBetweenAngles(point1.theta, point2.theta),
        differenceBetweenAngles(point1.phi, point2.phi)
    ];
};

function boardCoordsToWorld(col, lin) {
    return [1.5 * (col - lin), 0, 0.866 * (col + lin)];
};

function equal(Element1, Element2) {
    return Element1 == Element2;
};

function equalCoords(Element1, Element2) {
    return (Element1[0] == Element2[0] && Element1[1] == Element2[1] && Element1[2] == Element2[2]);
};

function getIndex(array, element, process) {
    var j = array.length;
    do {
        if (process(array[--j], element))
            return j;
    } while (j);

    return -1;
}

function absoluteDistanceBetweenTwoSphericPoints(point1, point2) {

    if (point1.length != point2.length)
        return -1;
    else {
        return distanceBetweenVectors([point1[0] * Math.sin(point1[1]) * Math.sin(point1[2]), point1[0] * Math.cos(point1[2]), point1[0] * Math.cos(point1[1]) * Math.sin(point1[2])], [point2[0] * Math.sin(point2[1]) * Math.sin(point2[2]), point2[0] * Math.cos(point2[2]), point2[0] * Math.cos(point2[1]) * Math.sin(point2[2])])
    }
};

function dividIntoParts(A, nParts) {
    if (A.length < nParts)
        return -1;
    var divided = [];
    var added = 0;
    var temp = [];
    for (var i = 0; i < A.length; i++) {
        if (added == nParts) {
            added = 0;
            divided.push(temp);
            temp = [];
        }
        temp.push(A[i]);
        added++;
    }
    if (temp.length == nParts)
        divided.push(temp);

    return divided;
}

function createVector(V1, V2) {
    if (V1.length != V2.length)
        return null;

    var newVec = [];
    for (var i = 0; i < V1.length; i++) {
        newVec.push(V2[i] - V1[i]);
    }
    return newVec;
};

function addElementXtimes(A, Element, nTimes) {
    undefinedArray(A);

    for (var i = 0; i < nTimes; i++)
        A.push(Element);
};

function checkNumber(number) {
    var tempNumber = Number(number)
    if (isNaN(number)) {
        return false;
    }
    return true;
};

function stringArrayToNumber(array, nameOfType, lowerLimit, upperLimit, converter) {
    undefinedArray(array);
    for (var i = 0; i < array.length; i++) {
        var temp = array[i];
        array[i] = Number(array[i]);
        if (isNaN(array[i])) {
            console.log("here NaN");
            array[i] = lowerLimit;
            console.warn("Invalid paramenter in a " + nameOfType + "it was " + temp + " now the lowerLimit will be used instead (" + lowerLimit + ")");
        } else if (array[i] < lowerLimit && lowerLimit != "inf") {

            array[i] = lowerLimit;
            console.warn("Use values of " + nameOfType + " between" + lowerLimit + " and " + upperLimit + " it was " + temp + " and now it is: " + array[i]);
        } else if (array[i] > upperLimit && upperLimit != "inf") {

            while (array[i] > upperLimit) {
                array[i] = array[i] % converter;
                console.log(array[i]);
            }
            array[i] /= converter;
            console.log(array[i]);
            console.warn("Use values of " + nameOfType + " between" + lowerLimit + " and " + upperLimit + array[i] * converter + " and now it is: " + array[i]);
        }
    }
    return array;
};

function degToRad(angle) {

    var temp = Number(angle);
    //console.log(temp+1);
    if (!isNaN(temp))
        return (Math.PI * temp) / 180;
    else {
        console.warn("Value of angle is a not a valid one please check .lsx, value: " + angle);
        return 0;
    }
};

function deleteElement(array, evaluates) {
    undefinedArray(array);
    for (var i = 0; i < array.length; i++) {

        if (evaluates(array[i])) {
            array.splice(i, 1);
            i--;
        }
    }
    return array;
};

function getElement(array, elementID) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].getID() == elementID)
            return array[i];
    }
    return null;
};

function processControlPoints(controlPoints) {
    undefinedArray(controlPoints);
    var temporaryContainer = [];

    var numberOfPoints = controlPoints.length;

    for (var index = 0; index < numberOfPoints;) {
        var tempControlPoint = [controlPoints[index++], controlPoints[index++], controlPoints[index++]];
        var temp = stringArrayToNumber(tempControlPoint, "ControlPoint Coordinates", "inf", "inf", 1);
        temporaryContainer.push(temp);
    }
    return temporaryContainer;
};

function parseLeafAux(leave, type) {
    if (type == "rectangle") {
        return new LeafRectangle();
    } else if (type == "triangle") {
        return new LeafTriangle();
    } else if (type == "cylinder") {
        return new LeafCylinder();
    } else if (type == "sphere") {
        return new LeafSphere();
    } else if (type == "hex") {
        return new LeafHex();
    } else if (type == "patch") {
        return new LeafPatch();
    } else if (type == "plane") {
        return new LeafPlane();
    } else if (type == "terrain") {
        return new LeafTerrain();
    } else if (type == "torus") {
        return new LeafTorus();
    } else {
        console.warn("Invalid type of Leaf: " + type);
    }
};

function normalVector(V) {
    var v = Math.sqrt(scalarProduct(V, V));

    for (var i = 0; i < V.length; i++)
        V[i] = V[i] / v;
};

function crossProduct(V1, V2) {
    if (V1.length != 3 || V2.length != 3)
        return -1;
    return [

        V2[1] * V1[2] - V2[2] * V1[1],
        V2[2] * V1[0] - V2[0] * V1[2],
        V2[0] * V1[1] - V2[1] * V1[0]

    ];
};

function distanceBetweenVectors(V1, V2) {
    undefinedArray(V1);
    undefinedArray(V2);
    if (V1.length != V2.length)
        return -1;
    var dist = 0;

    for (var i = 0; i < V1.length; i++) {
        dist += Math.pow(V1[i] - V2[i], 2);
    }
    return Math.sqrt(dist);
};

function angleBetweenVectors(V1, V2) {
    if (V1.length != V2.length) {
        return -1;
    }
    var V1length = scalarProduct(V1, V1);
    var V2length = scalarProduct(V2, V2);

    return Math.acos(scalarProduct(V1, V2) / (V1length * V2length));
};

function between(Value, lowerLimit, upperLimit) {
    //  console.log("BETWEEN",Value-lowerLimit,upperLimit-lowerLimit);
    return (lowerLimit <= Value && Value <= upperLimit);
};

function undefinedArray(V1) {

    if (typeof V1 === 'undefined') {
        console.log("UNDEFINED FOUND");
        V1 = [];
        console.log(V1);
    }
};

function scalarProduct(V1, V2) {

    undefinedArray(V1);
    undefinedArray(V2);
    if (V1.length != V2.length) {
        console.error("Vector must have the same length, if you want to get the scalar product between them");
    }
    var soma = 0;
    for (var i = 0; i < V1.length; i++)
        soma += V2[i] * V1[i];

    return soma;
};

function addID(DOM, sceneGraph, ArrayOfIDs, newID) {
    var tempIdStorage;
    if (newID == undefined)
        tempIdStorage = sceneGraph.reader.getString(DOM, "id", -1);
    else
        tempIdStorage = newID;

    if (ArrayOfIDs == undefined) {
        ArrayOfIDs = [];
    }
    var arrayLength = ArrayOfIDs.length;


    if (tempIdStorage == -1) {
        sceneGraph.onXMLWarn("No id found the following id will be used: " + "MachineGeneratedID" + "_" + arrayLength);
        tempIdStorage = ("MachineGeneratedID" + arrayLength);
    }

    var i = 0;
    do {
        if (ArrayOfIDs.indexOf(tempIdStorage) == -1) {
            //console.log("ID: " + tempIdStorage + " added");
            ArrayOfIDs.push(tempIdStorage);
            break;
        } else {
            tempIdStorage = "MachineGeneratedID" + "_" + i;
            sceneGraph.onXMLWarn("ID already in use, new ID ( " + tempIdStorage + " ) will be used");
        }
        i++;
    }
    while (tempIdStorage != -1);

    return tempIdStorage;
};

function readElement(DOM, elementToRead, DOMnumberOfElements) {

    if (DOM == undefined)
        return [];
    var size = elementToRead.length;
    var returnValues = [];

    if (DOM.length > DOMnumberOfElements) {
        console.warn("More than " + DOMnumberOfElements + " " + DOM.nodeName + " default protocol will be followed");
    }
    for (var j = 0; j < DOMnumberOfElements; j++) {
        for (var i = 0; i < size; i++) {

            var tempValue = DOM[j].attributes.getNamedItem(elementToRead[i]);
            if (tempValue != null)
                returnValues.push(tempValue.value);
        }
    }
    return returnValues;
};

function parseFrustum(initials, currElement) {

    initials.setNear(Number(readElement([currElement], ["near"], 1)));

    if (initials.getNear() == ERROR) {
        this.onXMLWarn("No value found using default value: 0");
        initials.setNear(0);
    }
    initials.setFar(Number(readElement([currElement], ["far"], 1)));
    if (initials.getFar() == ERROR) {
        this.onXMLWarn("No value found using default value: 1");
        initials.setFar(1);
    }
};

function parseAxisLength(initials, currElement) {
    initials.setAxisLength(readElement([currElement], ["length"], 1));
};

function parseNodeTransformation(node, element, Transformation) {

    for (var i = 0; i < element.length; i++) {
        if (element[i].nodeName == "ROTATION") {
            Transformation.parseRotate(element[i]);
        } else
        if (element[i].nodeName == "TRANSLATION") {
            Transformation.parseTranslate(element[i]);

        } else if (element[i].nodeName == "SCALE") {
            Transformation.parseScale(element[i]);
        }
    }
};
