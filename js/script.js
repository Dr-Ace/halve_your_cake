$(document).ready(function(){


	$('textarea').autosize();

	$("button#process_factor").click(function(e){
	var textBlock = $("#recipe_input").val();
	var factor = $("#factor-list").val(); 
	var allLines = Convert.multiplyRecipe(textBlock, factor);
	// print the new value to the screen
	for (var i = 0; i < allLines.length; i++) {
		allLines[i]
		// $("#converted-recipe").append("<li>"+ allLines[i] +"</li>");
		$("#converted-recipe p").append(allLines[i]+"<br />");
		};
	});

	function outputRecipe() {
		var textBlock = $("#recipe_input").val();
		var inputTextHtml = (textBlock).replace(/\n\r?/g, '<br />');
		$("#backmodel").html(inputTextHtml);
		var factor = $("#factor-list").val(); 
		var allLines = Convert.multiplyRecipe(textBlock, factor);
		var output = "";
		var highlights = "";
		for (var i = 0; i < allLines.length; i++) {
			var line = allLines[i];
			var convertedLine = line;
			var highlightedLine = line;
			if(line.output != null) {
				convertedLine = line.output.text;
				highlightedLine = highlight(line.input);
			}
			highlights = highlights + highlightedLine+"<br/>";
			output = output + convertedLine+"<br/>";
		};
		$("#backmodel").html(highlights);
		$("#converted-recipe").html(output);
	}


	$("#recipe_input").bind('input propertychange', function(){
		outputRecipe();
	});

	$("#factor-list").change(function(){
		outputRecipe();
	})

	function nbspCount (count) {
		output = "";
		for (var i = 0; i < count; i++) {
			output += "&nbsp;";
		};
		return output;
	}

	function highlight(inputInfo) {
		var preSpace = inputInfo.text.slice(0,inputInfo.quantityInfo.start)//.replace(/\s/g,'&nbsp;');
		var quantity = inputInfo.text.slice(inputInfo.quantityInfo.start, inputInfo.quantityInfo.end +1)//.replace(/\s/g,'&nbsp;');
		var midSpace = inputInfo.text.slice(inputInfo.quantityInfo.end+1, inputInfo.unitInfo.start);//.replace(/\s/g,'&nbsp;');
		var unit = inputInfo.text.slice(inputInfo.unitInfo.start, inputInfo.unitInfo.end);
		var ingredient = inputInfo.text.slice(inputInfo.unitInfo.end)
		// var preSpaceCount = inputInfo.quantityInfo.start;
		// var midSpaceCount = inputInfo.unitInfo.start - (inputInfo.quantityInfo.end+1);

		return preSpace+'<span class="quantity">' + quantity + '</span>'+midSpace+'<span class="unit">' + unit + '</span>'+ingredient ;
	}

	// highlight the background of the textarea when it's in focus
	// $("#recipe_input").on({
	// 	blur : function(){
	// 		$(this).css("background-color", "#222b3b")
	// 	},
	// 	focus: function(){
	// 		$(this).css("background-color", "#1A212D")
	// 	}
	// });

	


	
});