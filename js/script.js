$(document).ready(function(){
	var content = $("#click_block").html().split(' ');
	console.log(content);

	console.log("hello");
	$("#click_block").click(function(3 cups flour){
		var click_number = parseInt($("#click_count").html());
		$("#click_count").text(click_number + 1);
	})

	// parse for "number" "unit" "ingredient"
	getQuantity = function(line){
		console.log(line);
	}

})