$(document).ready(function(){
	// backbone
	//template helper function
	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};

	var Input = Backbone.Model.extend({
		defaults: {
			instructions: "Write your recipe in here, @@@@@@@@@@@@@@@@",
			recipe: ""
		}
	});

	var Output = Backbone.Model.extend({
		  defaults : {
		    recipe: "hello food"
		  }
	});

	var ShadowOutput = Backbone.Model.extend({
		  defaults : {
		    recipe: "hello food"
		  }
	});

	var InputView = Backbone.View.extend({
		tagName: 'textarea'
		, id: 'recipe_input'
		, className: 'input_area'
		, convertedModel: null
		, attributes: {
			'name': 'ingredients'
			, 'placeholder': 'this is your placeholder text'
			, 'rows': 30
			, 'cols': 50
			, 'wrap': 'hard'
			// , 'autofocus'
		}
		, template: template('input-template')
		, initialize: function(){

		}
		, events: {
			'keyup': 'textChanged',
			'paste': 'pasteText'
		}
		, textChanged: function(){
			var results = outputRecipe();
			this.convertedModel.set('recipe', results.output);
		}
		, pasteText: function(){
			// contentis not yet populated immediately afer paste ation
			var parent = this;
		 	setTimeout(function () {
				var results = outputRecipe();
				parent.convertedModel.set('recipe', results.output);
		  }, 100);
		}
		, render: function(){
			this.el.placeholder = this.model.get("instructions");
			this.$el.html(this.template(this.model.toJSON()))
			return this
		}
	})

	var OutputView = Backbone.View.extend({
		id: 'converted-recipe'
		, template : template('output-template')
		, initialize: function() {
			this.model.on('change', this.render, this);
		} 
		// , initialize: function() {return this}
		,render: function(){
			this.$el.html(this.template(this.model.toJSON()))
			return this
		}
	})
var outputModel = new Output();
var inWindow = new InputView({model: new Input()});
inWindow.convertedModel = outputModel;

var outWindow = new OutputView({model: outputModel});
$('#main').append(inWindow.render().el);
$("#main").append(outWindow.render().el);
////////////////////

	// $('textarea').autosize();

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

	function outputRecipe() {
		var textBlock = $("#recipe_input").val();
		var inputTextHtml = (textBlock).replace(/\n\r?/g, '<br />');
		$("#backmodel").html(inputTextHtml);
		var factor = $("#factor-list").val(); 
		var allLines = multiplyRecipe(textBlock, factor);
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
		return {"output": output, "highlights": highlights};
	}


	// $("#recipe_input").bind('input propertychange', function(){
	// 	outputRecipe();
	//	$("#backmodel").html(highlights);
	//	$("#converted-recipe").html(output);
	// });

	// $("#factor-list").change(function(){
	// 	outputRecipe();
	//	$("#backmodel").html(highlights);
	//	$("#converted-recipe").html(output);
	// })

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