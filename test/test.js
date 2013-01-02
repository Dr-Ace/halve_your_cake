test("return the fractions in the line", function() {
	deepEqual(getFrac("1/2 C flour"), {"num": 1, "den": 2, "text": "1/2", "startIndex": 0, "endIndex": 2}, "regular fraction");
	deepEqual(getFrac("1 C flour"), null, "one whole number is not a fraction");
	deepEqual(getFrac("one C flour"), null, "one whole number is not a fraction");
	deepEqual(getFrac("½ C flour"), {"num": 1, "den": 2, "text": "½", "startIndex": 0, "endIndex": 0}, "unicode fraction");
	deepEqual(getFrac("1...½ C flour"), {"num": 1, "den": 2, "text": "½", "startIndex": 4, "endIndex": 4}, "one whole number and one unicode fraction");
	deepEqual(getFrac("1...1/2 1/8C flour"), {"num": 1, "den": 2, "text": "1/2", "startIndex": 4, "endIndex": 6}, "one whole number and one regular fraction");
});

test("get the last index of the fraction", function() {
	equal(getFracIndex("1/2 C flour"), 2, "1/2 C flour");
	equal(getFracIndex("½ C flour"), 0, "½ C flour");
	equal(getFracIndex("1...½ C flour"), 4, "1...½ C flour");
	equal(getFracIndex("1...1/2 1/8C flour"), 6, "1...1/2 1/8C flour");
});

test("get the index of the whole number", function() {
	deepEqual(getNumb("1 C flour"), {"value": 1, "text": "1", "startIndex": 0, "endIndex": 0}, "1 C flour");
	deepEqual(getNumb("at least 1 C flour"), {"value": 1, "text": "1", "startIndex": 9, "endIndex": 9}, "at least 1 C flour");
	deepEqual(getNumb("½ C flour"), null, "½ C flour");
	deepEqual(getNumb("1 ½ C flour"), {"value": 1, "text": "1", "startIndex": 0, "endIndex": 0}, "1 ½ C flour");
	deepEqual(getNumb("1 1/2 C flour"), {"value": 1, "text": "1", "startIndex": 0, "endIndex": 0}, "1 1/2 C flour")
	deepEqual(getNumb("one C flour"), null, "one C flour")
});

test("get the quantity", function() {
	equal(getQuantity("1/2 C flour"), "1/2", "1/2 C flour");
	equal(getQuantity("½ C flour"), "½", "½ C flour");
	equal(getQuantity("½C flour"), "½", "½C flour");
	equal(getQuantity("1 C flour"), "1", "1C flour");
	equal(getQuantity("1C flour"), "1", "1C flour");
	equal(getQuantity("1...½ C flour"), "1...½", "1...½ C flour");
	equal(getQuantity("1...1/2 flour"), "1...1/2", "1...1/2 flour");
});

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

test("get the unit", function() {
	equal(getUnit("1/2 C flour"), "C", "1/2 C flour");
	equal(getUnit("1/2 Cup flour"), "Cup", "1/2 C flour");
	equal(getUnit("½ C flour"), "C", "½ C flour");
	equal(getUnit("½C sugar"), "C", "½C flour");
	equal(getUnit("1 Tbsp flour"), "Tbsp", "1 Tbsp flour");
	equal(getUnit("1tsp flour"), "tsp", "1tsp flour");
	equal(getUnit("1½ Tablespoon flour"), "Tablespoon", "1½ Tablespoon flour");
	equal(getUnit("1 1/2 teaspoon flour"), "teaspoon", "1 1/2 teaspoon flour");
});

test("get the ingredient", function() {
	equal(getIngredient("1/2 C flour"), "flour", "1/2 C flour");
	equal(getIngredient("1/2 Cup chopped onions"), "chopped onions", "1/2 C chopped onions");
	equal(getIngredient("½ C flour"), "flour", "½ C flour");
	equal(getIngredient("½C sugar"), "sugar", "½C sugar");
	equal(getIngredient("1 Tbsp baking powder"), "baking powder", "1 Tbsp baking powder");
	equal(getIngredient("1tsp flour"), "flour", "1tsp flour");
	equal(getIngredient("1½ Tablespoon salt"), "salt", "1½ Tablespoon salt");
	equal(getIngredient("1 1/2 teaspoon flour"), "flour", "1 1/2 teaspoon flour");
});



//5
test("create a JSON object to store values of unicode fractions", function(){
	deepEqual(convertUnicodeFraction("¼"), {"num": 1, "den": 4, "text": "1/4"}, "one fourth");
	deepEqual(convertUnicodeFraction("¼").text, "1/4", "one fourth");
	deepEqual(convertUnicodeFraction("⅙"), {"num": 1, "den": 6, "text": "1/6"}, "one sixth");
})

test("get uniform unit", function() {
	equal(StandardizeUnit("C"), "cup", "C");
	equal(StandardizeUnit("Cup"), "cup", "Cup");
	equal(StandardizeUnit("Tbsp"), "tablespoon", "Tbsp");
	equal(StandardizeUnit("tsp"), "teaspoon", "tsp");
	equal(StandardizeUnit("Tablespoon"), "tablespoon", "Tablespoon");
	equal(StandardizeUnit("teaspoon"), "teaspoon", "teaspoon");
});


test("convert amount to the largest units", function() {
	deepEqual(getUnitList(192), [{qts: 192, "label": "1", unit: "cup", amt: 1}], "1 cup");
	deepEqual(getUnitList(216), [{qts: 192, "label": "1", unit: "cup", amt: 1}, {qts: 24, "label": "1", unit: "tablespoon", amt: 2}], "1 cup and 2 Tbsp");
	deepEqual(getUnitList(24), [{qts: 24, "label": "1", unit: "tablespoon", amt: 2}], "2 Tbsp");
	deepEqual(getUnitList(96), [{qts: 96, "label": "1/2", unit: "cup", amt: 1}], "1/2 cup");

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



////////////////

test ("Get the index of the unicode fraction", function() {
	equal(indexOfCharFraction("1 ½ Cups"), 1);
	equal(indexOfCharFraction("1 ⅓ Cups"), 1);
	equal(indexOfCharFraction("⅔ Cups"), 0);
});


test ("see if the item in the array is a unit", function() {
	ok(isUnit("Tbsp"), "unit");
	ok(!isUnit("1/2"), "fraction string");
	ok(!isUnit("⅔"), "unicode fraction string");
});
