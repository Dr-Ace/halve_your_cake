$(document).ready(function(){
	// backbone
	//template helper function
	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};

// Models
	var Input = Backbone.Model.extend({
		defaults: {
			instructions: "Copy your ingredients into here",
			recipe: ""
		}
	});

	var Output = Backbone.Model.extend({
		  defaults : {
		    recipe: ""
		  }
	});

	var ShadowOutput = Backbone.Model.extend({
		  defaults : {
		    recipe: ""
		  }
	});

	var Factor = Backbone.Model.extend({
		defaults: {
			value: '1/1'
		}
	});

// Views
	var InputView = Backbone.View.extend({
		// tagName: 'textarea'
		el: '#recipe_input',
		className: 'input_area',
		convertedModel: null,
		//  attributes: {
		// 	'name': 'ingredients' ,
		// 	'placeholder': 'this is your placeholder text',
		// 	'rows': 30,
		// 	'cols': 50,
		// 	'wrap': 'hard',
		// 	// 'autofocus',
		// }
		factorModel: null,
		initialize: function(){
			console.log(this)
			this.factorModel.on('change', this.textChanged, this);
		},
		events: {
			'keyup': 'textChanged',
			'paste': 'pasteText'
		},
		textChanged: function(){
			console.log('here');
			this.model.set('recipe', $("#recipe_input").val());			
			var results = outputRecipe(this.model.get('recipe'));
			this.convertedModel.set('recipe', results.output);
		},
		pasteText: function(){
			// contents not yet populated immediately afer paste action
			var parent = this;
		 	setTimeout(function () {
		 		parent.textChanged();
		  }, 100);
		}
		// , render: function(){
		// 	this.el.placeholder = this.model.get("instructions");
		// 	this.$el.html(this.model);
		// 	return this
		// }
	})

	var OutputView = Backbone.View.extend({
		el: '#converted-recipe',
		initialize: function() {
			this.render();
			this.model.on('change', this.render, this);
		}, 
		render: function(){
			console.log(this.model.get('recipe'));
			this.$el.html(this.model.get('recipe'));
			return this;
		}
	})

	var ShadowOutputView = Backbone.View.extend({
		//apply the highlight() function to the contents of the textarea and output it.
		highlight: function(){
			highlight(inputView.val()) },
		initialize: function() {
			// $('#main').append(inWindow.render().el);
			this.model.on('change', this.render, this);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	})

	var FactorView = Backbone.View.extend({
		el: '#factor-list',
		events: {
			'change' : 'getFactor'
		},
		getFactor: function() {
			console.log(this.$el.val());
			this.model.set('value', this.$el.val());
			console.log('model.value: '+this.model.get('value'))
		},
		sayYay: function(){
			console.log('models changed');
		}
	});

var inputModel = new Input();
var outputModel = new Output();
var factor = new Factor();
var inWindow = new InputView({model: inputModel, factorModel: factor});
// window.myInputModel = inputModel;
inWindow.convertedModel = outputModel;
var shadowOutput = new ShadowOutputView({model: new ShadowOutput})

var outWindow = new OutputView({model: outputModel});
var factorView = new FactorView({model: factor})

////////////////////

	// $('textarea').autosize();

	// $("button#process_factor").click(function(e){
	// 	var textBlock = $("#recipe_input").val();
	// 	var factor = $("#factor-list").val(); 
	// 	var allLines = multiplyRecipe(textBlock, factor);
	// 	// print the new value to the screen
	// 	for (var i = 0; i < allLines.length; i++) {
	// 		allLines[i]
	// 		// $("#converted-recipe").append("<li>"+ allLines[i] +"</li>");
	// 		$("#converted-recipe p").append(allLines[i]+"<br />");
	// 	};
	// });

	function outputRecipe(textBlock) {		
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

	// function nbspCount (count) {
	// 	output = "";
	// 	for (var i = 0; i < count; i++) {
	// 		output += "&nbsp;";
	// 	};
	// 	return output;
	// }

	function highlight(inputInfo) {
		// <lead space>1 1/2<mid space>cup ingredit
		// ingredent contains its own lead white space
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