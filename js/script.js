$(document).ready(function(){

	// $("#factor-list").change(function(){
	// 	var factor = $(this).val();
	// 	console.log("factor: "+factor);
	// });

	// take the fraction value from the selected 'options' element, convert it into an object containing two integers, and process the text input
	var multiplyRecipe = function(){
		console.log("multiplyRecipe has been called");
			var fraction = $("#factor-list").val();
			var seperateFraction = fraction.split("/")
			var numerator = seperateFraction[0];
			var denominator = seperateFraction[1];
			for( i=0; i< seperateFraction.length; i++){
				seperateFraction[i] = parseInt(seperateFraction[i]);
			}
			// console.log(seperateFraction);
			// console.log("numerator: "+ numerator + ", denominator: "+ denominator);
			var arithmatic = function(input){
				return((input*numerator)/denominator);		
			}
			var enteredRecipe = $("#recipe_input").val();
			return arithmatic(enteredRecipe)
			console.log("arithmatic has been called")
	}

	//call multiplyRecipe on the contents of the textarea when the button is cicked and print it out to a new div
	$("button#process_factor").click(function(e){
		console.log("button has been clicked");
		var factor = $("#factor-list").val(); 
		console.log("f="+factor);
		var printedRecipe = multiplyRecipe(factor);
		console.log(printedRecipe)
		// print the new value to the screen
		$("#content").append("<p>"+ printedRecipe +"</p>");
	});

	
});