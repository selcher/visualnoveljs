( function( VN ) {

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

	/**
	 * Function: TemplateFactory
	 *
	 */
	function TemplateFactory( templates ) {

		var template = null;

		if ( this instanceof TemplateFactory ) {

			this.templates = templates ? templates : {};

			template = this;

		} else {

			template = new TemplateFactory( templates );

		}

		return template;

	}

	/**
	 * Function: get
	 *
	 * Get a template
	 *
	 * @param name
	 */
	TemplateFactory.prototype.get = function get( name ) {

		var templates = this.templates;
		var template = templates[ name ] ? templates[ name ].join( '' ) : '';

		return template;

	};

	/**
	 * Function: set
	 *
	 * Store a template
	 *
	 * @param name
	 * @param template
	 */
	TemplateFactory.prototype.set = function set( name, template ) {

		this.templates[ name ] = template;

		return this;

	};

	/**
	 * Attach module to namespace
	 */
	 VN.prototype.templates = new TemplateFactory( templates );

} )( window.VisualNovel = window.VisualNovel || {} );