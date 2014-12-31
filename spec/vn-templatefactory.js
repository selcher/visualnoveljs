describe( 'TemplateFactory class', function() {

	var templateFactory = TemplateFactory();
	var templates = {

		'novelcontainer' : [
			"<div class='novel-container unSelectable'>",
				"<div id='{novelId}-screen-start' class='novel screen-start'></div>",
				"<div id='{novelId}-dialog-menu' class='novel dialog-menu'></div>",
				"<div id='{novelId}-dialog-novelmode' class='novel dialog-novelmode'></div>",
				"<div id='{novelId}-dialog-dialogmode' class='novel dialog-dialogmode'></div>",
				"<div id='{novelId}-screen-character' class='novel screen-character'></div>",
				"<div id='{novelId}-screen-scene' class='novel screen-scene'></div>",
				"<div id='{novelId}-screen-bg' class='novel screen-bg'></div>",
				"<div id='{novelId}-images' style='display:none;'></div>",
			"</div>"
		],
		'startmenu' : [
			"<div id='{novelId}-novelTitleContainer' class='novelTitleContainer'>",
				"<div id='{novelId}-novelTitleText' class='novelTitleText'>{novelTitle}</div>",
				"<div id='{novelId}-novelSubtitleText' class='novelSubtitleText'>{novelSubtitle}</div>",
			"</div>",
			"<div id='{novelId}-startMenuButtonContainer' class='startMenuButtonContainer'>",
				"<button id='{novelId}-startMenuButton' class='startMenuButton' >",
				"START</button>",
			"</div>"
		],
		'say' : [
			"<if={showDialogImage}><img id='{novelId}-dialog-dialogImage' src='{dialogImage}' style='{dialogImageStyle}' /></if>",
			"<div id='{novelId}-dialog-dialogName' class='dialogName' style='{dialogNameStyle}'>{name}</div>",
			"<div id='{novelId}-dialog-dialogText' class='dialogText'>{dialogLine}</div>",
			"<if={showButtonText}><button id='{novelId}-dialog-dialogButton' class='dialogButton' >{dialogButtonText}</button></if>",
			"<if={showButtonImage}><img id='{novelId}-dialog-dialogButton' class='dialogButton' src='{dialogButtonImage}' style='{dialogButtonImageStyle}' /></if>"
		],
		'userinput' : [
			"<div id='userInputContainer' class='userInputContainer'>",
				"<div id='userInputMessage' class='userInputMessage'>{message}</div><hr/><br/>",
				"<input id='{novelId}-userInputText' class='userInputText' type='text' /><br/><br/>",
				"<input type='button' id='{novelId}-userInputButton' class='userInputButton' value='OK' />",
			"</div>"
		],

		// For choice menu:
		// 1. build choice buttons
		// 2. build choice image
		// 3. insert buttons and image to menu container
		'menuchoice' : [
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
		]

	};

	it( 'init', function() {

		var vnTemplates = templateFactory.templates;

		expect( vnTemplates[ 'novelcontainer' ] ).toEqual( templates[ 'novelcontainer' ] );
		expect( vnTemplates[ 'startmenu' ] ).toEqual( templates[ 'startmenu' ] );
		expect( vnTemplates[ 'say' ] ).toEqual( templates[ 'say' ] );
		expect( vnTemplates[ 'userinput' ] ).toEqual( templates[ 'userinput' ] );
		expect( vnTemplates[ 'menuchoice' ] ).toEqual( templates[ 'menuchoice' ] );

	} );

	it( 'get', function() {

		expect( templateFactory.get( 'novelcontainer' ) ).toEqual( templates[ 'novelcontainer' ].join( '' ) );
		expect( templateFactory.get( 'startmenu' ) ).toEqual( templates[ 'startmenu' ].join( '' ) );
		expect( templateFactory.get( 'say' ) ).toEqual( templates[ 'say' ].join( '' ) );
		expect( templateFactory.get( 'userinput' ) ).toEqual( templates[ 'userinput' ].join( '' ) );
		expect( templateFactory.get( 'menuchoice' ) ).toEqual( templates[ 'menuchoice' ].join( '' ) );

	} );

	it( 'set', function() {

		var newTemplate = [ '<div>test</div>' ];
		templateFactory.set( 'test', newTemplate );
		expect( templateFactory.templates[ 'test' ] ).toEqual( newTemplate );

	} );

} );