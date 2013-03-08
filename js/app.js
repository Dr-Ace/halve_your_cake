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
		// ans = {"value": (num/den) ,"num": num, "den": den, "text": text, "start": startIndex, "end": lastindex};
		ans = {"num": num, "den": den, "text": text, "start": startIndex, "end": lastindex};
	}
	return ans;
}

function splitTextFraction(text) {
	var fracInfo = text.toString().match(/[1-9]+/g);
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
		var endIndex= result.index + result[0].length - 1;
		var nextChar = line.charAt(endIndex+1)
		// double check to see if not a fraction
		if(nextChar != '/') {
			ans = {"value": parseInt(result[0]), "text": result[0], "start": result.index, "end": endIndex};	
		}
	}
	return ans;
}

function getQuantityInfo(line){
	var wholeNumStartIndex = -1;
	var wholeNumbEndIndex  = -1;
	var wholeNumInfo = findFirstWholeNumber(line);
	if (wholeNumInfo != null) {
		wholeNumStartIndex = wholeNumInfo.start;
		wholeNumbEndIndex =  wholeNumInfo.end;
	};

	var fracStartIndex = -1
	var fracEndIndex  = -1;
	var fracInfo = getFrac(line);
	if (fracInfo != null) {
		fracEndIndex = fracInfo.end;
		fracStartIndex = fracInfo.start;
	};

	// if a whole number and a fraction are present
	// characters between the whole number and the fraction can only be spaces
	// also no more then 5 spaces between them
	if (fracInfo !== null && wholeNumInfo !== null
		&& (fracInfo.start - wholeNumInfo.end) > 5
		&&	!isBlank(line.slice(wholeNumInfo.end+1, fracInfo.start))
		) {
		console.log("fraction and whole number are NOT adjacent");
		fracEndIndex = -1;
		fracStartIndex = -1;
	}

	var quantityStartIndex = Math.min(fracStartIndex, wholeNumStartIndex);
	// if either fraction or wholeNumber is not present
	// then the MAX will report the starting position of the one that exists
	if(fracStartIndex === -1 || wholeNumStartIndex === -1) {
		quantityStartIndex = Math.max(fracStartIndex, wholeNumStartIndex);
	}

	var quantityEndIndex = Math.max(fracEndIndex, wholeNumbEndIndex);
	var text = line.slice(quantityStartIndex, quantityEndIndex+1);
	// return {"value": 2.5, "improperFraction":{"numerator":7, "denominator":3}, "text": text, "start":quantityStartIndex, "end":quantityEndIndex};
	return {"text": text, "start":quantityStartIndex, "end":quantityEndIndex};
}

// function getQuantity(line) {
// 	var quantityStartIndex = getQuantityInfo(line).start;
// 	var quantityEndIndex = getQuantityInfo(line).end;
// 	var quantity = line.slice(quantityStartIndex,quantityEndIndex);
// 	console.log("quantity: "+quantity);
// 	return quantity;
// }

// used only if unit is unkown
function removeQuantity(line){
	var quantityInfo = getQuantityInfo(line);
	var noQuant = line.slice(quantityInfo.end + 1);
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

// function getUnit2(line){
// 	var quantityInfo = getQuantityInfo(line);
// 	var afterQuantity = line.slice(quantityInfo.end, line.length);
// 	var words = line.split(" ");
// 	return words[0];
// }

function getUnitInfo(line, quantityInfo){
	var afterQuantity = line.slice(quantityInfo.end + 1).trim();
	var words = afterQuantity.split(" ");
	var potentialUnit = words[0];
	// see if unit is a standard unit
	var unit = standardizeUnit(potentialUnit);
	if(unit === "unknown") {
		return {"text": "", "start":-1, "end":-1, "unit": "unknown"};
	}

	var unitStartIndex = line.search(potentialUnit);
	var unitEndIndex = unitStartIndex + potentialUnit.length;
	return {"text": potentialUnit, "start":unitStartIndex, "end":unitEndIndex, "unit": unit};
}

function getIngredient(line, quantityEndIndex, unitEndIndex){
	var end = Math.max(quantityEndIndex, unitEndIndex);
	return line.slice(end + 1).trim();
}


function standardizeUnit(unit) {
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
	{qts: 3,  unit: "teaspoon", amount: "3/4"},
	{qts: 4,  unit: "teaspoon", amount: "1"},
	// {qts: 6,  unit: "tablespoon", amount: "1/2"},
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
	// {qts: 3072, unit: "gallon", amount: "1"}
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
	if (standardUnit === "unkown"){
		return "";
	}
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

	var enteredQtQuantity = wholeNumQts + fracQts;
	return enteredQtQuantity;
};

function getUnitList(enteredQtQuantity) {
	unitsList = [];

	// Chose the smaller unit that the quantity is inbetween.
	// Find out how many of those units are contained in that quantity.
	// Subtract number of units from total quantity.
	// Repeat until you have no quantity left.
	while(enteredQtQuantity >= 1) {
	// if the largest unit can't be found in the for loop, assume it's the largest unit
	var largestUnit = _orderUnits[_orderUnits.length - 1];
		for (var i = 0; i < _orderUnits.length; i++) {
			if(_orderUnits[i].qts >= enteredQtQuantity) {
				// if not equal it must be between previous largest unit.
				var unitIdx = (_orderUnits[i].qts === enteredQtQuantity) ? i : i - 1;
				largestUnit = _orderUnits[unitIdx];
				break;
			}
		};
	// subtract the largest unit from the quantity and do the exercise again with the remainder.
		var numberOfUnits = Math.floor(enteredQtQuantity/largestUnit.qts);
		var numberOfQts = numberOfUnits * largestUnit.qts;
		var printedAmount = isFraction(largestUnit.amount) ? largestUnit.amount : ""+numberOfUnits;
		var newAmount = {qts: numberOfQts, unit: largestUnit.unit, amount: printedAmount};
		// console.log(newAmount);
		unitsList.push(newAmount);
		enteredQtQuantity -= numberOfQts;
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
			var combinedItem = {qts: (currentUnit.qts + nextUnit.qts), 
								amount: currentUnit.amount+ " "+nextUnit.amount, 
								unit: currentUnit.unit};
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
// take the fraction value from the selected 'option' element, 
// convert it into an object containing two integers, and multiply the qts by the "fraction"
// function multiplyRecipe(line, factor){
// 	console.log("multiplyRecipe has been called");
// 	var qtQuantity = convertToQts(line);	
// 	return((qtQuantity*numerator)/denominator);		
// }

function simplifyFrac(numerator, denominator){
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
		return wholeNum;
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

function multiplyQuantity (quantityInfo, factor) {
	var num = quantityInfo.improperFraction.numerator * factor.numerator;
	var den = quantityInfo.improperFraction.denominator * factor.denominator;
	console.log(simplifyFrac(num, den));
}

function multiplyIngredient(line, factor) {
	// if the line is blank, do not process
	if(isBlank(line)) {
		// console.log("input should not be an empty line: "+line);
		return "";
	}
	// if there is a "read more" link at the end of your paste text (epicurious), do not process
	else if(/http|\/\/www./.test(line)){
		return line;
	}
	//if there's a fraction in the entered quantity
	if(getFrac(line) ==! null) {

		// console.log("quantity: "+getQuantity(line)+" has a fraction");
	}
	var splitFactor = splitTextFraction(factor);
	var fractorNumerator = splitFactor.num;
	var fractorDenominator = splitFactor.den;
	var enteredQuantityInfo = getQuantityInfo(line);	
	console.log(enteredQuantityInfo);
	var unitInfo = getUnitInfo(line, enteredQuantityInfo);
	console.log(unitInfo);
	var unit = standardizeUnit(unitInfo.text);
	var ingredient = getIngredient(line, enteredQuantityInfo.end, unitInfo.end);
	console.log(">>> qty: '"+enteredQuantityInfo.text+"', unit: '"+unit+"', ingredient: '"+ingredient+"'");
	var printedResult = ""
	var total = ""
	// if the line is not an ingredient (a lable or irrelevent line)
	if(unit === "unknown" && enteredQuantityInfo.text === "") {
		return line;
	}
	else if(unit == "unknown") {
		// var enteredQuantity = getQuantity(line);
		// var noQuant = removeQuantity(line);
		// var ingredient = noQuant.join(" ");
		// var ingredient = line.slice(getQuantityInfo(line).end+1)
		//if the enteredQuantity contains a fraction it needs to be converted into something that can be multiplied

		if(getFrac(enteredQuantityInfo.text) !== null){
			// if there is also a whole number, retreive that as well
			var wholeNum = findFirstWholeNumber(line);
			if (wholeNum !== ""){
				wholeNum *= parseInt(enteredQuantityInfo.text);
			}
			var splitFrac = splitTextFraction(enteredQuantityInfo.text);
			var newNum = splitFrac.num * fractorNumerator;
			var newDen = splitFrac.den * fractorDenominator;
			total = simplifyFrac(newNum, newDen);
			// if(wholeNum !== ""){
			// 	printedResult = wholeNum+" "+total +" "+ ingredient;
			// }
			// else {
				printedResult = total +" "+ ingredient;
			// }
		}
		else {
			total = simplifyFrac((enteredQuantityInfo.text*fractorNumerator), fractorDenominator);
			console.log("quantity has no fraction, ingredient: "+ingredient+", total: "+total)
			printedResult = total+" "+ingredient;
		};
	} else {
		var qtQuantity = convertToQts(enteredQuantityInfo.text, unit);	
		var totalQts = (qtQuantity*fractorNumerator)/fractorDenominator;	
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
		console.log("----- start: "+lines[i] + " -----------");
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
	
