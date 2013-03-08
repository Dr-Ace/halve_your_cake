test("return the fractions in the line", function() {
	deepEqual(getFrac("1/2 C flour"), {"num": 1, "den": 2, "text": "1/2", "start": 0, "end": 2}, "regular fraction");
	deepEqual(getFrac("1 C flour"), null, "one whole number is not a fraction");
	deepEqual(getFrac("one C flour"), null, "one whole number is not a fraction");
	deepEqual(getFrac("½ C flour"), {"num": 1, "den": 2, "text": "½", "start": 0, "end": 0}, "unicode fraction");
	deepEqual(getFrac("1 ½ C flour"), {"num": 1, "den": 2, "text": "½", "start": 2, "end": 2}, "one whole number and one unicode fraction");
	deepEqual(getFrac("1 1/2 C flour"), {"num": 1, "den": 2, "text": "1/2", "start": 2, "end": 4}, "one whole number and one regular fraction");
});

test("split text fraction", function() {
	deepEqual(splitTextFraction("1/2"), {"num": 1, "den": 2, "text": "1/2"}, "r1/2");
	deepEqual(splitTextFraction("2/3"), {"num": 2, "den": 3, "text": "2/3"}, "2/3");
	deepEqual(splitTextFraction("5/2"), {"num": 5, "den": 2, "text": "5/2"}, "5/2");
});

test("find the first whole number in the line", function() {
	deepEqual(findFirstWholeNumber("1 C flour"), {"value": 1, "text": "1", "start": 0, "end": 0}, "1 C flour");
	deepEqual(findFirstWholeNumber("at least 1 C flour"), {"value": 1, "text": "1", "start": 9, "end": 9}, "at least 1 C flour");
	deepEqual(findFirstWholeNumber("½ C flour"), null, "½ C flour");
	deepEqual(findFirstWholeNumber("1 ½ C flour"), {"value": 1, "text": "1", "start": 0, "end": 0}, "1 ½ C flour");
	deepEqual(findFirstWholeNumber("1 1/2 C flour"), {"value": 1, "text": "1", "start": 0, "end": 0}, "1 1/2 C flour");
	deepEqual(findFirstWholeNumber("2 1/2 C flour"), {"value": 2, "text": "2", "start": 0, "end": 0}, "2 1/2 C flour");
	deepEqual(findFirstWholeNumber("10 1/2 C flour"), {"value": 10, "text": "10", "start": 0, "end": 1}, "10 1/2 C flour");
	deepEqual(findFirstWholeNumber("1/2 C flour"), null, "1/2 C flour");
	deepEqual(findFirstWholeNumber("one C flour"), null, "one C flour");
});

test("get the quantity info, value and location", function() {
	deepEqual(getQuantityInfo("1/2 C flour"), {"text": "1/2", "start": 0, "end": 2}, "1/2 C flour");
	deepEqual(getQuantityInfo("1 1/2 C flour"), {"text": "1 1/2", "start": 0, "end": 4}, "1 1/2 C flour");
	deepEqual(getQuantityInfo("½ C flour"),{"text": "½", "start": 0, "end": 0}, "½ C flour");
	deepEqual(getQuantityInfo("1 C flour"), {"text": "1", "start": 0, "end": 0}, "1 C flour");
	deepEqual(getQuantityInfo("1 ½ C flour"), {"text": "1 ½", "start": 0, "end": 2}, "one whole number and one unicode fraction");
	deepEqual(getQuantityInfo(" 1 1/2 C flour"), {"text": "1 1/2", "start": 1, "end": 5}, "one whole number and one regular fraction");
});

//we need to replace this funciton
test("remove the quantity", function() {
	deepEqual(removeQuantity("1/2 C flour"), ["C", "flour"], "1/2 C flour");
	deepEqual(removeQuantity("1/2 Cup flour"), ["Cup", "flour"], "1/2 C flour");
	deepEqual(removeQuantity("½ C flour"), ["C", "flour"], "½ C flour");
	deepEqual(removeQuantity("½C sugar"), ["C", "sugar"], "½C flour");
	deepEqual(removeQuantity("1 Tbsp flour"), ["Tbsp", "flour"], "1 Tbsp flour");
	deepEqual(removeQuantity("1tsp flour"), ["tsp", "flour"], "1tsp flour");
	deepEqual(removeQuantity("1½ Tablespoon flour"), ["Tablespoon", "flour"], "1½ Tablespoon flour");
	deepEqual(removeQuantity("1 1/2 teaspoon flour"), ["teaspoon", "flour"], "1 1/2 teaspoon flour");
});

test("get the unit info, value and location", function() {
	deepEqual(getUnitInfo("1/2 C flour", getQuantityInfo("1/2 C flour")), {"text": "C", "start":4, "end":5, "unit": "cup"}, "1/2 C flour");
	deepEqual(getUnitInfo("1/2 Cup flour", getQuantityInfo("1/2 Cup flour")), {"text": "Cup", "start":4, "end":7, "unit": "cup"}, "1/2 Cup flour");
	deepEqual(getUnitInfo("½ tsp flour", getQuantityInfo("½ tsp flour")), {"text": "tsp", "start":2, "end":5, "unit":"teaspoon"}, "½ tsp flour");
	deepEqual(getUnitInfo("½C sugar", getQuantityInfo("½C sugar")), {"text": "C", "start":1, "end":2, "unit": "cup"}, "½C flour");
	deepEqual(getUnitInfo("1 Tbsp flour", getQuantityInfo("1 Tbsp flour")), {"text": "Tbsp", "start":2, "end":6, "unit": "tablespoon"} , "1 Tbsp flour");
	deepEqual(getUnitInfo("1tsp flour", getQuantityInfo("1tsp flour")),  {"text": "tsp", "start":1, "end":4, "unit": "teaspoon"}, "1tsp flour");
});

test("get the ingredient", function() {
	var line1 = "1/2 C flour";
	equal(getIngredient("1/2 C flour", 2, 4), "flour", "1/2 C flour");
	// deepEqual(getIngredient("1/2 Cup chopped onions"), "chopped onions", "1/2 C chopped onions");
	// deepEqual(getIngredient("½ C flour"), "flour", "½ C flour");
	// deepEqual(getIngredient("½C sugar"), "sugar", "½C sugar");
	// deepEqual(getIngredient("1 Tbsp baking powder"), "baking powder", "1 Tbsp baking powder");
	// deepEqual(getIngredient("1tsp flour"), "flour", "1tsp flour");
	// deepEqual(getIngredient("1½ Tablespoon salt"), "salt", "1½ Tablespoon salt");
	// deepEqual(getIngredient("1 1/2 teaspoon flour"), "flour", "1 1/2 teaspoon flour");
});



//5
test("create a JSON object to store values of unicode fractions", function(){
	deepEqual(convertUnicodeFraction("¼"), {"num": 1, "den": 4, "text": "1/4"}, "one fourth");
	deepEqual(convertUnicodeFraction("¼").text, "1/4", "one fourth");
	deepEqual(convertUnicodeFraction("⅙"), {"num": 1, "den": 6, "text": "1/6"}, "one sixth");
})

test("get uniform unit", function() {
	equal(standardizeUnit("C"), "cup", "C");
	equal(standardizeUnit("Cup"), "cup", "Cup");
	equal(standardizeUnit("Tbsp"), "tablespoon", "Tbsp");
	equal(standardizeUnit("tsp"), "teaspoon", "tsp");
	equal(standardizeUnit("Tablespoon"), "tablespoon", "Tablespoon");
	equal(standardizeUnit("teaspoon"), "teaspoon", "teaspoon");
});


test("convert amount to the largest units", function() {
	deepEqual(getUnitList(192), [{qts: 192, "amount": "1", unit: "cup"}], "1 cup");
	deepEqual(getUnitList(216), [{qts: 192, "amount": "1", unit: "cup"}, {qts: 24, "amount": "2", unit: "tablespoon"}], "1 cup and 2 Tbsp");
	deepEqual(getUnitList(24), [{qts: 24, "amount": "2", unit: "tablespoon"}], "2 Tbsp");
	deepEqual(getUnitList(96), [{qts: 96, "amount": "1/2", unit: "cup"}], "1/2 cup");

});

test("combine like units into one unit", function() {
	var unitList = [{qts: 192, unit: "cup", amount: "1"}];
	deepEqual(combineLikeUnits(unitList), [{qts: 192, unit: "cup", amount: "1"}], "1 cup");
	var two_half_cups = [{qts: 384, unit: "cup", amount: "2"}, {qts: 46, unit: "cup", amount: "1/2"}];
	deepEqual(combineLikeUnits(two_half_cups), [{qts: 430, "amount": "2 1/2", unit: "cup"}], "2 1/2 cup(s)");
	var one_quarter_teaspoon = [{qts: 4, unit: "teaspoon", amount: "1"}, {qts: 1, unit: "teaspoon", amount: "1/4"}];
	deepEqual(combineLikeUnits(one_quarter_teaspoon), [{qts: 5, "amount": "1 1/4", unit: "teaspoon"}], "1 1/4 teaspoon");
	var two_half_cups_qt = [{qts: 384, unit: "cup", amount: "2"}, {qts: 46, unit: "cup", amount: "1/2"}, {qts: 1, unit: "teaspoon", amount: "1/4"}];
	deepEqual(combineLikeUnits(two_half_cups_qt), [{qts: 430, "amount": "2 1/2", unit: "cup"}, {qts: 1, unit: "teaspoon", amount: "1/4"}], "2 1/2 cup, 1/4 teaspoon");
});


test("print human readable ", function() {
	//equal(format({qts: 430, "amount": "2 1/2", unit: "cup"}), "2 1/2 cup", "2 1/2 cup");
	equal(format([{qts: 430, "amount": "2 1/2", unit: "cup"}, {qts: 1, unit: "teaspoon", amount: "1/4"}]), "2 1/2 cup, 1/4 teaspoon", "2 1/2 cup");
});


///////////////


test("Is it a fraction", function () {
	ok(!isFraction("3"), "whole numbers are not fractions");
	ok(!isFraction("1 3"), "missing forward slash");
	ok(isFraction("1/3"), "written out as common fraction");
	ok(isFraction("1 / 3"), "space between seprator allowed");
	ok(isFraction("1 /3"),  "space between seprator allowed");
	ok(isFraction("1/ 3"),  "space between seprator allowed");
	ok(isFraction("1/3"), "written out as common fraction");
	ok(isFraction("999/999"), "common fraction with multiple chars on each side");
	ok(isFraction('¼'), "fractional unicode chars are detected");
	ok(isFraction('⅔'), "fractional unicode chars are detected");
	ok(!isFraction("abc"), "alpha chars not allowed");
	ok(!isFraction("'3 1/4'"), "fractions must be alone");
	ok(!isFraction("1¼"), "starts with a whole number");
});

test ("Are unicode fractions recognized as fractions", function() {
	var list = ['¼', '½', '¾', '⅓', '⅔', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅛', '⅜', '⅝', '⅞'];
	for (i=0; i < list.length; i++) {
		ok(isUnicodeFraction(list[i]), "unicode characters are valid");
	}
	ok(!isUnicodeFraction('1/4'), "common fractions aren't vulgar");
	ok(!isUnicodeFraction('1'), "whole numbers aren't vulgar fractions");
	ok(!isUnicodeFraction('1¼'), "starts with a whole number");
});



test ("convert written recipe quantity to qts", function() {
	equal(convertToQts("1", "cup"), "192", "1 cup");
	equal(convertToQts("2", "teaspoon"), "8", "2 teaspoon");
	equal(convertToQts("1/2", "teaspoon"), "2", "1/2 tsp");
	equal(convertToQts("1 1/2", "teaspoon"), "6", "1 1/2 teaspoon");
	equal(convertToQts("½", "teaspoon"), "2", "½ teaspoon");
});

test ("convert written recipe quantity to qts", function() {
	equal(multiplyIngredient("1 C flour", "2/1"), "2 cup flour", "1 C flour");
	equal(multiplyIngredient("1/4 tsp salt", "2/1"), "1/2 teaspoon salt", "1/4 tsp salt");
	equal(multiplyIngredient("1/3 cup sugar", "2/1"), "2/3 cup sugar", "1/3 cup sugar");
	equal(multiplyIngredient("2 3/4 cup water", "2/1"), "5 1/2 cup water", "2 3/4 cup water");

});


test ("rationalize fraction", function() {
	equal(simplifyFrac(5, 4), "1 1/4", "5/4 - remainder");
	equal(simplifyFrac(4, 2), "2", "4/2 - simplifying whole number");
	equal(simplifyFrac(6, 4), "1 1/2", "6/4 - remainder that also needs simplifying");
	equal(simplifyFrac(8, 3), "2 2/3", "8/3 - whole number greater than one, and remainders");
	equal(simplifyFrac(12, 4), "3", "12/4 - whole number greater than one");
	equal(simplifyFrac(4, 12), "1/3", "4/12 - whole number greater than one");
	equal(simplifyFrac(2, 3), "2/3", "2/3 - no conversion");
});

