/*
test("quantity test", function() {
 	deepEqual(getQuantity("1 cup flour"), ["1", "cup", "flour"], "simple list" );
 	deepEqual(getQuantity("3 cups flour"), ["3", "cups", "flour"], "simple list" );
 	deepEqual(getQuantity("3cups flour"), ["3", "cups", "flour"], "simple list" );
 	deepEqual(getQuantity("3 C flour"), ["3", "C", "flour"], "simple list" );
 	deepEqual(getQuantity("3C flour"), ["3", "C", "flour"], "simple list" );
 	deepEqual(getQuantity("10 oz water"), ["10", "oz", "water"], "simple list" );
 	deepEqual(getQuantity("2 green onions"), ["2", "green", "onions"], "simple list" );
 	deepEqual(getQuantity("2 C flour"), ["2", "C", "flour"], "simple list" );
});
*/

test("return the fractions in the line", function() {
	equal(getFrac("1/2 C flour"), "1/2", "regular fraction");
	equal(!getFrac("1 C flour"), "1", "one whole number is not a fraction");
	equal(getFrac("1 C flour"), null, "one whole number is not a fraction");
	equal(getFrac("½ C flour"), "½", "unicode fraction");
	equal(getFrac("1 ½ C flour"), "½", "one whole number and one unicode fraction");
	equal(getFrac("1 1/2 C flour"), "1/2", "one whole number and one regular fraction")
});

test("return the index of the fraction", function() {
	equal(getFracIndex("1/2 C flour"), 0, "regular fraction");
	equal(getFracIndex("1 C flour"), -1, "whole number");
	equal(getFracIndex("½ C flour"), 0, "unicode fraction");
	equal(getFracIndex("1 ½ C flour"), 1, "one whole number and one unicode fraction");
	equal(getFracIndex("1 1/2 C flour"), 1, "one whole number and one regular fraction")
});


test("get the index of the whole number", function() {
	equal(numberIndex("1 C flour"), 0, "whole number");
	equal(numberIndex("½ C flour"), -1, "unicode fraction");
	equal(numberIndex("1 ½ C flour"), 0, "one whole number and one unicode fraction");
	equal(numberIndex("1 1/2 C flour"), 0, "one whole number and one regular fraction")
});



/*
test("get the position of the last number in the string", function() {
	equal(numPosition("1 cup flour"), 0, "one number");
	equal(numPosition("1/2 cup flour"), 0, "one regular fraction");
	equal(numPosition("½ cup flour"), 0, "one unicode fraction");
	equal(numPosition("1 1/2 cups flour"), 1, "one number and one regular fraction");
	equal(numPosition("1 ½ cups flour"), 1, "one number and one unicode fraction");
})
*/


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


/*
test("get the index of the unit", function() {
	equal(unitIndex("1 Tbsp salt"), 1, "one whole number");
	equal(unitIndex("1 1/2 tsp salt"), 2, "one whole number and one regular fraction");
	equal(unitIndex("1/2 tsp salt"), 1, "one regular fraction");
	equal(unitIndex("½ tsp salt"), 1, "one unicode fraction");
	equal(unitIndex("1 ½ tsp salt"), 2, "one whole number and one unicode fraction");	
})
*/

/*
test ("Is there a unicode fraction with a whole number", function() {

})
*/