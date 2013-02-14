function multiplyRecipe(factor){
	console.log("fact: "+factor);
	var entered_recipe = $("#recipe_input").val();
	console.log(factor*entered_recipe)
}


$(document).ready(function(){

	$("#factor-list").change(function(){
		var factor = $(this).val();
		console.log(factor);
	});

	$("button#process_factor").click(function(e){
		console.log("button has been clicked");
		var factor = $("#factor-list").val(); 
		console.log("f="+factor);
		multiplyRecipe(factor);
	});
		
	// // for range
	// function displayValue() {
	// 	var chosenValue = document.getElementById("range-slider").value;
	// 	$("#range-value").html(chosenValue);
	// }
	
});