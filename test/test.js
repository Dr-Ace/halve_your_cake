test("return the fractions in the line", function() {
	deepEqual(Convert.__testonly__.getFrac("1/2 C flour"), {"num": 1, "den": 2, "text": "1/2", "start": 0, "end": 2}, "regular fraction");
	deepEqual(Convert.__testonly__.getFrac("1 C flour"), null, "one whole number is not a fraction");
	deepEqual(Convert.__testonly__.getFrac("one C flour"), null, "one whole number is not a fraction");
	deepEqual(Convert.__testonly__.getFrac("½ C flour"), {"num": 1, "den": 2, "text": "½", "start": 0, "end": 0}, "unicode fraction");
	deepEqual(Convert.__testonly__.getFrac("1 ½ C flour"), {"num": 1, "den": 2, "text": "½", "start": 2, "end": 2}, "one whole number and one unicode fraction");
	// should support in the future
	// deepEqual(getFrac("1 1/2 C flour"), {"num": 1, "den": 2, "text": "1/2", "start": 2, "end": 4}, "one whole number and one regular fraction");
});

test("split text fraction", function() {
	deepEqual(Convert.__testonly__.splitTextFraction("1/2"), {"num": 1, "den": 2, "text": "1/2"}, "r1/2");
	deepEqual(Convert.__testonly__.splitTextFraction("2/3"), {"num": 2, "den": 3, "text": "2/3"}, "2/3");
	deepEqual(Convert.__testonly__.splitTextFraction("5/2"), {"num": 5, "den": 2, "text": "5/2"}, "5/2");
});

test("find the first whole number in the line", function() {
	deepEqual(Convert.__testonly__.findFirstWholeNumber("1 C flour"), {"value": 1, "text": "1", "start": 0, "end": 0}, "1 C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("at least 1 C flour"), {"value": 1, "text": "1", "start": 9, "end": 9}, "at least 1 C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("½ C flour"), null, "½ C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("1 ½ C flour"), {"value": 1, "text": "1", "start": 0, "end": 0}, "1 ½ C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("1 1/2 C flour"), {"value": 1, "text": "1", "start": 0, "end": 0}, "1 1/2 C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("2 1/2 C flour"), {"value": 2, "text": "2", "start": 0, "end": 0}, "2 1/2 C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("10 1/2 C flour"), {"value": 10, "text": "10", "start": 0, "end": 1}, "10 1/2 C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("1/2 C flour"), null, "1/2 C flour");
	deepEqual(Convert.__testonly__.findFirstWholeNumber("one C flour"), null, "one C flour");
});

test("get the quantity info, value and location", function() {
	deepEqual(Convert.__testonly__.getQuantityInfo("1/2 C flour"), {"improperFraction": {"num":1, "den":2}, "text": "1/2", "start":0, "end":2}, "1/2 C flour");
	deepEqual(Convert.__testonly__.getQuantityInfo("1 1/2 C flour"), {"improperFraction": {"num":3, "den":2}, "text": "1 1/2", "start": 0, "end": 4}, "1 1/2 C flour");
	deepEqual(Convert.__testonly__.getQuantityInfo("1 C flour"), {"improperFraction": {"num":1, "den":1}, "text": "1", "start": 0, "end": 0}, "1 C flour");
	// deepEqual(getQuantityInfo("1 Cup and 2 Tbsp flour"), [{"improperFraction": {"num":1, "den":1}, "text": "1", "start": 0, "end": 0},
	// 		{"improperFraction": {"num":2, "den":1}, "text": "2", "start": 10, "end": 10}], "1 Cup and 2 Tbsp flour");
});


test("get the unit info, value and location", function() {
	deepEqual(Convert.__testonly__.getUnitInfo("1/2 C flour", Convert.__testonly__.getQuantityInfo("1/2 C flour")), {"text": "C", "start":4, "end":5, "unit": "cup"}, "1/2 C flour");
	deepEqual(Convert.__testonly__.getUnitInfo("1/2 Cup flour", Convert.__testonly__.getQuantityInfo("1/2 Cup flour")), {"text": "Cup", "start":4, "end":7, "unit": "cup"}, "1/2 Cup flour");
	deepEqual(Convert.__testonly__.getUnitInfo("½ tsp flour", Convert.__testonly__.getQuantityInfo("½ tsp flour")), {"text": "tsp", "start":2, "end":5, "unit":"teaspoon"}, "½ tsp flour");
	deepEqual(Convert.__testonly__.getUnitInfo("½C sugar", Convert.__testonly__.getQuantityInfo("½C sugar")), {"text": "C", "start":1, "end":2, "unit": "cup"}, "½C flour");
	deepEqual(Convert.__testonly__.getUnitInfo("1 Tbsp flour", Convert.__testonly__.getQuantityInfo("1 Tbsp flour")), {"text": "Tbsp", "start":2, "end":6, "unit": "tablespoon"} , "1 Tbsp flour");
	deepEqual(Convert.__testonly__.getUnitInfo("1tsp flour", Convert.__testonly__.getQuantityInfo("1tsp flour")),  {"text": "tsp", "start":1, "end":4, "unit": "teaspoon"}, "1tsp flour");
	deepEqual(Convert.__testonly__.getUnitInfo("1 pound potatoes", Convert.__testonly__.getQuantityInfo("1 pound potatoes")),  {"text": "", "start":-1, "end":-1, "unit": "unknown"}, "1 pound potatoes");
});

test("get the ingredient", function() {
	var line1 = "1/2 C flour";
	equal(Convert.__testonly__.getIngredient("1/2 C flour", 2, 4), "flour", "1/2 C flour");
	// deepEqual(Convert.__testonly__.getIngredient("1/2 Cup chopped onions"), "chopped onions", "1/2 C chopped onions");
	// deepEqual(Convert.__testonly__.getIngredient("½ C flour"), "flour", "½ C flour");
	// deepEqual(Convert.__testonly__.getIngredient("½C sugar"), "sugar", "½C sugar");
	// deepEqual(Convert.__testonly__.getIngredient("1 Tbsp baking powder"), "baking powder", "1 Tbsp baking powder");
	// deepEqual(Convert.__testonly__.getIngredient("1tsp flour"), "flour", "1tsp flour");
	// deepEqual(Convert.__testonly__.getIngredient("1½ Tablespoon salt"), "salt", "1½ Tablespoon salt");
	// deepEqual(Convert.__testonly__.getIngredient("1 1/2 teaspoon flour"), "flour", "1 1/2 teaspoon flour");
});



//5
test("create a JSON object to store values of unicode fractions", function() {
	deepEqual(Convert.__testonly__.convertUnicodeFraction("¼"), {"num": 1, "den": 4, "text": "1/4"}, "one fourth");
	deepEqual(Convert.__testonly__.convertUnicodeFraction("¼").text, "1/4", "one fourth");
	deepEqual(Convert.__testonly__.convertUnicodeFraction("⅙"), {"num": 1, "den": 6, "text": "1/6"}, "one sixth");
})

test("get uniform unit", function() {
	equal(Convert.__testonly__.standardizeUnit("C"), "cup", "C");
	equal(Convert.__testonly__.standardizeUnit("Cup"), "cup", "Cup");
	equal(Convert.__testonly__.standardizeUnit("Tbsp"), "tablespoon", "Tbsp");
	equal(Convert.__testonly__.standardizeUnit("tsp"), "teaspoon", "tsp");
	equal(Convert.__testonly__.standardizeUnit("Tablespoon"), "tablespoon", "Tablespoon");
	equal(Convert.__testonly__.standardizeUnit("teaspoon"), "teaspoon", "teaspoon");
});


test("convert amount to the largest units", function() {
	deepEqual(Convert.__testonly__.getUnitList(192), [{qts: 192, "amount": "1", unit: "cup"}], "1 cup");
	deepEqual(Convert.__testonly__.getUnitList(216), [{qts: 192, "amount": "1", unit: "cup"}, {qts: 24, "amount": "2", unit: "tablespoon"}], "1 cup and 2 Tbsp");
	deepEqual(Convert.__testonly__.getUnitList(24), [{qts: 24, "amount": "2", unit: "tablespoon"}], "2 Tbsp");
	deepEqual(Convert.__testonly__.getUnitList(96), [{qts: 96, "amount": "1/2", unit: "cup"}], "1/2 cup");

});

test("combine like units into one unit", function() {
	var unitList = [{qts: 192, unit: "cup", amount: "1"}];
	deepEqual(Convert.__testonly__.combineLikeUnits(unitList), [{qts: 192, unit: "cup", amount: "1"}], "1 cup");
	var two_half_cups = [{qts: 384, unit: "cup", amount: "2"}, {qts: 46, unit: "cup", amount: "1/2"}];
	deepEqual(Convert.__testonly__.combineLikeUnits(two_half_cups), [{qts: 430, "amount": "2 1/2", unit: "cup"}], "2 1/2 cup(s)");
	var one_quarter_teaspoon = [{qts: 4, unit: "teaspoon", amount: "1"}, {qts: 1, unit: "teaspoon", amount: "1/4"}];
	deepEqual(Convert.__testonly__.combineLikeUnits(one_quarter_teaspoon), [{qts: 5, "amount": "1 1/4", unit: "teaspoon"}], "1 1/4 teaspoon");
	var two_half_cups_qt = [{qts: 384, unit: "cup", amount: "2"}, {qts: 46, unit: "cup", amount: "1/2"}, {qts: 1, unit: "teaspoon", amount: "1/4"}];
	deepEqual(Convert.__testonly__.combineLikeUnits(two_half_cups_qt), [{qts: 430, "amount": "2 1/2", unit: "cup"}, {qts: 1, unit: "teaspoon", amount: "1/4"}], "2 1/2 cup, 1/4 teaspoon");
});


test("print human readable ", function() {
	//equal(format({qts: 430, "amount": "2 1/2", unit: "cup"}), "2 1/2 cup", "2 1/2 cup");
	equal(Convert.__testonly__.format([{qts: 430, "amount": "2 1/2", unit: "cup"}, {qts: 1, unit: "teaspoon", amount: "1/4"}]), "2 1/2 cup, 1/4 teaspoon", "2 1/2 cup");
});


///////////////


test("Is it a fraction", function () {
	ok(!Convert.__testonly__.isFraction("3"), "whole numbers are not fractions");
	ok(!Convert.__testonly__.isFraction("1 3"), "missing forward slash");
	ok(Convert.__testonly__.isFraction("1/3"), "written out as common fraction");
	ok(Convert.__testonly__.isFraction("1 / 3"), "space between seprator allowed");
	ok(Convert.__testonly__.isFraction("1 /3"),  "space between seprator allowed");
	ok(Convert.__testonly__.isFraction("1/ 3"),  "space between seprator allowed");
	ok(Convert.__testonly__.isFraction("1/3"), "written out as common fraction");
	ok(Convert.__testonly__.isFraction("999/999"), "common fraction with multiple chars on each side");
	ok(Convert.__testonly__.isFraction('¼'), "fractional unicode chars are detected");
	ok(Convert.__testonly__.isFraction('⅔'), "fractional unicode chars are detected");
	ok(!Convert.__testonly__.isFraction("abc"), "alpha chars not allowed");
	ok(!Convert.__testonly__.isFraction("'3 1/4'"), "fractions must be alone");
	ok(!Convert.__testonly__.isFraction("1¼"), "starts with a whole number");
});

test ("Are unicode fractions recognized as fractions", function() {
	var list = ['¼', '½', '¾', '⅓', '⅔', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅛', '⅜', '⅝', '⅞'];
	for (i=0; i < list.length; i++) {
		ok(Convert.__testonly__.isUnicodeFraction(list[i]), "unicode characters are valid");
	}
	ok(!Convert.__testonly__.isUnicodeFraction('1/4'), "common fractions aren't vulgar");
	ok(!Convert.__testonly__.isUnicodeFraction('1'), "whole numbers aren't vulgar fractions");
	ok(!Convert.__testonly__.isUnicodeFraction('1¼'), "starts with a whole number");
});



test ("convert written recipe quantity to qts", function() {
	equal(Convert.__testonly__.convertToQts("1", "cup"), "192", "1 cup");
	equal(Convert.__testonly__.convertToQts("2", "teaspoon"), "8", "2 teaspoon");
	equal(Convert.__testonly__.convertToQts("1/2", "teaspoon"), "2", "1/2 tsp");
	equal(Convert.__testonly__.convertToQts("1 1/2", "teaspoon"), "6", "1 1/2 teaspoon");
	equal(Convert.__testonly__.convertToQts("½", "teaspoon"), "2", "½ teaspoon");
});

// test ("multiply ingredient", function() {
// 	equal(multiplyIngredient("1 C flour", "2/1"), "2 cup flour", "1 C flour");
// 	equal(multiplyIngredient("1/4 tsp salt", "2/1"), "1/2 teaspoon salt", "1/4 tsp salt");
// 	equal(multiplyIngredient("1/3 cup sugar", "2/1"), "2/3 cup sugar", "1/3 cup sugar");
// 	equal(multiplyIngredient("2 3/4 cup water", "2/1"), "5 1/2 cup water", "2 3/4 cup water");
// });

test ("multiply ingredient", function() {
	var quantityHelper = function(q) {return {"text": q[0], "start":q[1], "end":q[2],"improperFraction":{"num":q[3], "den":q[4]}};}
	var unitHelper = function (u) {return {"text": u[0],"start": u[1],"end": u[2],"unit": u[3]};};
	var helper = function (input, output) {
		return {'input': { 'text': input[0], 'quantityInfo': quantityHelper(input[1]), 'unitInfo': unitHelper(input[2])},
			    'output': {'text': output[0],'quantityInfo': quantityHelper(output[1]), 'unitInfo': unitHelper(output[2])}};q
	}
	deepEqual(Convert.__testonly__.multiplyIngredient("1 C flour", "2/1"), helper(['1 C flour', ['1',0,0,1,1],['C',2,3,'cup']], ['2 cup flour',['2',0,0,2,1],['cup',2,5,'cup']]) );
	// deepEqual(multiplyIngredient("1 C flour", "2/1"), {"text":"2 cup flour", 'quantStart': 0, 'quantEnd': 0, 'unitStart': 2, 'unitEnd': 5 });
	// deepEqual(multiplyIngredient("1/4 tsp salt", "2/1"), {"text":"1/2 teaspoon salt", 'quantStart': 0, 'quantEnd': 2, 'unitStart': 4, 'unitEnd': 12 }, "1/4 tsp salt");
	// deepEqual(multiplyIngredient("1 cup sugar", "1/2"), {"text":"1/2 cup sugar", 'quantStart': 0, 'quantEnd': 2, 'unitStart': 4, 'unitEnd': 7 }, "1 cup sugar");
	// equal(multiplyIngredient("2 3/4 cup water", "2/1"), "5 1/2 cup water", "2 3/4 cup water");
});

test ("multiply ingredient", function() {
	deepEqual(Convert.__testonly__.multiplyIngredient("1 C flour", "2/1").output.text,  "2 cup flour", "1 C flour x 2" )
});


test ("rationalize fraction", function() {
	equal(Convert.__testonly__.simplifyFrac(5, 4), "1 1/4", "5/4 - remainder");
	equal(Convert.__testonly__.simplifyFrac(4, 2), "2", "4/2 - simplifying whole number");
	equal(Convert.__testonly__.simplifyFrac(6, 4), "1 1/2", "6/4 - remainder that also needs simplifying");
	equal(Convert.__testonly__.simplifyFrac(8, 3), "2 2/3", "8/3 - whole number greater than one, and remainders");
	equal(Convert.__testonly__.simplifyFrac(12, 4), "3", "12/4 - whole number greater than one");
	equal(Convert.__testonly__.simplifyFrac(4, 12), "1/3", "4/12 - whole number greater than one");
	equal(Convert.__testonly__.simplifyFrac(2, 3), "2/3", "2/3 - no conversion");
});

