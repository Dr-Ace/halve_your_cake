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

var convertUnicodeFraction = (function() {
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

	return function(char) {
		return(vulgar[char])
	};
})();

// return the index of the number in the line
//TODO: rename to something more explicit
function getNumb(line) {
	var num = new RegExp("[0-9]+");
	var result = num.exec(line);
	var ans = null;

	if(result !== null) {
		var lastindex = result.index + result[0].length - 1;
		var nextChar = line.charAt(lastindex+1)
		// double check to see if not a fraction
		if(nextChar != '/') {
			ans = {"value": parseInt(result[0]), "text": result[0], "startIndex": result.index, "endIndex": lastindex};	
		}
	}
	return ans;
}

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
	quantityLastIndex = Math.max(fracLastIndex,numbLastIndex) +1;
	return quantityLastIndex;
}

function getQuantity(line) {
	var quantityLastIndex = getQuantityIndex(line);
	var quantity = line.slice(0,quantityLastIndex);
	return quantity;
}

function removeQuantity(line){
	var quantityLastIndex = getQuantityIndex(line);
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

var _orderUnits = [
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

function lookupUnit(amount, unit) {
		for (var i = 0; i < _orderUnits.length; i++) {
		if (_orderUnits[i].unit == unit && _orderUnits[i].amount == amount) {
			return _orderUnits[i];
		};
	};
	return null;
};

function convertToQts(line) {
	var qtQuantity = 0;
	var standardUnit = StandardizeUnit(getUnit(line));
	
	// var recipeQuantity = getQuantity(line);
	var quantity = getQuantity(line);

	var fracQts = 0;
	var fracObj = getFrac(line);
	if (fracObj !== null) {
		quantity = fracObj.num + "/" + fracObj.den
		var fracUnit = lookupUnit(quantity, standardUnit);
		// check if the unit exists
		if(fracUnit !== null) {
			fracQts = fracUnit.qts;
		}
	}
	
	var wholeNumQts = 0;
	var wholeNumQuanity = getNumb(line);
	if(wholeNumQuanity !== null) {
		var wholeNumUnit = lookupUnit("1", standardUnit);
		// check if the unit exists
		if(wholeNumUnit !== null) {
			wholeNumQts = wholeNumUnit.qts * wholeNumQuanity.value;
		}
	}
	qtQuantity = wholeNumQts + fracQts;
	// console.log(">> "+wholeNumQts +" + "+fracQts+" = "+ qtQuantity);
	return qtQuantity;
};

function getUnitList(quantity) {
	unitsList = [];

	// Chose the smaller unit that the quantity is inbetween.
	// Find out how many of those units are contained in that quantity.
	// Subtract number of units from total quantity.
	// Repeat until you have no quantity left.
	while(quantity >= 1) {
	// if the largest unit can't be found in the for loop, assume it's the largest unit
	var largestUnit = _orderUnits[_orderUnits.length - 1];
		for (var i = 0; i < _orderUnits.length; i++) {
			if(_orderUnits[i].qts >= quantity) {
				// if not equal it must be between previous largest unit.
				var unitIdx = (_orderUnits[i].qts === quantity) ? i : i - 1;
				largestUnit = _orderUnits[unitIdx];
				break;
			}
		};
	// subtract the largest unit from the quantity and do the exercise again with the remainder.
		var numberOfUnits = Math.floor(quantity/largestUnit.qts);
		var numberOfQts = numberOfUnits * largestUnit.qts;
		var printedAmount = isFraction(largestUnit.amount) ? largestUnit.amount : ""+numberOfUnits;
		var newAmount = {qts: numberOfQts, unit: largestUnit.unit, amount: printedAmount};
		// console.log(newAmount);
		unitsList.push(newAmount);
		quantity -= numberOfQts;
	}
	
	return unitsList;
}

function combineLikeUnits(unitsList) {
	// console.log(unitsList)
	var combinedUnits = [];
	for (var i=0; i<unitsList.length; i++) {
		var currentUnit = unitsList[i];
		var nextUnit = unitsList[i+1];
		// console.log("for loop is running")
		// console.log ("currentUnit: " + currentUnit + ", nextUnit: " + nextUnit);

		if (nextUnit != null && currentUnit.unit == nextUnit.unit) {
			// console.log("units are the same")
			var combinedItem = {qts: (currentUnit.qts + nextUnit.qts), amount: currentUnit.amount+ " "+nextUnit.amount, unit: currentUnit.unit};
			// console.log(combinedItem)
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
	formattedString = combinedUnits[0].amount + " " + combinedUnits[0].unit;
	for (var i = 1; i < combinedUnits.length; i++) {
		formattedString += ", " + combinedUnits[i].amount + " " + combinedUnits[i].unit;
	};
	return formattedString;
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

function isUnit(line) {
	return ((!isUnicodeFraction(line)) && (!isFraction(line)));
}



//find the first item in the "line" array that is not a number or a fraction



function doit(line) {
	console.log("line: " +line);
	var qtQuantity = convertToQts(line);
	var ingredient = getIngredient(line);
	var factor = 2;
	var unitList = getUnitList(factor * qtQuantity);
	// console.log(unitsList);
	var convertedResult = combineLikeUnits(unitList);
	console.log(convertedResult)
	// for (var i = 0; i < convertedResult.length; i++) {
	// 	convertedResult[i].amount +" "+ convertedResult[i].unit
	// };
	var printedResult = format(convertedResult) + " " + ingredient;
	return printedResult;
}

function doAllLines(textBlock) {
	var result = [];
	for (var i = 0; i < textBlock.length; i++) {
		result[i] = doit(textBlock[i]); // convert each line
	};
	return result;
}

