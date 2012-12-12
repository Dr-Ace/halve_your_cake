
// regular expression to determine if there is a fraction in the string
function getFrac(line) {
	var exp = new RegExp("[1-9]+/[1-9]+|[\u00BC-\u00BE]|[\u2150-\u215E]");
	var result = exp.exec(line);
	var ans = null;
	if(result !== null) {
		var lastindex = result.index + result[0].length - 1;
		ans = {"text": result[0], "startIndex": result.index, "endIndex": lastindex};
	}
	return ans;
}

function getFracIndex(line) {
	return getFrac(line).endIndex
}


// return the index of the number in the line
function getNumb(line) {
	var num = new RegExp("[0-9]+");
	var result = num.exec(line);
	var numIndex = null;
	if(result !== null) {
		var lastindex = result.index + result[0].length - 1;
		numIndex = {"text": result[0], "startIndex": result.index, "endIndex": lastindex};
	}
	return numIndex;
}

// extract the number and/or fraction at the beginning of the line and assign it to var quantity

function getQuantityIndex(line){
	var fracLastIndex = -1
	var numbLastIndex = -1
	var quantityLastIndex = -1
	if (getFrac(line) != null) {
		fracLastIndex = getFrac(line).endIndex;
	}
	if (getNumb(line) != null) {
		numbLastIndex = getNumb(line).endIndex;
	}
	quantityLastIndex = Math.max(fracLastIndex,numbLastIndex);
	return quantityLastIndex;
}

function getQuantity(line) {
	var quantityLastIndex = getQuantityIndex(line)+1;
	var quantity = line.slice(0,quantityLastIndex);
	return quantity;
}

function getUnit(line){
	var quantityLastIndex = getQuantityIndex(line) +1;
	var noQuant = line.slice(quantityLastIndex,line.length);
	console.log(noQuant);
}




// parse the value of the vulgar fraction
function convertUnicodeFraction(char) {
	var vulgar = {
		"¼": {"num": 1, "den": 4, "text": "1/4"},
		"½": {"num": 1, "den": 2, "text": "1/2"},
		"¾": {"num": 3, "den": 4, "text": "3/4"},
		"⅓": {"num": 1, "den": 3, "text": "1/3"},
		"⅔": {"num": 2, "den": 3, "text": "2/3"},
		"⅕": {"num": 1, "den": 5, "text": "1/5"},
		"⅖": {"num": 2, "den": 5, "text": "2/5"},
		"⅗": {"num": 3, "den": 5, "text": "3/5"},
		"⅘": {"num": 4, "den": 5, "text": "4/5"},
		"⅙": {"num": 1, "den": 6, "text": "1/6"},
		"⅚": {"num": 5, "den": 6, "text": "5/6"},
		"⅛": {"num": 1, "den": 8, "text": "1/8"},
		"⅜": {"num": 3, "den": 8, "text": "3/8"},
		"⅝": {"num": 5, "den": 8, "text": "5/8"},
		"⅞": {"num": 7, "den": 8, "text": "7/8"}
	};
	return vulgar[char];
}









//////////// older work


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
	for (i=0; i<ln.length; i++) {

	if(isFraction(ln[0])) {
		log("first");
		}
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
	return ((isUnicodeFraction(line)) || (isFraction(line)));
}


function isUnit(line) {
	return ((!isUnicodeFraction(line)) && (!isFraction(line)));
}



//find the first item in the "line" array that is not a number or a fraction





