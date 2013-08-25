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

		return preSpace+'<span class="quantity">' + quantity + '</span>'+midSpace+'<span class="unit">' + unit + '</span>'+ingredient ;
	}

	// Print Controls

	$('#add').click(function(){
		$(this).hide();
		$('.add_only').show();
	})

	$('#print_controls input').mousedown(function(){
		console.log('mouse down');
		$(this).css('border', '2px inset rgba(78, 60, 14, 0.4)')
	});
	$('#print_controls input').mouseup(function(){
		console.log('mouse up');
		$(this).css('border', '2px outset rgba(78, 60, 14, 0.4)')
	});

	
});