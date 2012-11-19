console.log("-----");
test( "hello test", function() {
   ok( 1 == "1", "Passed!" );
   strictEqual(1, "1", "oh my");
 });




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

test("number conversions", function() {
	equal(convertToNumber("3"), 3, "no conversions");
	equal(convertToNumber("3 1/2"), 3.5, "fraction conversions");
	equal(convertToNumber("1 1/4"), 1.25, "fraction conversions");
	equal(convertToNumber("1 3/4"), 1.75, "fraction conversions");
	equal(convertToNumber("1 &frac34"), 1.75, "ascii fraction conversions");
})

