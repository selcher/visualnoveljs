describe( 'Parser class', function() {

	var parser = Parser();

	it( 'parseConditionsInTemplate', function() {

		// parseConditionsInTemplate
		var template = [
			'<if={delay}><button>OK</button></if>',
			'<if={delay}><button>Cancel</button></if>'
		].join( '' );
		var values = { delay : true };
		var parsedTemplate = parser.parseConditionsInTemplate( template, values );
		expect( parsedTemplate ).toEqual( '<button>OK</button><button>Cancel</button>' );

	} );

	it( 'parseLoopsInTemplate', function() {

		// parseLoopsInTemplate
		template = '<foreach={choice in choices}><button>{choice.label}</button></foreach>';
		values = { choices : [ { label:'new' }, {label:'continue'}, {label:'exit'} ] };
		parsedTemplate = parser.parseLoopsInTemplate( template, values );
		expect( parsedTemplate ).toEqual( 
			'<button>new</button><button>continue</button><button>exit</button>' );

	} );

	it( 'parseTemplate', function() {

		// parseTemplate
		template = [
			"<div id='{novelId}-dialogMenuChoiceContainer' class='dialogMenuChoiceContainer'>",
				"<div id='{novelId}-dialogMenuChoiceButtonsContainer' class='dialogMenuChoiceButtonsContainer'>",
					"<foreach={choice in choices}>",
						"<button class='dialogMenuChoiceButton' id='{novelId}-dialogMenuChoiceButton{index}' >",
							"{choice.label}",
						"</button><br/>",
					"</foreach>",
				"</div>",
				"<div id='{novelId}-dialogMenuChoiceImageContainer' class='dialogMenuChoiceImageContainer'>",
					"<if={imgPath}><img src='{imgPath}' style='width:{imgWidth}px;height:{imgHeight}px;' /></if>",
				"</div>",
			"</div>"
		].join( '' );
		values = {
			novelId : 'test',
			choices : [ { label:'new' }, {label:'continue'}, {label:'exit'} ],
			imgPath : 'img/test.jpg',
			imgWidth : 100,
			imgHeight : 100
		};
		parsedTemplate = parser.parseTemplate( template, values );
		var result = [
			"<div id='test-dialogMenuChoiceContainer' class='dialogMenuChoiceContainer'>",
				"<div id='test-dialogMenuChoiceButtonsContainer' class='dialogMenuChoiceButtonsContainer'>",
					"<button class='dialogMenuChoiceButton' id='test-dialogMenuChoiceButton0' >",
						"new",
					"</button><br/>",
					"<button class='dialogMenuChoiceButton' id='test-dialogMenuChoiceButton1' >",
						"continue",
					"</button><br/>",
					"<button class='dialogMenuChoiceButton' id='test-dialogMenuChoiceButton2' >",
						"exit",
					"</button><br/>",
				"</div>",
				"<div id='test-dialogMenuChoiceImageContainer' class='dialogMenuChoiceImageContainer'>",
					"<img src='img/test.jpg' style='width:100px;height:100px;' />",
				"</div>",
			"</div>"
		].join( '' );
		expect( parsedTemplate ).toEqual( result );

	} );

} );