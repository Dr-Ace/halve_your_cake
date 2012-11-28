// parse for "number" "unit" "ingredient"

/*
function getQuantity(line){
	// console.log(line);
	var ln = line.split(' ');
	//extract the number from the beginning of the string and convert it to a number
	var numb = parseInt(ln[0]);
	var numbString = numb.toString();
	// check if there are units in ln[0], or if it is really just a number
	var units = ""
	var ingredient = ""
	if (numbString !== ln[0]) {
		console.log(line);
		var digits = numbString.length;
		units = ln[0].slice(digits, ln[0].length);
		ingredient = ln[1]
	} 
	else {
		units = ln[1];
		ingredient = ln[2];
	}
	return [numbString, units, ingredient];
}
*/



function getNumber(line) {
	var ln = line.split(' ');
	//extract the number from the beginning of the string and convert it to a number
	var numb = parseInt(ln[0]);
	if(isFraction(ln[0])) {
		log("first");
	}
	if(isFraction(ln[1])) {
		log("second");
	}

}

function isFraction(element) {
	var isVul = isUnicodeFraction(element);
	var hasSlash = element.indexOf('/') >= 0;
	var fracPieces = element.split('/');
	hasNum = !isNaN(parseInt(fracPieces[0]))
	hasDom = !isNaN(parseInt(fracPieces[1]))
	return isVul || (hasSlash && hasNum && hasDom);
}

// check to see if it is a unicode vulgar fraction
function isUnicodeFraction(char) {
	var unicode = char.charCodeAt(0);
	return ((unicode >= 188 && unicode <= 190) || (unicode >= 8531 && unicode <= 8542))
}

function indexOfCharFraction(line) {
	var index = -1;
	var ln = line.split(' ');
	for (i=0; i<ln.length; i++) {
		if (isUnicodeFraction(ln[i])) {
			index = i;
			break;
		}
	}
	return index;
}

function isQuantity(line) {
	
}


function isUnit(line) {
	return ((!isUnicodeFraction(line)) && (!isFraction(line)));
}

//find the first item in the "line" array that is not a number or a fraction




// check what the value of the vulgar fraction is
/*
function fractionValue(fraction) {
	
	var vulgar = [
		["¼", 1, 4],
		["½", 1, 2],
		["¾", 1, 2],
		["⅓", 1, 3],
		["⅔", 2, 3],
		["⅕", 1, 5],
		["⅖", 2, 5],
		["⅗", 3, 5],
		["⅘", 4, 5],
		["⅙", 1, 6],
		["⅚", 5, 6],
		["⅛", 1, 8],
		["⅜", 3, 8],
		["⅝", 5, 8],
		["⅞", 7, 8]
	]
}
*/

//

