
test("quantity test", function() {
 	deepEqual(getQuantity("1 cup flour"), ["1", "cup", "flour"], "simple list" );
 	deepEqual(getQuantity("3 cups flour"), ["3", "cups", "flour"], "simple list" );
 	deepEqual(getQuantity("3cups flour"), ["3", "cups", "flour"], "simple list" );
 	deepEqual(getQuantity("3 C flour"), ["3", "C", "flour"], "simple list" );
 	deepEqual(getQuantity("3C flour"), ["3", "C", "flour"], "simple list" );
 	deepEqual(getQuantity("10 oz water"), ["10", "oz", "water"], "simple list" );
 	deepEqual(getQuantity("2 green onions"), ["2", "green", "onions"], "simple list" );
 	deepEqual(getQuantity("2 C pastry flour"), ["2", "C", "pastry flour"], "simple list" );
});

/*
test("number conversions", function() {
	equal(convertToNumber("3"), 3, "no conversions");
	equal(convertToNumber("3 1/2"), 3.5, "fraction conversions");
	equal(convertToNumber("1 1/4"), 1.25, "fraction conversions");
	equal(convertToNumber("1 3/4"), 1.75, "fraction conversions");
	equal(convertToNumber("1 &frac34"), 1.75, "ascii fraction conversions");
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
})

test ("Are unicode fractions recognized as fractions", function() {
	var list = ['¼', '½', '¾', '⅓', '⅔', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅛', '⅜', '⅝', '⅞'];
	for (i=0; i < list.length; i++) {
		ok(isUnicodeFraction(list[i]), "unicode characters are valid");
	}
	ok(!isUnicodeFraction('1/4'), "common fractions aren't vulgar");
	ok(!isUnicodeFraction('1'), "whole numbers aren't vulgar fractions");
	ok(!isUnicodeFraction('1¼'), "starts with a whole number");
})
/*
test ("Is there a unicode fraction with a whole number", function() {

})
*/