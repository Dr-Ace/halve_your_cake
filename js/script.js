
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
		el: '#recipe_input',
		className: 'input_area',
		events: {
			'keyup': 'textChanged',
			'paste': 'pasteText'
		},
		textChanged: function(){
			this.model.set('recipe', $("#recipe_input").val());			
		},
		pasteText: function(){
			// contents not yet populated immediately afer paste action
			var parent = this;
		 	setTimeout(function () {
		 		parent.textChanged();
		  }, 100);
		}
	})

	var OutputView = Backbone.View.extend({
		el: '#converted-recipe',
		initialize: function() {
			this.render();
			this.model.on('change', this.render, this);
		}, 
		render: function(){
			this.$el.html(this.model.get('recipe'));
			return this;
		}
	})

	var ShadowTextView = Backbone.View.extend({
		el: '#backmodel',
		//apply the highlight() function to the contents of the textarea and output it.
		highlight: function(){
			highlight(inputView.val()) },
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		render: function(){
			this.$el.html(this.model.get('recipe'));
			return this;
		}
	})

	var FactorView = Backbone.View.extend({
		el: '#factor-list',
		events: {
			'change' : 'getFactor'
		},
		getFactor: function() {
			this.model.set('value', this.$el.val());
		},
		sayYay: function(){
			console.log('models changed');
		}
	});

// Models
var inputModel  = new Input();
var outputModel = new Output();
var factor      = new Factor();
var shadowModel = new ShadowOutput();

$(document).ready(function(){


	// Views
	var inputView    	= new InputView({model: inputModel});
	var shadowTextView 	= new ShadowTextView({model: shadowModel});
	var outputView    	= new OutputView({model: outputModel});
	var factorView   	= new FactorView({model: factor});

	// Logic
	function updateOutput() {
		var factorValue = factor.get('value');
		var results = outputRecipe(inputModel.get('recipe'));
		outputModel.set('recipe', results.output);
		shadowModel.set('recipe', results.highlights);
	}

	inputModel.on('change', updateOutput, this);
	factor.on('change', updateOutput, this);


});

////////////////////

$('textarea').autosize();

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


function highlight(inputInfo) {
	// <lead space>1 1/2<mid space>cup ingredit
	// ingredent contains its own lead white space
	var preSpace = inputInfo.text.slice(0,inputInfo.quantityInfo.start)//.replace(/\s/g,'&nbsp;');
	var quantity = inputInfo.text.slice(inputInfo.quantityInfo.start, inputInfo.quantityInfo.end +1)//.replace(/\s/g,'&nbsp;');
	var midSpace = inputInfo.text.slice(inputInfo.quantityInfo.end+1, inputInfo.unitInfo.start);//.replace(/\s/g,'&nbsp;');
	var unit = inputInfo.text.slice(inputInfo.unitInfo.start, inputInfo.unitInfo.end);
	var ingredient = inputInfo.text.slice(inputInfo.unitInfo.end)

	return preSpace+'<span class="quantity">' + quantity + '</span>'+midSpace+'<span class="unit">' + unit + '</span>'+ingredient ;
}

	
