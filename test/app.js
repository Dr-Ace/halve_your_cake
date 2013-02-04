////////Parse the input for Quantity, Unit, Ingredien////////

// regular expression to determine if there is a fraction in the string
function getFrac(line) {
	var exp = new RegExp("[1-9]+/[1-9]+|[\u00BC-\u00BE]|[\u2150-\u215E]");
	var result = exp.exec(line);
	var ans = null;
	// does fraction exist?
	if(result !== null) {
		var text = result[0];
		var startIndex = result.index;
		var lastindex = startIndex + text.length - 1;
		var num = den = 1; // 1/1 is a good initializer for a frac 
		// single char means it is a UNICODE Char
		if(text.length === 1) {
			var fracInfo = convertUnicodeFraction(text);
			num = fracInfo.num;
			den = fracInfo.den;
			// text = fracInfo.text;
		} else {
			var fracInfo = splitTextFraction(text);
			num = fracInfo.num;
			den = fracInfo.den;
		}
		ans = {"num": num, "den": den, "text": text, "startIndex": startIndex, "endIndex": lastindex};
	}
	return ans;
}

function splitTextFraction(text) {
	var fracInfo =text.match(/[1-9]+/g);
	num = parseInt(fracInfo[0]);
	den = parseInt(fracInfo[1]);
	return {"num": num, "den": den, "text": text};
}

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
	return(vulgar[char])
}

//Depercated
function getFracIndex(line) {
	return getFrac(line).endIndex
}


// return the index of the number in the line
function getNumb(line) {
	var num = new RegExp("[0-9]+");
	var result = num.exec(line);
	var ans = null;
	if(result !== null) {
		var lastindex = result.index + result[0].length - 1;
		ans = {"value": parseInt(result[0]), "text": result[0], "startIndex": result.index, "endIndex": lastindex};
	}
	return ans;
}

// extract the number and/or fraction at the beginning of the line and assign it to var quantity

function getQuantityIndex(line){
	var fracLastIndex = -1;
	var numbLastIndex = -1;
	var quantityLastIndex = -1;
	var fracInfo = getFrac(line);
	if (fracInfo != null) {
		fracLastIndex = fracInfo.endIndex;
	}

	var wholeNumInfo = getNumb(line);
	if (wholeNumInfo != null) {
		numbLastIndex =  wholeNumInfo.endIndex;
	}
	quantityLastIndex = Math.max(fracLastIndex,numbLastIndex);
	return quantityLastIndex;
}

function getQuantity(line) {
	var quantityLastIndex = getQuantityIndex(line)+1;
	var quantity = line.slice(0,quantityLastIndex);
	return quantity;
}

function removeQuantity(line){
	var quantityLastIndex = getQuantityIndex(line) +1;
	var noQuant = line.slice(quantityLastIndex,line.length);
	noQuant = noQuant.replace(/(^[\s]+)/, '');  //remove space at beginning of line
	var ar = noQuant.split(" ");
	return ar;
	}

function getUnit(line){
	var noQuant = removeQuantity(line);
	return noQuant[0]
}

function getIngredient(line){
	var noQuant = removeQuantity(line);
	var ingredientAr = noQuant.slice(1,noQuant.length);
	var ingredient = ingredientAr.join(" ");
	return ingredient;
}


function StandardizeUnit(unit) {
 var result = "";
 // T by itself is case sesitive.
 if(unit != "T") {
   unit = unit.toLowerCase();
 }
 switch(unit) {
     case "cups":
     case "cup":
     case "c":
         result = "cup";
         break;
     case "teaspoon":
     case "teaspoons":
     case "tsp":
     case "t":
         result = "teaspoon";
         break;
     case "tablespoon":
     case "tablespoons":
     case "tbs":
	 case "tbsp":
     case "T":
         result = "tablespoon";
         break;
     case "fluid ounce":
     case "fluid oz":
         result = "fluidOunce";
         break;
     case "pint":
     case "pt":
         result = "pint";
     case "quart":
     case "qt":
         result = "quart";
         break;
     case "gallon":
     case "gl":
         result = "gallon";
         break;
     default:
         result = "unknown"
 }
 return result;
}


function getUnitList(quantity) {
	var orderUnits = [
	{qts: 1,  unit: "teaspoon", amount: "1/4"},
	{qts: 2,  unit: "teaspoon", amount: "1/2"},
	{qts: 4,  unit: "teaspoon", amount: "1"},
	//{qts: 6,  unit: "tablespoon", amount: "1/2"},
	{qts: 12,  unit: "tablespoon", amount: "1"},
	// {qts: 24, unit: "fluidOunce", amount: "1"},
	{qts: 48, unit: "cup", amount: "1/4"},
	{qts: 64, unit: "cup", amount: "1/3"},
	{qts: 96, unit: "cup", amount: "1/2"},
	{qts: 128, unit: "cup", amount: "2/3"},
	{qts: 144, unit: "cup", amount: "3/4"},
	{qts: 192, unit: "cup", amount: "1"}
	// {qts: 384, unit: "pint", amount: "1"},
	// {qts: 3072, unit: "gallon", amount: "1"},
	//{qts: 999999, unit: "ass_load", amount: "1"}
	];

	unitsList = [];

	// Chose the smaller unit that the quantity is inbetween.
	// Find out how many of those units are contained in that quantity.
	// Subtract number of units from total quantity.
	// Repeat until you have no quantity left.
	while(quantity >= 1) {
	// if the largest unit can't be found in the for loop, assume it's the largest unit
	var largestUnit = orderUnits[orderUnits.length - 1];
		for (var i = 0; i < orderUnits.length; i++) {
			if(orderUnits[i].qts >= quantity) {
				// if not equal it must be between previous largest unit.
				var unitIdx = orderUnits[i].qts === quantity ? i : i - 1;
				largestUnit = orderUnits[unitIdx];
				break;
			}
		};
	// subtract the largest unit from the quantity and do the exercise again with the remainder.
		var numberOfUnits = Math.floor(quantity/largestUnit.qts);
		var numberOfQts = numberOfUnits * largestUnit.qts;
		var printedAmount = isFraction(largestUnit.amount) ? largestUnit.amount : ""+numberOfUnits;
		var newAmount = {qts: numberOfQts, unit: largestUnit.unit, amount: printedAmount};
		console.log(newAmount);
		unitsList.push(newAmount);
		quantity -= numberOfQts;
	}
	
	return unitsList;
}

function combineLikeUnits(unitsList) {
	console.log(unitsList)
	var combinedUnits = [];
	for (var i=0; i<unitsList.length; i++) {
		var currentUnit = unitsList[i];
		var nextUnit = unitsList[i+1];
		console.log("for loop is running")
		console.log ("currentUnit: " + currentUnit + ", nextUnit: " + nextUnit);

		if (nextUnit != null && currentUnit.unit == nextUnit.unit) {
			console.log("units are the same")
			var combinedItem = {qts: (currentUnit.qts + nextUnit.qts), amount: currentUnit.amount+ " "+nextUnit.amount, unit: currentUnit.unit};
			console.log(combinedItem)
			combinedUnits.push(combinedItem);
			i++; //HACKISH: we already dealt with the next unit skip it next time around.
		} else {
			// save unit that does not match
			combinedUnits.push(currentUnit);
		}
	}
	return combinedUnits;
}

function format(combinedUnits) {
	if(combinedUnits == null || combinedUnits.length === 0) {
		return "";
	}

	formattedString = "";
	// don't process last element. each needs a "," expect last one.
	for (var i = 0; i < combinedUnits.length-1; i++) {
		formattedString += (combinedUnits[i].amount + " " + combinedUnits[i].unit) + ", ";
	};
	var lastElement = combinedUnits.length-1;
	formattedString += combinedUnits[lastElement].amount + " " + combinedUnits[lastElement].unit;
	return formattedString;
}



//////////// older work


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





