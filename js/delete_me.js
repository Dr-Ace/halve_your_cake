test = 1;
namespace = (function() {
	function hello() {
		return "hello megan";
	}

	return {
		foo: "baz2",
		bar: 1,
		hi: hello
	}
	
})();

console.log(namespace.hi());
