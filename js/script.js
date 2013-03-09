$(document).ready(function(){

	$("button#process_factor").click(function(e){
	var textBlock = $("#recipe_input").val();
	var factor = $("#factor-list").val(); 
	var allLines = multiplyRecipe(textBlock, factor);
	// print the new value to the screen
	for (var i = 0; i < allLines.length; i++) {
		allLines[i]
		// $("#converted-recipe").append("<li>"+ allLines[i] +"</li>");
		$("#converted-recipe p").append(allLines[i]+"<br />");
		};
	});

	// highlight the background of the textarea when it's in focus
	$("#recipe_input").on({
		blur : function(){
			$(this).css("background-color", "#222b3b")
		},
		focus: function(){
			$(this).css("background-color", "#1A212D")
		}
	});

	


	
});