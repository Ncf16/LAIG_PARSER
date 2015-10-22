function validadeNumber(numberToBeValidated, validationFunction) {
    return validationFunction(numberToBeValidated);

};

function stringArrayToNumber(array, nameOfType, lowerLimit, upperLimit, converter) {
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

function parseLeafAux(leave, type) {
    if (type == "rectangle") {
        return new LeafRectangle();
    } else if (type == "triangle") {
        return new LeafTriangle();
    } else if (type == "cylinder") {
        return new LeafCylinder();
    } else if (type == "sphere") {
        return new LeafSphere();
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
    return [

        V2[1] * V1[2] - V2[2] * V1[1],
        V2[2] * V1[0] - V2[0] * V1[2],
        V2[0] * V1[1] - V2[1] * V1[0]

    ];
};

function scalarProduct(V1, V2) {

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