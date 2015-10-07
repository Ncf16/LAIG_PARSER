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
			array[i] /= converter;
			console.warn("Use values of " + nameOfType + " between" + lowerLimit + " and " + upperLimit + array[i] * converter + " and now it is: " + array[i]);
		}
	}
	return array;
};

function parseLeafAux(leave, type) {
	if (type == "rectangle") {
		console.log("correct");
		return new LeafRectangle();
	} else if (type == "triangle") {
		return new LeafTriangle();
	} else if (type == "cylinder") {
		return new LeafCylinder();
	} else if (type == "sphere") {
		return new LeafSphere();
	} else {
		console.log("Invalid type of Leaf: " + type);
	}


};

function crossProduct(V1, V2) {
	return [
		V2[2] * V1[0] - V2[0] * V1[2],
		V2[1] * V1[2] - V2[2] * V1[1],
		V2[0] * V1[1] - V2[1] * V1[0]

	];
};

function scalarProduct(V1, V2) {
	return V2[0] * V1[0] + V2[1] * V1[1] + V2[2] * V1[2];
}

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
			console.log("ID: " + tempIdStorage + " added");
			ArrayOfIDs.push(tempIdStorage);
			break;
		} else {
			tempIdStorage = "MachineGeneratedID" + "_" + i;
			sceneGraph.onXMLWarn("LightID already in use, new ID ( " + tempIdStorage + " ) will be used");
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

function degToRad(angle) {

	return (Math.PI * Number(angle)) / 180;
}

function parseRotate(graph, initials, currElement) {
	var rot = readElement([currElement], ["axis", "angle"], 1);
	var temp = rot[0];
	switch (temp) {
		case "x":
			{
				mat4.rotate(graph.matrix, graph.matrix, degToRad(rot[1]), [1, 0, 0]);
				AxisX = true;
				break;
			}
		case "y":
			{
				mat4.rotate(graph.matrix, graph.matrix, degToRad(rot[1]), [0, 1, 0]);
				AxisY = true;
				break;
			}
		case "z":
			{
				mat4.rotate(graph.matrix, graph.matrix, degToRad(rot[1]), [0, 0, 1]);
				AxisZ = true;
				break;
			}
		default:
			console.warn("Invalid Axis in Rotation: " + rot);
	}
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


/*
function parseTranslate(graph, initials, currElement) {

    var translation = stringArrayToNumber(readElement([currElement], ["x", "y", "z"], 1), "translate", "inf", "inf", 1);
    console.log(graph.matrix);

    mat4.translate(graph.matrix, graph.matrix, vec3.fromValues(translation[0], translation[1], translation[2]));
    console.log("translate: " + graph.matrix);
};

function parseScale(graph, initials, currElement) {
    var scale = stringArrayToNumber(readElement([currElement], ["sx", "sy", "sz"], 1), "scaleFactor", "inf", "inf", 1);
    mat4.scale(graph.matrix, graph.matrix, vec3.fromValues(scale[0], scale[1], scale[2]));

    console.log("Scale: " + graph.matrix);
};
*/