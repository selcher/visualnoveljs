( function( VN ) {

	// Use in config
	VN.prototype.setDialogBgImage = function setDialogBgImage( img, width, height ) {

		this.dialog.setDialogBgImage( this.imgPath + img, width, height );

	};

	// Use in config
	VN.prototype.setDialogBgColor = function setDialogBgColor( color ) {

		this.dialog.setDialogBgColor( color );

	};

	// Use in config
	VN.prototype.setDialogTextColor = function setDialogTextColor( color ) {

		this.dialog.setDialogTextColor( color );

	};

	// Use in config
	VN.prototype.setDialogBorderStyle = function setDialogBorderStyle( img, color, width, radius ) {

		this.dialog.setDialogBorderStyle( this.imgPath + img, color, width, radius );

	};

	VN.prototype.updateDialogBorderStyle = function updateDialogBorderStyle( img, color, width, radius ) {

		var self = this;
		var imgUrl = this.imgPath + img;

		function eventToAdd() {
			
			self.dialog.setDialogBorderStyle( imgUrl, color, width, radius );
		
		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	/**
	 * Function: setNovelMode
	 * 
	 * Set the mode of the novel : dialog/novel
	 * set the size and position of the dialog
	 * 
	 * Convenient method for updating size & positon at the same time
	 *
	 * @param model
	 * @param width
	 * @param height
	 * @param x
	 * @param y
	 *
	 */
	VN.prototype.setNovelMode = function setNovelMode( mode, width, height, x, y ) {

		var self = this;
		var newPos = this.util.scalePosition( 
			{
				"x": x ? x : 0, 
				"y": y ? y : self.sceneHeight
			},
			{ 
				"x": self.screenWidth, 
				"y": self.screenHeight
			}
		);

		function eventToAdd() {

			self.dialog.setNovelMode( mode, width, height, newPos.x, newPos.y );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.buildSayDialog = function buildSayDialog( character, line, delay, novelMode ) {

		var sayTemplate = this.getSayTemplate( character, line, delay );

		this.dialog.setSayDialogContainer( sayTemplate, novelMode );

	};

	/**
	 * Variable: sayTemplate
	 *
	 * Template for say lines.
	 */
	VN.prototype.sayTemplate = [
		"<if={showDialogImage}><img id='{novelId}-dialog-dialogImage' src='{dialogImage}' style='{dialogImageStyle}' /></if>",
		"<div id='{novelId}-dialog-dialogName' class='dialogName' style='{dialogNameStyle}'>{name}</div>",
		"<div id='{novelId}-dialog-dialogText' class='dialogText'>{dialogLine}</div>",
		"<if={showButtonText}><button id='{novelId}-dialog-dialogButton' class='dialogButton' >{dialogButtonText}</button></if>",
		"<if={showButtonImage}><img id='{novelId}-dialog-dialogButton' class='dialogButton' src='{dialogButtonImage}' style='{dialogButtonImageStyle}' /></if>"
	].join( "" );

	VN.prototype.getSayTemplate = function getSayTemplate( character, line, delay ) {

		// variables to replace in template
		var templateVariables = this.getSayTemplateVariables( character, line, delay );

		// get template
		var sayTemplate = this.parser.parseTemplate( this.sayTemplate, templateVariables );

		// debug
		// console.log( templateVariables );
		// console.log( sayTemplate );

		return sayTemplate;

	};

	VN.prototype.getSayTemplateVariables = function getSayTemplateVariables( character, line, delay ) {

		var isCharacterObject = typeof character === "object";
		var name = isCharacterObject ? character.name : character;
		var dialogNameStyle = isCharacterObject ? character.nameStyle : "";
		var dialogLine = this.parser.replaceVariablesInText( line, this.userInput );

		var characterDialogSettings = character.dialog;
		var dialogSettings = characterDialogSettings ? true : false;

		var dialogImage = "";
		var dialogImageWidth = "";
		var dialogImageHeight = "";
		var dialogImageLocation = "";
		var dialogImageBorder = "";

		var showButtonText = delay ? false : true;
		var dialogButtonText = "OK";

		var showButtonImage = false;
		var dialogButtonImage = "";
		var dialogButtonImageWidth = "";
		var dialogButtonImageHeight = "";

		if ( dialogSettings ) {

			// TODO: refactor getting total img path??
			// e.g. this.imgPath + character.dialogImage => this.getImgPath( character.dialogImage )

			dialogImage = characterDialogSettings.image ?
				this.imgPath + characterDialogSettings.image : "";
			dialogImageWidth = characterDialogSettings.width ?
				"width:" + characterDialogSettings.width + "px;" : "";
			dialogImageHeight = characterDialogSettings.height ?
				"height:" + characterDialogSettings.height + "px;" : "";
			dialogImageLocation = characterDialogSettings.location ?
					"float:" + characterDialogSettings.location + ";" : "";
			dialogImageBorder = dialogImageLocation ? 
				( dialogImageLocation === "left" ? "margin-right:10px;" : "margin-left:10px;" ) :
				"";
			var dialogButton = characterDialogSettings.button;
			
			// dialogButtonImage
			showButtonImage = delay ? false : 
				dialogButton && dialogButton.image ? dialogButton.image : false;
			dialogButtonImage = showButtonImage ? 
				this.imgPath + dialogButton.image : "";
			dialogButtonImageWidth = showButtonImage ? 
				"width:" + dialogButton.width + "px;" : "";
			dialogButtonImageHeight = showButtonImage ? 
				"height:" + dialogButton.height + "px;" : "";
			
			// dialogButtonText
			showButtonText = delay || showButtonImage ? false :
				dialogButton && dialogButton.text ? dialogButton.text : true;
			dialogButtonText = dialogButton && dialogButton.text ? dialogButton.text : "OK";

		}

		// TODO : build style here instead of replacing it in the template!! only style variable in template...
		
		var templateVariables = {
			"novelId": this.novelId,
			"name": name,
			"dialogNameStyle": dialogNameStyle,
			"dialogLine": dialogLine,

			"showDialogImage": dialogSettings,
			"dialogImage": dialogImage,
			"dialogImageStyle": dialogImageLocation + dialogImageWidth + dialogImageHeight + dialogImageBorder,

			"showButtonText": showButtonText,
			"dialogButtonText": dialogButtonText,

			"showButtonImage": showButtonImage,
			"dialogButtonImage": dialogButtonImage,
			"dialogButtonImageStyle": dialogButtonImageWidth + dialogButtonImageHeight
		};

		return templateVariables;

	};

	VN.prototype.showSayDialog = function showSayDialog( show ) {

		var self = this;

		function callShowSayDialog() {

			self.dialog.setSayDialogDisplay( show, self.novelMode );

		}

		this.eventTracker.addEvent( "nowait", callShowSayDialog );

	};











	VN.prototype.addCondition = function addCondition( var1, operator, var2, successCallback, failCallback ) {

		var self = this;
		var operations = {
			"=": function( value1, value2 ) {
				return value1 === value2;
			},
			">": function( value1, value2 ) {
				return value1 > value2;
			},
			"<": function( value1, value2 ) {
				return value1 < value2;
			},
			"!=": function( value1, value2 ) {
				return value1 != value2;
			}
		};
		var operation = operations[ operator ];

		function eventToAdd() {

			var userInput = self.userInput;
			var conditionResult = operation ?
				operation( userInput[ var1 ], var2 ) : false;

			var eventTracker = self.eventTracker;
			var totalEventsInProgress = eventTracker.eventsInProgress.length;
			var choiceEventId = eventTracker.eventsInProgress[ totalEventsInProgress - 1 ] + 
								"-condition-" + totalEventsInProgress;

			// add new event
			eventTracker.addNewEventInProgress( choiceEventId );

			// register success or fail events
			if ( conditionResult ) {
				successCallback();
			} else {
				failCallback();
			}

			// call success or fail events
			eventTracker.startEvent();

		}

		// wait for condition success or fail events to register
		// then call startEvent
		this.eventTracker.addEvent( "wait", eventToAdd );

	};











	VN.prototype.sayLine = function sayLine( character, line, delay ) {

		var self = this;
		var imgPath = this.imgPath;

		var characterObject = typeof character === "object";
		var characterDialog = characterObject && character.dialog ? character.dialog : null;
		var dialogButton = characterDialog && characterDialog.button ? characterDialog.button : null;

		var delayTime = delay;

		var showLineByEachChar = typeof delay === "object";
		var showDialogButton = typeof delay === "undefined";

		if ( showLineByEachChar ) {

			delayTime = delay.interval * line.length + ( delay.delay ? delay.delay : 0 );
			
			if ( delay.button ) {
				
				delayTime = 0;
				showDialogButton = true;
			
			}
		}

		function callSayLine() {

			// Debug
			// console.log( "say line:", line, delay );

			var mode = self.novelMode;

			// Steps:
			// 1. show say dialog container
			// 2. build say dialog container
			// 3. update references to divs and button in container
			// 4. set text in container (TODO: add text later after building container)
			self.dialog.setSayDialogDisplay( true, mode );

			self.buildSayDialog( character, showLineByEachChar ? "" : line, delayTime, mode );

			self.dialog.updateSayDialogReference();

			if ( showDialogButton ) {

				self.dialog.updateDialogButton( characterDialog, imgPath,  function() {

					self.eventTracker.nextEvent();

				} );

			}

			if ( showLineByEachChar ) {

				// replace variables in line
				var dialogLine = self.parser.replaceVariablesInText( line, self.userInput );
				
				self.dialog.showTextByChar( dialogLine, 0, delay.interval );

			}
		}

		this.eventTracker.addEvent( delayTime ? "nowait" : "wait", callSayLine, delayTime );

	};

	VN.prototype.sayLineExtend = function sayLineExtend( line, delay ) {

		var self = this;

		function callSayLineExtend() {

			self.dialog.setSayDialogText( line, true );

		}

		this.eventTracker.addEvent( delay ? "nowait" : "wait" , callSayLineExtend, delay );

	};

	VN.prototype.sayMultipleLines = function sayMultipleLines( character, line ) {

		// TODO : refactor... too long...
		// [ line, delay, includePrevLinesFlag ]
		// line => sayLine
		// line, delay => sayLine
		// line, includePrevLinesFlag => sayLine ( include previous extend lines )
		// line, delay, includePrevLinesFlag => sayLineExtend
		// line, interval (object) => sayLine

		var util = this.util;
		var NoOfLines = line.length;
		var lines = [];
		var temp = [];
		var nextIndex = null;

		// build list of [ line, delay, includePrevLinesFlag ]
		util.foreach( line, function( l, i ) {

			if ( typeof l === "string" ) {
				
				temp.push( l );
				nextIndex = i + 1;

				// delay (number) passed
				if ( nextIndex < NoOfLines && typeof line[ nextIndex ] === "number" ) {

					temp.push( line[ nextIndex ] );
				
				}

				// include previous line flag ( after line or delay argument ) passed
				// if not passed, add the next line to the current dialog
				if ( nextIndex < NoOfLines && typeof line[ nextIndex ] === "boolean" ) {

					temp.push( 0, line[ nextIndex ] );

				} else if ( nextIndex + 1 < NoOfLines && typeof line[ nextIndex + 1 ] === "boolean" ) {

					temp.push( line[ nextIndex + 1 ] );	

				}

				// interval per character passed
				if ( nextIndex < NoOfLines && typeof line[ nextIndex ] == "object" ) {

					temp.push( line[ nextIndex ] );

				}

				lines.push( temp );
			}

			temp = [];
		
		} );

		util.foreach( lines, function( l, i ) {

			// TODO: add comments!! =3
			// 0 = line, 1 = delay / interval, 2 = include previous lines flag

			// last parameter is inclue previous line flag
			if ( typeof l[ l.length -1 ] === "boolean" ) {

				if ( l[ 1 ] === 0 ) {

					// delay is 0, so sayLine to show OK button
					// including previous lines
					var content = temp.join( "" ) + l[ 0 ];
					temp = [];
					this.sayLine( character, content );

				} else {

					temp.push( l[ 0 ] );
					this.sayLineExtend.apply( this, l );

				}

			} else if ( typeof l[ 1 ] === "object" ) {

				// interval (object) passed
				this.sayLine( character, l[ 0 ], l[ 1 ] );

			} else {

				if ( l[ 1 ] ) {

					// delay provided, so store to include
					// in the next say if includePrevLinesFlag
					temp.push( l[ 0 ] );

				} else {

					temp = [];
				
				}

				l.unshift( character );
				this.sayLine.apply( this, l );

			}

		}.bind( this ) );

	};

	VN.prototype.say = function say( character, line, delay ) {

		var length = arguments.length;
		var isCharObj = typeof character === "object";
		var isCharStr = typeof character === "string";
		var isCharObjStr = isCharObj || isCharStr;

		// say( "me", "hello" )
		// say( charObj, "hello" )
		if ( isCharObjStr && typeof line === "string" ) {
			
			this.dialogCharacter = character;
			this.sayLine( character, line, delay );
		
		}

		// say( charObj, [ "hello", "world" ] )
		if ( isCharObjStr && this.util.isArray( line ) ) {

			this.dialogCharacter = character;
			this.sayMultipleLines( character, line );

		}

		// say( "hello" )
		// say( "hello", 1000 )
		if ( isCharStr && ( length === 1 || 
			( length === 2  && typeof line === "number" ) ) ) {

			this.sayLine( this.dialogCharacter, character, line );

		}

	};











	// Add module
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {

				var dialog = this.dialog = new Dialog(
					novelId,
					this.screenWidth,
					150,
					0,
					this.screenHeight - 150
				);

				dialog.init();

			},
			"reset": function reset() {}
		}
	);

	/**
	 * Class Dialog
	 */
	function Dialog( novelId, width, height, x, y ) {

		if ( this instanceof Dialog ) {

			this.novelId = novelId;

			// dialog or novel
			this.novelMode = "dialog";

			// dialog div elements
			this.novelModeId = null;
			this.dialogModeId = null;
			this.dialogButtonId = null;
			this.dialogImageId = null;
			this.dialogTextId = null;

			// dialog
			this.dialogWidth = width;
			this.dialogHeight = height;
			this.x = x;
			this.y = y;

			this.dialogPadding = {
				"top": 10,
				"right": 10,
				"bottom": 10,
				"left": 10
			};
			this.dialogBorder = {
				"top": 10,
				"right": 50,
				"bottom": 10,
				"left": 50
			};
			this.dialogTextColor = "white";
			this.dialogBgColor = "rgba(0,0,0,0.5)";

			// dialog bg image ( not yet implemented / tested )
			this.dialogBgImage = "";
			this.dialogBgImageWidth = 0;
			this.dialogBgImageHeight = 0;

			// dialog button
			this.dialogButtonSize = {
				"width": 40,
				"height": 30
			};
			this.dialogButtonPos = {
				"left": width - this.dialogPadding.right - this.dialogButtonSize.width,
				"bottom": 0
			};

			// dialog character
			this.dialogCharacter = null;

			// timers
			this.timers = {
				"text": null
			};

			return this;

		} else {

			return new Dialog();			

		}

	}

	Dialog.prototype.init = function() {

		var novelId = this.novelId;
		var doc = document;

		this.novelModeId = doc.getElementById( novelId + "-dialog-novelmode" );
		this.dialogModeId = doc.getElementById( novelId + "-dialog-dialogmode" );

		// Init novel mode container ( not implemented - hide )
		this.hideNovelModeContainer();

		// Init dialog mode container
		this.setSayDialogDisplay( false );
		this.setDialogModeContainerSize( this.dialogWidth, this.dialogHeight );
		this.setDialogModeContainerPosition( this.x, this.y );
		this.setDialogTextColor( this.dialogTextColor );
		this.setDialogBgColor( this.dialogBgColor );

		// not yet implemented / tested
		// this.setDialogBgImage( this.dialogBgImage, this.dialogBgImageWidth, this.dialogBgImageHeight );

	};

	Dialog.prototype.hideNovelModeContainer = function hideNovelModeContainer() {

		this.novelModeId.style.display = "none";

	};

	Dialog.prototype.setDialogModeContainerSize = function setDialogModeContainerSize( width, height ) {

		var newSize = this.calculateDialogModeContainerSize( width, height );
		var newStyle = ";width:" + newSize.width + ";height:" + newSize.height + ";";

		this.dialogModeId.style.cssText += newStyle;

		// store new size
		this.dialogWidth = width;
		this.dialogHeight = height;

	};

	Dialog.prototype.calculateDialogModeContainerSize = function calculateDialogModeContainerSize( width, height ) {

		var padding = this.dialogPadding;
		var contWidth = width ? width : this.dialogWidth;
		var contHeight = height ? height : this.dialogHeight;
		
		var size = {
			"width": ( contWidth - padding.left - padding.right ) + "px",
			"height": ( contHeight - padding.top - padding.bottom ) + "px"
		};

		return size;

	};

	Dialog.prototype.setDialogModeContainerPosition = function setDialogModeContainerPosition( x, y ) {

		var newStyle = ";left:" + x + "px;top:" + y + "px;";

		this.dialogModeId.style.cssText += newStyle;

	};

	Dialog.prototype.setDialogBgImage = function setDialogBgImage( imgUrl, width, height ) {

		var bgImg = imgUrl ? ";background-image:url('" + imgUrl + "');" : ";";
		var bgSize = width && height ? 
			"width:" + width + "px;height: " + height + "px;" : "";
		var newStyle = bgImg + bgSize;

		this.dialogModeId.style.cssText += newStyle;

	};

	Dialog.prototype.setDialogBgColor = function setDialogBgColor( color ) {

		this.dialogModeId.style[ "background-color" ] = color ? color : "black";

	};

	Dialog.prototype.setDialogTextColor = function setDialogTextColor( color ) {

		this.dialogModeId.style.color = color ? color : "white";

	};

	Dialog.prototype.setDialogBorderStyle = function setDialogBorderStyle( imgUrl, color, width, radius ) {

		var padding = this.dialogPadding;

		// not yet implemented
		var borderImg = imgUrl ? "url('" + imgUrl + "')" : "";

		var borderWidth = width ? 
			( typeof width === "string" ? width : width + "px" ) : "";
			borderWidth = borderWidth === "" ? ";" : ";border-width:" + borderWidth + ";";
		var borderStyle = "border-style:solid;";
		var borderColor = color ? color : "rgba( 0, 0, 0, 0.5 )";
			borderColor = "border-color:" + borderColor + ";";
		var borderRadius = radius ? 
			( typeof radius === "string" ? radius : radius + "px" ) : "";
			borderRadius = borderRadius === "" ? "" : "border-radius:" + borderRadius + ";";

		var newStyle = borderWidth + borderStyle + borderColor + borderRadius;

		this.dialogModeId.style.cssText += newStyle;

		// Update dialog container size
		this.setDialogModeContainerSize( this.dialogWidth, this.dialogHeight );

	};

	Dialog.prototype.setDialogButtonPosition = function setDialogButtonPosition( x, y ) {

		// dialogButtonPos = { left : .., bottom : .. }
		// position is stored in dialogButtonPos since the button is created dynamically
		// on button creation, the position is obtained from dialogButtonPos
		var buttonPos = this.dialogButtonPos;

		if ( typeof x !== "undefined" ) {
			buttonPos.left = x;
		}

		if ( typeof y !== "undefined" ) {
			buttonPos.bottom = y;
		}

	};

	Dialog.prototype.refreshDialogButtonPositionView = function refreshDialogButtonPositionView() {

		var buttonPos = this.dialogButtonPos;
		var newStyle = ";left:" + buttonPos.left + "px;bottom:" + buttonPos.bottom + "px;";

		this.dialogButtonId.style.cssText += newStyle;

	};

	Dialog.prototype.clearDialogImageAnimation = function clearDialogImageAnimation( dialogInfo, imgPath ) {

		// check if nextImage for character image animation in dialog is provided
		var clearImageAnimation = function() {};
		var dialogImageAnimationTimer = null;
		var dialogImageInitial = dialogInfo && dialogInfo.image ?
			imgPath + dialogInfo.image : "";
		var dialogImageNext = dialogInfo && dialogInfo.nextImage ?
			imgPath + dialogInfo.nextImage : "";
		var dialogImageAnimationTimerDelay = dialogInfo && dialogInfo.imageDelay ?
			dialogInfo.imageDelay : 5000;

		if ( dialogInfo && dialogInfo.nextImage ) {

			// debug
			// console.log( "start timer" );

			var dialogImageElem = this.dialogImageId;
			
			dialogImageAnimationTimer = setInterval( function() {

				requestAnimationFrame( function() {
					
					dialogImageElem.setAttribute( "src", dialogImageNext );
				
				} );

				setTimeout( function() {
				
					requestAnimationFrame( function() {
						
						dialogImageElem.setAttribute( "src", dialogImageInitial );
					
					} );
				
				}, 200 );

			}, dialogImageAnimationTimerDelay );

			clearImageAnimation = function() {
				
				window.clearInterval( dialogImageAnimationTimer );
			
			};

		}

		return clearImageAnimation;

	};

	Dialog.prototype.updateDialogButtonListeners = function updateDialogButtonListeners( dialogButton, imgPath, callback ) {

		// TODO : refactor... too long

		var dialogButtonElem = this.dialogButtonId;

		// check if bgColor for dialog button is provided
		var hasDialogButtonBgColor = dialogButton && dialogButton.bgColor && dialogButton.bgColorHover;
		
		var bgColorOnMouseOver = dialogButton && dialogButton.bgColorHover ? dialogButton.bgColorHover : "transparent";
		var callBgColorOnMouseOver = hasDialogButtonBgColor ?
			function() { dialogButtonElem.style[ "background-color" ] = bgColorOnMouseOver; } : 
			function() {};

		var bgColorOnMouseLeave = dialogButton && dialogButton.bgColor ? dialogButton.bgColor : "transparent";
		var callBgColorOnMouseLeave = hasDialogButtonBgColor ?
			function() { dialogButtonElem.style[ "background-color" ] = bgColorOnMouseLeave; } : 
			function() {};
		
		// check if image for dialog button is provided
		var hasDialogButtonImage = dialogButton && dialogButton.image && dialogButton.imageHover;
		var imageOnMouseOver = dialogButton && dialogButton.imageHover ?
			imgPath + dialogButton.imageHover : "";
		var callImageOnMouseOver = hasDialogButtonImage ?
			function() { dialogButtonElem.setAttribute( "src", imageOnMouseOver ); } : 
			function() {};
		var imageOnMouseLeave = dialogButton && dialogButton.image ? 
			imgPath + dialogButton.image : "";
		var callImageOnMouseLeave = hasDialogButtonImage ?
			function() { dialogButtonElem.setAttribute( "src", imageOnMouseLeave ); } : 
			function() {};

		// TODO: create another function for adding handlers...
		dialogButtonElem.onmouseover = function onMouseOverDialogButton( e ) {

			callBgColorOnMouseOver();
			callImageOnMouseOver();

		};

		dialogButtonElem.onmouseleave = function onMouseOverDialogButton( e ) {

			callBgColorOnMouseLeave();
			callImageOnMouseLeave();

		};

		// TODO: check for text
		// Proceed to next event on click
		dialogButtonElem.onclick = function clickDialogButton( e ) {
					
			// perform passed callback when button is clicked
			// e.g. clear timeout for showing line by each char
			callback();

		};

	};

	Dialog.prototype.setNovelMode = function setNovelMode( mode, width, height, x, y ) {

		var size = typeof width !== "undefined" && typeof height !== "undefined";
		var pos = typeof x !== "undefined" && typeof y !== "undefined";

		self.novelMode = mode ? mode : "dialog";

		if ( size ) {

			this.setDialogModeContainerSize( width, height );

			this.setDialogButtonPosition( width - this.dialogPadding.right - this.dialogButtonSize.width );

		}

		if ( pos ) {

			this.setDialogModeContainerPosition( x, y );

		}

	};

	Dialog.prototype.setSayDialogContainer = function setSayDialogContainer( template, novelMode ) {

		var mode = novelMode ? novelMode : this.novelMode;
		var containerId = mode === "novel" ? "novelModeId" : "dialogModeId";

		this[ containerId ].innerHTML = template;

	};

	Dialog.prototype.setSayDialogText = function setSayDialogText( line, isAppend ) {

		this.dialogTextId.innerHTML = isAppend ? this.dialogTextId.innerHTML + line : line;

	};

	Dialog.prototype.updateSayDialogReference = function updateSayDialogReference() {

		var novelId = this.novelId;
		var doc = document;

		this.dialogImageId = doc.getElementById( novelId + "-dialog-dialogImage" );

		this.dialogTextId = doc.getElementById( novelId + "-dialog-dialogText" );

	};

	Dialog.prototype.updateSayDialogButtonReference = function updateSayDialogButtonReference() {

		this.dialogButtonId = document.getElementById( this.novelId + "-dialog-dialogButton" );

	};

	Dialog.prototype.setSayDialogDisplay = function setSayDialogDisplay( show, novelMode ) {

		var mode = novelMode ? novelMode : this.novelMode;
		var display = show ? "block" : "none";

		if ( mode === "dialog" ) {
		
			this.dialogModeId.style.display = display;
			this.novelModeId.style.display = "none";
		
		} else if ( mode === "novel" ) {
		
			this.dialogModeId.style.display = "none";
			this.novelModeId.style.display = display;
		
		}

	};

	Dialog.prototype.resetNovelDialogText = function resetNovelDialogText() {

		this.novelModeId.innerHTML = "";
		this.dialogModeId.innerHTML = "";

	};

	Dialog.prototype.showTextByChar = function showTextByChar( message, index, interval ) {

	 	if ( index < message.length ) {

	    	this.setSayDialogText( message[ index++ ], true );

	    	this.timers.text = setTimeout( function () {

	    		this.showTextByChar( message, index, interval );

	    	}.bind( this ), interval );

		} else {

			this.timers.text = null;

		}

	};

	Dialog.prototype.clearTimer = function clearTImer( timerName ) {

		var timer = this.timers[ timerName ];

		if ( timer ) {

			clearTimeout( timer );
			this.timers[ timerName ] = null;
		
		}

	};

	Dialog.prototype.updateDialogButton = function updateDialogButton( dialogInfo, imgPath, callback ) {

		var self = this;
		var dialogButton = dialogInfo && dialogInfo.button ?
			dialogInfo.button : null;

		this.updateSayDialogButtonReference();

		// Set button position
		// Update button position based on image width
		if ( dialogButton && dialogButton.width ) {

			var dialogPadding = this.dialogPadding;

			this.setDialogButtonPosition( this.dialogWidth - 
				dialogPadding.right - dialogPadding.left - dialogButton.width );

		}

		this.refreshDialogButtonPositionView();

		var clearImageAnimation = this.clearDialogImageAnimation( dialogInfo, imgPath );

		this.updateDialogButtonListeners( dialogButton, imgPath, function onDialogButtonClick() {
			
			self.clearTimer( "text" );

			callback();

			clearImageAnimation();

		} );

	};

} )( window.VisualNovel = window.VisualNovel || {} );