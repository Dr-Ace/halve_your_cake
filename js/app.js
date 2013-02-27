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
function findFirstWholeNumber(line) {
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

	var wholeNumInfo = findFirstWholeNumber(line);
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

// function removeQuantity(line){
// 	var lineItems = line.split(" ");
// 	console.log(lineItems);
// 	for (var i = 0; i < lineItems.length; i++) {
// 		if(getFrac(lineItems[i]) || getNumb(lineItems[i])) {
// 			console.log(i+" is a number or fraction");
// 			lineItems = lineItems.splice(i, 1);
// 		};
// 	};
// 	return lineItems;	
// }

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
	// {qts: 96, unit: "stick", amount: "1"},
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

function convertToQts(quantityStr, standardUnit) {
	var fracQts = 0;
	var fracObj = getFrac(quantityStr);
	if (fracObj !== null) {
		var fracQuantityStr = fracObj.num + "/" + fracObj.den
		var fracUnit = lookupUnit(fracQuantityStr, standardUnit);
		// check if the unit exists
		if(fracUnit !== null) {
			fracQts = fracUnit.qts;
		}
	}
	
	var wholeNumQts = 0;
	var wholeNumQuanity = findFirstWholeNumber(quantityStr);
	if(wholeNumQuanity !== null) {
		// lookupUnit does not include amounts greater than one
		// amounts greater than one must be set to "1" to match the appropriate unit
		// then the number of qts will be multiplied by the amount greater than one
		var wholeNumUnit = lookupUnit("1", standardUnit);
		// check if the unit exists
		if(wholeNumUnit !== null) {
			wholeNumQts = wholeNumUnit.qts * wholeNumQuanity.value;
		}
	}

	var qtQuantity = wholeNumQts + fracQts;
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
	var hasNum = !isNaN(parseInt(fracPieces[0]))
	var hasDom = !isNaN(parseInt(fracPieces[1]))
	return isVul || (hasSlash && hasNum && hasDom);
}

// check to see if it is a unicode vulgar fraction
function isUnicodeFraction(char) {
	var unicode = char.charCodeAt(0);
	return ((unicode >= 188 && unicode <= 190) || (unicode >= 8531 && unicode <= 8542))
}

// process the text input by seperating the quantity and ingredient and converting into qts.
// take the fraction value from the selected 'option' element, convert it into an object containing two integers, and multiply the qts by the "fraction"
// function multiplyRecipe(line, factor){
// 	console.log("multiplyRecipe has been called");
// 	var qtQuantity = convertToQts(line);	
// 	return((qtQuantity*numerator)/denominator);		
// }

function simplifyFrac(fraction){
	var numerator = splitTextFraction(fraction).num;
	var denominator = splitTextFraction(fraction).den;
	// if it is an improper fraction (greater than one)
	var wholeNum = Math.floor(numerator/denominator);
	var numerator = (numerator%denominator);
	// if the fraction can be simplified
	var x = [10,9,8,7,6,5,4,3,2];
	for (var i = 0; i < x.length; i++) {
		if(numerator%x[i] === 0 && denominator%x[i] === 0){
			numerator /= x[i];
			denominator /= x[i];
			break;
		};
	};
	if (numerator === 0){
		return wholeNum
	}
	else if(wholeNum !== 0) {
		return wholeNum +" "+numerator+"/"+denominator;
	}
	else{
		return numerator+"/"+denominator;
	}
};

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function multiplyIngredient(line, factor) {
	if(isBlank(line)) {
		console.log("input should not be an empty line: "+line);
		return "";
	}
	var seperateFraction = factor.split("/");
	var numerator = parseInt(seperateFraction[0]);
	var denominator = parseInt(seperateFraction[1]);
	var quantity = getQuantity(line);
	var unit = StandardizeUnit(getUnit(line));
	var printedResult = ""
	var total = ""
	if(unit === "unknown" && quantity === "") {
		return line;
	}
	else if(unit == "unknown") {
		// var quantity = getQuantity(line);
		var noQuant = removeQuantity(line);
		var ingredient = noQuant.join(" ");
		//if the quantity is a fraction it needs to be converted into something that can be multiplied
		if(getFrac(line) !== null){
			// console.log(ingredient+": unit is unkown and there is a fraction in the quantity")
			var newNum = splitTextFraction(quantity).num * numerator;
			var newDen = splitTextFraction(quantity).den * denominator;
			total = newNum + "/" + newDen;
			printedResult= total +" "+ ingredient;
		}
		else {
			total = simplifyFrac((quantity*numerator)+"/"+denominator);
			console.log("ingredient: "+ingredient+", total: "+total)
			printedResult = total+" "+ingredient;
		};
	} else {
		var ingredient = getIngredient(line);
		var qtQuantity = convertToQts(quantity, unit);	
		var totalQts = (qtQuantity*numerator)/denominator;	
		var unitList = getUnitList(totalQts);
		var convertedResult = combineLikeUnits(unitList);
		printedResult = format(convertedResult) + " " + ingredient;
	}
	return printedResult;
}

function multiplyRecipe(textBlock, factor) {
	var result = [];
	lines = textBlock.split("\n");
	for (var i = 0; i < lines.length; i++) {
		if (!isBlank(lines[i])){
			result.push(multiplyIngredient(lines[i], factor));
		}
		else {
			// leave in line breaks to perserve the orginal format
			result.push("");
		}
	};
	return result;
}
	
