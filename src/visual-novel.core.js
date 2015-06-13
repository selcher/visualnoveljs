/*!
 * Visual Novel JS
 * version: 1.0-2014.06.15
 * Requires jQuery v1.5 or later and sprite3D.js
 * Copyright (c) 2014 Yuki selcher123@gmail.com
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Class: VisualNovel
 *
 * @param id = id of visual novel div
 *             used as reference for novel instance
 * @param width = width
 * @param height = height
 * @param imgPath = path to image folder
 */
function VisualNovel( id, width, height, imgPath ) {

	if ( this instanceof VisualNovel ) {

		this.novelId = id;
		this.novelTitle = "";
		this.novelSubtitle = "";
		this.novelMode = "dialog"; // dialog or novel
		this.imgPath = imgPath ? imgPath : "";

		// store images for preloading
		this.images = [];

		// div elements
		this.novelContainerId = null;
		this.novelTitleContainerId = null;
		this.novelTitleTextId = null;
		this.novelSubtitleTextId = null;
		this.screenStartId = null;
		this.screenStartMenuButtonContainerId = null;
		this.screenStartMenuStartButtonId = null;
		this.novelModeId = null;
		this.dialogModeId = null;
		this.dialogButtonId = null;
		this.dialogImageId = null;
		this.dialogTextId = null;
		this.dialogMenuId = null;
		this.screenCharacterId = null;
		this.screenSceneId = null;
		this.screenBgId = null;

		// TODO: place default values here...
		this.defaultVal = {};

		// TODO : Check if used...
		// TODO : implement one timer loop
		this.timers = {
			"dialog" : {
				"text" : null
			}
		};

		// scene
		this.sceneContainer = null;
		this.sceneFloor = null;
		this.scenes = {
			text : [],
			object : []
		};

		// character
		this.characterContainer = null;
		this.characters = [];

		// choice
		this.menuChoicesTaken = {};
		this.menuChoices = {};

		// input
		this.userInput = {};

		// screen
		this.screenWidth = width;
		this.screenHeight = height;

		// dialog
		this.dialogWidth = width;
		this.dialogHeight = 150;
		this.dialogPadding = {
			top : 10,
			right : 10,
			bottom : 10,
			left : 10
		};
		this.dialogBorder = {
			top : 10,
			right : 50,
			bottom : 10,
			left : 50
		};
		this.dialogTextColor = "white";
		this.dialogBgColor = "rgba(0,0,0,0.5)";
		this.dialogButtonSize = {
			width : 40,
			height : 30
		};
		this.dialogButtonPos = {
			left : width - this.dialogPadding.right - this.dialogButtonSize.width,
			bottom : 0
		};

		// dialog character
		this.dialogCharacter = null;

		// scene
		this.sceneHeight = this.screenHeight - this.dialogHeight;
		this.sceneFloorHeight = height > width ? height : width;
		this.sceneFloorWidth = height > width ? height : width;

		// TODO : refactor calculations

		this.templates = {

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

		return this;

	} else {

		return new VisualNovel( width, height, imgPath );

	}

}

/**
 * Function: init
 *
 * Initialize visualize novel
 * when creating a new VisualNovel instance
 *
 */
VisualNovel.prototype.init = function init() {

	this.initObjects();

	this.initContainers( this.novelId );

	this.initScreenStart( this.novelId );

};

/**
 * Function: initObjects
 *
 * Initialize objects used for class
 */
VisualNovel.prototype.initObjects = function initObjects() {

	this.util = new Util();
	this.parser = new Parser();
	this.eventTracker = new EventTracker();
	this.templates = new TemplateFactory( this.templates );

};

/**
 * Function: initContainers
 *
 * Add the dialog, character, scene and other containers
 * to the visual novel div
 */
VisualNovel.prototype.initContainers = function initContainers( novelId ) {

	this.initNovelContainer( novelId );

	this.initSceneContainer();
	this.initDialogMenuContainer();
	this.initNovelModeContainer();
	this.initDialogModeContainer();
	this.initCharacterContainer();
	this.initBGContainer();

};

/**
 * Function: pause
 *
 * Delay the execution of the next event
 *
 * @param delay = delay in milliseconds
 */
VisualNovel.prototype.pause = function pause( delay ) {

	var self = this;

	function eventToAdd() {
		
		setTimeout( function() {

			self.eventTracker.nextEvent();

		}, delay );

	}

	this.eventTracker.addEvent( "wait", eventToAdd );

};

/**
 * Function: repeatEvent
 *
 * Set to repeat the current event
 *
 * When the novel starts, the "main" event is called
 * An event is added when creating a choice
 */
VisualNovel.prototype.repeatEvent = function repeatEvent( ) {

	var self = this;

	function eventToAdd() {

		self.eventTracker.doRepeatEvent = true;

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

/**
 * Function: reset
 *
 * Reset novel to return to the start screen
 */
VisualNovel.prototype.reset = function reset() {

	var self = this;

	function eventToAdd() {

		self.resetNovel();
		self.showStartScreen( true );

	}

	this.eventTracker.addEvent( "wait", eventToAdd );

};

/**
 * Function: resetNovel
 *
 * Called when resetting the novel
 * reset events, menu choices, characters, scenes
 */
VisualNovel.prototype.resetNovel = function resetNovel() {

	this.eventTracker.resetEventsInProgress();
	this.resetMenuChoices();
	this.resetCharacters();
	this.resetScenes();
	this.resetLoops();

};

/**
 * Function: setNovelTitle
 *
 * Set the novel title in the model and view
 *
 * @param title = new novel title
 * @param subtitle = new novel subtitle
 */
VisualNovel.prototype.setNovelTitle = function setNovelTitle( title, subtitle ) {

	this.updateNovelTitleModel( title, subtitle );
	this.updateNovelTitleView( title, subtitle );

};

/**
 * Function: updateNovelTitleModel
 *
 * Set the novel title in the model
 *
 * @param title = new novel title
 * @param subtitle = new novel subtitle
 */
VisualNovel.prototype.updateNovelTitleModel = function updateNovelTitleModel( title, subtitle ) {

	this.novelTitle = title;
	this.novelSubtitle = subtitle;

};

/**
 * Function: updateNovelTitleView
 *
 * Set the novel title in the view
 *
 * @param title = new novel title
 * @param subtitle = new novel subtitle
 */
VisualNovel.prototype.updateNovelTitleView = function updateNovelTitleView( title, subtitle ) {

	this.novelTitleTextId.innerHTML = title;
	this.novelSubtitleTextId.innerHTML = subtitle;

};

/**
 * Function: setNovelTitlePosition
 *
 * Set the position of the novel title on the start screen
 *
 * @param x = distance from left
 * @param y = distance from top
 */
VisualNovel.prototype.setNovelTitlePosition = function setNovelTitlePosition( x, y ) {

	var pos = this.util.scalePosition(
			{
				x : x,
				y : y
			},
			{
				x : this.screenWidth,
				y : this.screenHeight
			}
		);

	// TODO: minimize reflows
	// http://jsperf.com/csstext-vs-multiple-css-rules/4
	// Using multiple style rule is efficient than cssText
	// but it does not consider reflow/repaint
	// so cssText may be better...probably
	var newStyle = ";left:" + pos.x + "px;top:" + pos.y + "px;";
	this.novelTitleContainerId.style.cssText += newStyle;

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
VisualNovel.prototype.setNovelMode = function setNovelMode( mode, width, height, x, y ) {

	var self = this;
	var size = typeof width !== "undefined" && typeof height !== "undefined";
	var pos = typeof x !== "undefined" && typeof y !== "undefined";

	function eventToAdd() {

		self.novelMode = mode ? mode : "dialog";

		if ( size ) {

			self.setDialogModeContainerSize( width, height );

			self.setDialogButtonPosition( width - self.dialogPadding.right - self.dialogButtonSize.width );

		}

		if ( pos ) {

			self.setDialogModeContainerPosition( x, y );

		}

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};










/**
 * Function: initNovelContainer
 *
 * Initialize novel container template, size, and references
 *
 * @param novelId = id of visual novel div, and instance reference
 *
 */
VisualNovel.prototype.initNovelContainer = function initNovelContainer( novelId ) {

	this.novelContainerId = document.getElementById( novelId );

	var content = this.buildNovelContainerContent( novelId );
	this.setNovelContainerContent( content );
	this.updateNovelContainerReference( novelId );
	this.setNovelContainerSize( this.screenWidth, this.screenHeight );

};

/**
 * Function: buildNovelContainer
 *
 * Build the html content for the novel container
 *
 * @param novelId = id of visual novel div, and instance reference
 */
VisualNovel.prototype.buildNovelContainerContent = function buildNovelContainerContent( novelId ) {

	var novelContainer = this.templates.get( "novelcontainer" );

	novelContainer = this.parser.parseTemplate( novelContainer, { novelId : novelId } );

	return novelContainer;

};

/**
 * Function: setNovelContainerContent
 *
 * Set the html content of the novel container
 *
 * @param content = content of the novel container
 */
VisualNovel.prototype.setNovelContainerContent = function setNovelContainerContent( content ) {

	this.novelContainerId.innerHTML = content;

};

/**
 * Function: updateNovelContainerReference
 *
 * Update html references to the start screen, dialog, choice menu,
 * character container, scene container, bg container
 *
 * @param novelId = id of visual novel div, and instance reference
 */
VisualNovel.prototype.updateNovelContainerReference = function updateNovelContainerReference( novelId ) {

	var doc = document;

	this.screenStartId = doc.getElementById( novelId + "-screen-start" );
	this.novelModeId = doc.getElementById( novelId + "-dialog-novelmode" );
	this.dialogModeId = doc.getElementById( novelId + "-dialog-dialogmode" );
	this.dialogMenuId = doc.getElementById( novelId + "-dialog-menu" );
	this.screenCharacterId = doc.getElementById( novelId + "-screen-character" );
	this.screenSceneId = doc.getElementById( novelId + "-screen-scene" );
	this.screenBgId = doc.getElementById( novelId + "-screen-bg" );

};

/**
 * Function: setNovelContainerSize
 *
 * Set the size of the main novel container, and the containers inside
 *
 * @param width = new width
 * @param height = new height
 */
VisualNovel.prototype.setNovelContainerSize = function setNovelContainerSize( width, height ) {

	// TODO : may need refactoring

	var novelContainer = this.novelContainerId;
	var containers = novelContainer ? novelContainer.getElementsByClassName( "novel" ) : [];
	var newStyle = ";overflow:hidden;width:" + width +
		"px;height:" + height + "px;";
	
	// novel container
	novelContainer.style.cssText += newStyle;

	// containers ( scene, character, dialog, menu, ... )
	this.util.foreach( containers, function( container ) {

		newStyle = ";width:" + width + "px;height:" + height + "px;";
		container.style.cssText += newStyle;
	
	} );

};










/**
 * Function: initScreenStart
 *
 * Initialize the start screen
 *
 * @param novelId = id of the novel div, and instance reference
 */
VisualNovel.prototype.initScreenStart = function initScreenStart( novelId ) {

	var self = this;
	
	this.buildStartMenu( novelId );
	this.updateStartMenuReference( novelId );
	this.showStartScreen( true );

	this.addStartMenuButtonHandler();

};

/**
 * Function: addStartMenuButtonHandler
 *
 * Add the event handlers for the start menu
 */
VisualNovel.prototype.addStartMenuButtonHandler = function addStartMenuButtonHandler() {

	// TODO: refactor...event delegation
	var self = this;

	this.screenStartMenuStartButtonId.onclick = function clickStartMenuButton() {
		self.startNovel();
	};

};

/**
 * Function: startNovel
 *
 * Hide the start screen, and start the added events in the novel
 */
VisualNovel.prototype.startNovel = function startNovel() {

	// hide start main menu
	this.showStartScreen( false );
	
	this.eventTracker.startEvent();

};

/**
 * Function: buildStartMenu
 *
 * Build the html for the start menu
 *
 * @param novelId = id of the novel div, and instance reference
 */
VisualNovel.prototype.buildStartMenu = function builStartMenu( novelId ) {

	var screenStart = this.screenStartId;

	var startMenuTemplate = this.templates.get( "startmenu" );
	var parseVariables = {
		novelId : novelId,
		novelTitle : this.novelTitle,
		novelSubtitle : this.novelSubtitle
	};

	startMenuTemplate = this.parser.parseTemplate( startMenuTemplate, parseVariables );

	screenStart.innerHTML = startMenuTemplate;	

};

/**
 * Function: updateStartMenuReference
 *
 * Update refences to html elements on the start screen
 *
 * @param novelId = id of the novel div, and instance reference
 */
VisualNovel.prototype.updateStartMenuReference = function updateStartMenuReference( novelId ) {

	var doc = document;

	this.novelTitleContainerId = doc.getElementById( novelId + "-novelTitleContainer" );
	this.novelTitleTextId = doc.getElementById( novelId + "-novelTitleText" );
	this.novelSubtitleTextId = doc.getElementById( novelId + "-novelSubtitleText" );
	this.screenStartMenuButtonContainerId = doc.getElementById( novelId + "-startMenuButtonContainer" );
	this.screenStartMenuStartButtonId = doc.getElementById( novelId + "-startMenuButton" );
	
};

VisualNovel.prototype.showStartScreen = function showStartScreen( show ) {

	var display = show ? "block" : "none";

	this.screenStartId.style.display = display;

};

VisualNovel.prototype.setStartScreenBgImage = function setStartScreenBgImage( imgPath, width, height ) {

	var image = this.imgPath + imgPath;
	var newStyle = ";background-image:url('" + image + "');" +
		"background-size:" + width + "px " + height + "px;";

	this.screenStartId.style.cssText += newStyle;

};

VisualNovel.prototype.setStartScreenBgColor = function setStartScreenBgColor( color ) {

	this.screenStartId.style[ "background-color" ] = color;

};

VisualNovel.prototype.setStartScreenMenuBgImage = function setStartScreenMenuBgImage( imgPath, width, height ) {

	var newStyle = ";background-image:url('" + this.imgPath + imgPath + "');" + 
		"background-size:" + width + "px " + height + "px;";

	this.screenStartMenuButtonContainerId.style.cssText += newStyle;

};

VisualNovel.prototype.setStartScreenMenuBgColor = function setStartScreenMenuBgColor( color ) {

	this.screenStartMenuButtonContainerId.style[ "background-color" ] = color;

};

VisualNovel.prototype.setStartScreenMenuPos = function setStartScreenMenuPos( x, y ) {

	var posX = x > 1 ? x : x * this.screenHeight;
	var posY = y > 1 ? y : y * this.screenWidth;
	var newStyle = ";left:" + posX + "px;top:" +
		posY + "px;";

	this.screenStartMenuButtonContainerId.style.cssText += newStyle;

};










/**
 * Function: initSceneContainer
 *
 * Initialize the container for the scenes
 */
VisualNovel.prototype.initSceneContainer = function initSceneContainer() {

	// TODO : needs refactoring

	var result = this.createSceneContainer( this.screenSceneId, this.sceneFloorWidth, this.sceneFloorHeight );
	
	// Store for reference
	this.sceneContainer = result.floorContainer;
	this.sceneFloor = result.floor;

};

/**
 * Function: createSceneContainer
 *
 * Create the container for the scenes
 *
 * @param element = dom container for scenes
 * @param width = width of container
 * @param height = height of container
 */
VisualNovel.prototype.createSceneContainer = function createSceneContainer( element, width, height ) {

	// build scene container
	var sceneContainer = ObjectFactory( "SpriteContainer", element );
	var stage = sceneContainer.children[ 0 ];

	// build scene floor
	var sceneFloor = ObjectFactory( "SceneFloor", width, height );
	var sceneFloorContainer = ObjectFactory( "SceneFloorContainer" );

	sceneFloorContainer.addChild( sceneFloor.sprite );

	stage.addChild( sceneFloorContainer );

	// Return floor container and floor
	var result = {
		floorContainer : sceneFloorContainer,
		floor : sceneFloor
	};

	return result;

};

VisualNovel.prototype.rotateScene = function rotateScene( axis, angle, speed, loop ) {

	var self = this;

	function eventToAdd() {
		
		self.sceneFloor.rotate( axis, angle, speed, loop );
	
	}

	this.eventTracker.addEvent( "nowait", eventToAdd );
};

VisualNovel.prototype.moveScene = function moveScene( x, y, z, speed ) {

	var self = this;

	function eventToAdd() {
		
		self.sceneFloor.move( x, y, z, speed );
	
	}

	this.eventTracker.addEvent( "nowait", eventToAdd );
};

VisualNovel.prototype.resetScenes = function resetScenes() {

	var scenes = this.sceneContainer ? this.sceneContainer.children : [];
	var totalScenes = scenes.length;

	// Don't include 0 since it is the scene floor
	// for( var i = totalScenes - 1; i >= 1; i-- ) {

	// 	this.sceneContainer.removeChildAt( i );

	// }

	if ( totalScenes > 1 ) {
		
		for( var i = totalScenes - 1; i--; ) {
			
			// Don't include 0 since it is the scene floor
			this.sceneContainer.removeChildAt( i + 1 );

		}

	}

	this.scenes = {
		text : [],
		object : []
	};

};










VisualNovel.prototype.initDialogMenuContainer = function initDialogMenuContainer() {

	// Hide
	this.dialogMenuId.style.display = "none";

};

VisualNovel.prototype.initNovelModeContainer = function initNovelModeContainer() {

	// TODO : implement

	// Hide
	this.novelModeId.style.display = "none";

};

VisualNovel.prototype.initDialogModeContainer = function initDialogModeContainer() {

	// TODO : refactor dialog into separate class / module

	this.setSayDialogDisplay( false );
	this.setDialogModeContainerSize( this.dialogWidth, this.dialogHeight );
	this.setDialogModeContainerPosition( 0, this.sceneHeight );
	this.setDialogTextColor( this.dialogTextColor );
	this.setDialogBgColor( this.dialogBgColor );

};

VisualNovel.prototype.setDialogModeContainerSize = function setDialogModeContainerSize( width, height ) {

	var newSize = this.calculateDialogModeContainerSize( width, height );
	var newStyle = ";width:" + newSize.width + ";height:" + newSize.height + ";";

	this.dialogModeId.style.cssText += newStyle;

	// store new size
	this.dialogWidth = width;
	this.dialogHeight = height;

};

VisualNovel.prototype.calculateDialogModeContainerSize = function calculateDialogModeContainerSize( width, height ) {

	var padding = this.dialogPadding;
	var contWidth = width ? width : this.dialogWidth;
	var contHeight = height ? height : this.dialogHeight;
	
	var size = {
		width : ( contWidth - padding.left - padding.right ) + "px",
		height : ( contHeight - padding.top - padding.bottom ) + "px"
	};

	return size;

};

VisualNovel.prototype.setDialogModeContainerPosition = function setDialogModeContainerPosition( x, y ) {

	var newPos = this.util.scalePosition( 
			{
				x : x ? x : 0, 
				y : y ? y : this.sceneHeight
			},
			{ 
				x : this.screenWidth, 
				y : this.screenHeight
			} 
		);

	var newStyle = ";left:" + newPos.x + "px;top:" + newPos.y + "px;";

	this.dialogModeId.style.cssText += newStyle;

};

VisualNovel.prototype.setDialogBgImage = function setDialogBgImage( img, width, height ) {

	var bgImg = img ? ";background-image:url('" + this.imgPath + img + "');" : ";";
	var bgSize = width && height ? 
		"width:" + width + "px;height: " + height + "px;" : "";
	var newStyle = bgImg + bgSize;

	this.dialogModeId.style.cssText += newStyle;

};

VisualNovel.prototype.setDialogBgColor = function setDialogBgColor( color ) {

	this.dialogModeId.style[ "background-color" ] = color ? color : "black";

};

VisualNovel.prototype.setDialogTextColor = function setDialogTextColor( color ) {

	// TODO: refactor
	// move to say dialog
	// also add to set color of name in dialog
	this.dialogModeId.style.color = color ? color : "white";

};

VisualNovel.prototype.setDialogBorderStyle = function setDialogBorderWidth( img, color, width, radius ) {

	var padding = this.dialogPadding;

	// not yet implemented
	var borderImg = img ? "url('" + this.imgPath + img + "')" : "";

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

VisualNovel.prototype.updateDialogBorderStyle = function updateDialogBorderStyle( img, color, width, radius ) {

	var self = this;

	function eventToAdd() {
		
		self.setDialogBorderStyle( img, color, width, radius );
	
	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setDialogButtonPosition = function setDialogButtonPosition( x, y ) {

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

VisualNovel.prototype.updateDialogButtonPosition = function updateDialogButtonPosition( character ) {

	var characterObject = typeof character == "object" ? true : false;
	var dialogButton = characterObject && character.dialog && character.dialog.button ?
		character.dialog.button : null;
	var updateButtonPosition = dialogButton && dialogButton.width;
	
	// Update button position based on image width
	if ( updateButtonPosition ) {

		var dialogPadding = this.dialogPadding;

		this.setDialogButtonPosition( this.dialogWidth - 
			dialogPadding.right - dialogPadding.left - dialogButton.width );

	}

};

VisualNovel.prototype.refreshDialogButtonPositionView = function refreshDialogButtonPositionView( character ) {

	var buttonPos = this.dialogButtonPos;
	var newStyle = ";left:" + buttonPos.left + "px;bottom:" + buttonPos.bottom + "px;";

	this.dialogButtonId.style.cssText += newStyle;

};

VisualNovel.prototype.updateDialogButtonListeners = function updateDialogButtonListeners( character, callback ) {

	// TODO : refactor... too long
	var self = this;
	
	var characterObject = typeof character == "object" ? true : false;
	var characterDialog = characterObject && character.dialog ? character.dialog : null;
	var dialogButton = characterDialog && character.dialog.button ?
		character.dialog.button : null;

	var dialogButtonElem = this.dialogButtonId;
	var dialogImageElem = this.dialogImageId;

	// check if bgColor for dialog button is provided
	var hasDialogButtonBgColor = dialogButton && dialogButton.bgColor && dialogButton.bgColorHover;
	var bgColorOnMouseOver = dialogButton && dialogButton.bgColorHover ?
				dialogButton.bgColorHover : "transparent";
	var callBgColorOnMouseOver = hasDialogButtonBgColor ?
		function() { dialogButtonElem.style[ "background-color" ] = bgColorOnMouseOver; } : 
		function() {};
	var bgColorOnMouseLeave = dialogButton && dialogButton.bgColor ?
				dialogButton.bgColor : "transparent";
	var callBgColorOnMouseLeave = hasDialogButtonBgColor ?
		function() { dialogButtonElem.style[ "background-color" ] = bgColorOnMouseLeave; } : 
		function() {};
	
	// check if image for dialog button is provided
	var hasDialogButtonImage = dialogButton && dialogButton.image && dialogButton.imageHover;
	var imageOnMouseOver = dialogButton && dialogButton.imageHover ?
		this.imgPath + dialogButton.imageHover : "";
	var callImageOnMouseOver = hasDialogButtonImage ?
		function() { dialogButtonElem.setAttribute( "src", imageOnMouseOver ); } : 
		function() {};
	var imageOnMouseLeave = dialogButton && dialogButton.image ? 
		this.imgPath + dialogButton.image : "";
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

	// check if nextImage for character image animation in dialog is provided
	var clearDialogImageAnimation = function() {};
	var dialogImageAnimationTimer = null;
	var characterDialogImageInitial = characterDialog && characterDialog.image ?
		this.imgPath + characterDialog.image : "";
	var characterDialogImageNext = characterDialog && characterDialog.nextImage ?
		this.imgPath + characterDialog.nextImage : "";
	var dialogImageAnimationTimerDelay = characterDialog && characterDialog.imageDelay ?
		characterDialog.imageDelay : 5000;

	if ( characterDialog && characterDialog.nextImage ) {

		// debug
		// console.log( "start timer" );
		
		dialogImageAnimationTimer = setInterval( function() {

			dialogImageElem.setAttribute( "src", characterDialogImageNext );

			setTimeout( function() {
				dialogImageElem.setAttribute( "src", characterDialogImageInitial );
			}, 200 );

		}, dialogImageAnimationTimerDelay );

		clearDialogImageAnimation = function() {
			
			// debug
			// console.log( "clear timer" );
			window.clearInterval( dialogImageAnimationTimer );
		
		};

	}

	// Proceed to next event on click
	this.dialogButtonId.onclick = function clickDialogButton( e ) {
				
		// perform passed callback when button is clicked
		// e.g. clear timeout for showing line by each char
		callback();

		self.eventTracker.nextEvent();

		clearDialogImageAnimation();

	};

};










VisualNovel.prototype.initCharacterContainer = function initCharacterContainer() {

	// TODO: refactor

	var screenCharacter = this.screenCharacterId;

	// set character container size and hide it
	var newStyle = ";display:none;width:" + this.screenWidth + 
		"px;height:" + this.screenHeight + "px;";
		
	screenCharacter.style.cssText += newStyle;

	// create character sprite container
	this.characterContainer = ObjectFactory( "SpriteContainer", screenCharacter );

};










VisualNovel.prototype.initBGContainer = function initBGContainer() {

	// create screen bg sprite container
	// this.screenBgId = ObjectFactory( "SpriteContainer", this.screenBgId );
	this.screenBgId = ObjectFactory( "ScreenBg", this.screenBgId );

};

VisualNovel.prototype.setBgImage = function setBgImage( bgImg, width, height, repeat, widthSize, heightSize ) {

	var self = this;

	function eventToAdd() {

		var screenBg = self.screenBgId;

		// TODO : check how Sprite3D updates css...
		screenBg.setPosition( 0, 0, 0 ).setSize( width, height ).setCSS(
			"background-image", "url('" + self.imgPath + bgImg + "')" );

		if ( widthSize && heightSize ) {

			screenBg.setCSS( "background-size", widthSize + "px " + heightSize + "px" );

		}

		// Update bg at start of frame
		requestAnimationFrame( function() {
			screenBg.update();
		} );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setBgColor = function setBgColor( bgColor ) {

	var self = this;

	function eventToAdd() {
		self.screenBgId.style[ "background-color" ] = bgColor;
	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setBgSize = function setBgSize( width, height, duration, delay ) {

	// TODO : implement as zoom?
	//		  duration, delay

	var self = this;

	function eventToAdd() {
		
		if ( duration ) {

			var previousSize = self.getBgSize();
			var distance = {
				"width": width - previousSize.width,
				"height": height - previousSize.height
			};

			var animationStartTime = Date.now();
			var animationDuration = duration;

			var bgSizeUpdate = function() {

				var currentTime = Date.now();
				var timeDifference = ( currentTime - animationStartTime ) / animationDuration;

				self.setBgSizeTo(
					previousSize.width + ( timeDifference * distance.width ),
					previousSize.height + ( timeDifference * distance.height )
				);

				if ( timeDifference <= 1 ) {

					requestAnimationFrame( bgSizeUpdate );
				
				}

			};

			requestAnimationFrame( bgSizeUpdate );

		} else {

			self.setBgSizeTo( width, height );

		}

		self.screenBgId.update();

		// debug
		// console.log( "set bg size : " + width + "," + height );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.getBgSize = function getBgSize() {

	var screenBg = this.screenBgId;
	
	return {
		width : screenBg.width,
		height : screenBg.height
	};

};

VisualNovel.prototype.setBgSizeTo = function setBgSizeTo( width, height ) {

	// TODO: check if scale can be used..
	this.screenBgId.setSize( width, height )
				.setCSS( "background-size", width + "px " + height + "px" );

};

VisualNovel.prototype.setBgPosition = function setBgPosition( x, y, duration, delay ) {

	// TODO : refactor for smoother animation
	//		  look for better method or optimization techniques
	//		  using requestAimationFrame

	var self = this;

	function eventToAdd() {

		var previousPosition = self.getBgPosition();
		var distance = {
			"x": x - previousPosition.x,
			"y": y - previousPosition.y
		};

		var sprite = self.screenBgId;

		if ( duration ) {

			var animationStartTime = Date.now();
			var animationDuration = duration;

			var bgPositionUpdate = function() {

				var currentTime = Date.now();
				var timeDifference = ( currentTime - animationStartTime ) / animationDuration;

				sprite.x = previousPosition.x + ( timeDifference * distance.x );
				sprite.y = previousPosition.y + ( timeDifference * distance.y );
				sprite.update();

				if ( timeDifference <= 1 ) {

					requestAnimationFrame( bgPositionUpdate );
				
				}

			};

			requestAnimationFrame( bgPositionUpdate );

		} else {

			requestAnimationFrame( function() {

				sprite.x = previousPosition.x + distance.x;
				sprite.y = previousPosition.y + distance.y;
				sprite.update();

			} );

		}

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.getBgPosition = function getBgPosition() {

	var screenBgId = this.screenBgId;
	var position = {
		x : screenBgId.x,
		y : screenBgId.y
	};

	return position;

};

VisualNovel.prototype.rotateBg = function rotateBg( axis, angle, speed, loop, sprite ) {

	// Test : Rotate bg
	// vn.rotateBg( "z", 1, 25, true );
	// vn.pause( 5000 );
	// vn.stopRotateBg( 1000 );
	// vn.resetBg( "rotate" );

	var self = this;

	function eventToAdd() {

		self.screenBgId.rotate( axis, angle, speed, loop, sprite );
		self.screenBgId.update();
		// self.screenBgId.rotate( 0, 0, angle ).update();

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, 0 );	

};

VisualNovel.prototype.rotateBgTo = function rotateBgTo( axis, angle, speed, loop, sprite ) {

	// Test : Rotate bg to
	// vn.rotateBgTo( "z", -45, 25 );
	// vn.pause( 2000 );
	// vn.rotateBgTo( "z", 0, 25 );
	// vn.pause( 2000 );
	// vn.resetBg( "rotate" );

	var self = this;

	function eventToAdd() {

		self.screenBgId.rotateTo( axis, angle, speed, loop, sprite );
		self.screenBgId.update();
		// self.screenBgId.rotate( 0, 0, angle ).update();

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, 0 );	

};

VisualNovel.prototype.stopRotateBg = function stopRotateBg( delay ) {

	var self = this;

	function eventToAdd() {

		window.clearInterval( self.screenBgId.timer.rotate );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.fadeBg = function fadeBg( type, fadeSpeed ) {

	var self = this;

	function eventToAdd() {

		var sceneObject = self.screenBgId;

		if ( type === "in" ) {
			sceneObject.fadeIn( fadeSpeed );
		}

		if ( type === "out" ) {
			sceneObject.fadeOut( fadeSpeed );
		}

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.resetBg = function resetBg( action, delay ) {

	var self = this;

	function eventToAdd() {

		var screenBg = self.screenBgId;

		if ( action == "rotate" ) {
			window.clearInterval( screenBg.timer.rotate );
			screenBg.setRotation( 0, 0, 0 ).update();
		}

		if ( action == "fade" ) {
			screenBg.fadeIn( 0 );
		}

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};























VisualNovel.prototype.addObjectToScene = function addObjectToScene( name, bgInfo, position, delay, fade, fadeSpeed ) {

	var self = this;

	function eventToAdd() {

		// container parallel to floor
		// x & y = 0 ~ 1
		var width = bgInfo.width;
		var height = bgInfo.height;
		var pos = self.util.scalePosition(
				{ x : position.x, y : position.y, z : position.z },
				{ x : self.sceneFloorWidth, y : -self.sceneFloorHeight, z : self.sceneFloorHeight }
			);

		var sceneObject = ObjectFactory( "SceneObject", width, height, pos );

		sceneObject.setBackground( width, height, 
			bgInfo.path ? self.imgPath + bgInfo.path : "", bgInfo.color );

		if ( fade ) {

			sceneObject.fadeIn( fadeSpeed );

		}

		// To keep track of scene image
		sceneObject.name = name;
		
		// Add scene object to floor and store in scenes list
		self.sceneFloor.sprite.addChild( sceneObject.sprite );
		self.scenes.object.push( sceneObject );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.moveSceneObject = function moveSceneObject( name, x, y, z, moveSpeed, delay ) {

	var self = this;

	function eventToAdd() {

		self.setSceneObjectPosition( name, x, y, z, moveSpeed );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay ? delay : 0 );

};

VisualNovel.prototype.setSceneObjectPosition = function setSceneObjectPosition( name, x, y, z, moveSpeed ) {

	var util = this.util;
	var sceneObjectInfo = util.getObjectInList( this.scenes.object, "name", name );
	var sceneObject = sceneObjectInfo.obj;
	var sprite = sceneObject.sprite;
	var newPos = util.scalePosition(
			{ x : x ? x : sprite.x, y : y ? y : sprite.y, z : z ? z : sprite.z },
			{ x : this.screenWidth, y : this.screenHeight, z : this.screenHeight }
		);

	if ( moveSpeed ) {
		sceneObject.move( newPos.x, newPos.y, newPos.z, moveSpeed );
	} else {
		sceneObject.moveTo( newPos.x, newPos.y, newPos.z );
	}

};

VisualNovel.prototype.rotateSceneObject = function rotateSceneObject( name, axis, angle, speed, loop ) {

	var self = this;

	function eventToAdd() {

		self.setSceneObjectRotation( name, axis, angle, speed, loop );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setSceneObjectRotation = function setSceneObjectRotation( name, axis, angle, speed, loop ) {

	var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
	var sceneObject = sceneObjectInfo.obj;

	if ( loop ) {
		
		sceneObject.rotate( axis, angle, speed, loop );
	
	} else {

		sceneObject.rotateTo( axis, angle, speed );

	}

};

VisualNovel.prototype.fadeSceneObject = function fadeSceneObject( name, type, fadeSpeed ) {

	var self = this;

	function eventToAdd() {

		self.setSceneObjectFade( name, type, fadeSpeed );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setSceneObjectFade = function setSceneObjectFade( name, type, fadeSpeed ) {

	var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
	var sceneObject = sceneObjectInfo.obj;
	var fadeType = typeof type === "string" ? type.toLowerCase() : "";

	if ( fadeType === "in" ) {
		sceneObject.fadeIn( fadeSpeed );
	}

	if ( fadeType === "out" ) {
		sceneObject.fadeOut( fadeSpeed );
	}

};

VisualNovel.prototype.setSceneObjectStyle = function setSceneObjectStyle( name, style ) {

	var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
	var sceneObject = sceneObjectInfo.obj;

	sceneObject.sprite.children[0].style.cssText += style;

};

VisualNovel.prototype.resetSceneObject = function resetSceneObject( name, action ) {

	// action = move, rotate, fade

	var self = this;

	function eventToAdd() {

		var sceneObjectInfo = self.util.getObjectInList( self.scenes.object, "name", name );
		var sceneObject = sceneObjectInfo.obj;

		// sceneObject.sprite => container
		// sceneObject.sprite.children[ 0 ] => scene object
		var timer = sceneObject ? sceneObject.sprite.children[ 0 ].timer : null;
		var actionTimer = timer ? timer[ action ] : null;

		// TODO : refactor
		if ( sceneObject && actionTimer ) {

			if ( action == "rotate" ) {

				window.clearInterval( actionTimer );
				actionTimer = null;

			}

		}

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.removeSceneObject = function removeSceneObject( name ) {

	var self = this;

	function eventToAdd() {

		var sceneObjectInfo = self.util.getObjectInList( self.scenes.object, "name", name );
		var sceneIndex = sceneObjectInfo.id;

		self.sceneFloor.sprite.removeChildAt( sceneIndex );
		self.scenes.object.splice( sceneIndex, 1 );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};










// TODO : add another implementation since text isn't crisp / sharp because of transformation
//			create another div for text container
//			create a SceneText class

VisualNovel.prototype.addTextToScene = function addTextToScene( name, text, info, delay ) {

	var self = this;

	function eventToAdd() {

		// container parallel to floor
		// x & y = 0 ~ 1
		var width = info.width ? info.width : 0;
		var height = info.height ? info.height : 0;
		var pos = self.util.scalePosition(
				{ x : info.x, y : info.y, z : info.z },
				{ x : self.sceneFloorWidth, y : -self.sceneFloorHeight, z : self.sceneFloorHeight }
			);

		var sceneObject = ObjectFactory( "SceneObject", width, height, pos );

		sceneObject.sprite.children[ 0 ].setInnerHTML( text );

		if ( info.size ) {

			sceneObject.sprite.setCSS( "font-size", info.size + "px" );

		}

		if ( info.color ) {

			sceneObject.sprite.setCSS( "color", info.color );

		}

		if ( info.bgColor || info.bgImage ) {

			sceneObject.setBackground( width, height,
				info.bgImage ? self.imgPath + info.bgImage : null,
				info.bgColor ? info.bgColor : null );

		}

		if ( info.fade ) {

			sceneObject.fadeIn( info.fade );

		}

		// To keep track of scene text
		sceneObject.name = name;
		
		// Add scene object to floor and store in scenes list
		self.sceneFloor.sprite.addChild( sceneObject.sprite );
		self.scenes.object.push( sceneObject );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );


};

VisualNovel.prototype.fadeSceneText = function fadeSceneText( name, type, fadeSpeed ) {

	this.fadeSceneObject( name, type, fadeSpeed );

};

VisualNovel.prototype.moveSceneText = function moveSceneText( name, x, y, z, moveSpeed, delay ) {

	this.moveSceneObject( name, x, y, z, moveSpeed, delay );

};

VisualNovel.prototype.rotateSceneText = function rotateSceneText( name, axis, angle, speed, loop ) {

	this.rotateSceneObject( name, axis, angle, speed, loop );

};

VisualNovel.prototype.removeSceneText = function removeSceneText( name ) {

	this.removeSceneObject( name );

};












VisualNovel.prototype.moveCharacter = function moveCharacter( character, x, y, delay ) {

	var self = this;

	function eventToAdd() {

		var characterObject = self.getCharacter( character.name );
		var sprite = characterObject.sprite;
		var newPos = {
			x : typeof x !== "undefined" ? x > 1 || x < -1 ? x : x * self.screenWidth : sprite.x,
			y : typeof y !== "undefined" ? y > 1 || y < -1 ? y : y * self.screenHeight : sprite.y
		};

		if ( delay ) {

			characterObject.move( newPos.x, newPos.y, 0, delay );

		} else {

			requestAnimationFrame( function() {

				sprite.x = newPos.x;
				sprite.y = newPos.y;
				sprite.update();

			} );

		}
	
	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.fadeCharacter = function fadeCharacter( character, type, speed, from, to ) {

	var self = this;

	function eventToAdd() {

		var characterObject = self.getCharacter( character.name );
		
		if ( type == "in" ) {

			characterObject.fadeIn( speed, from, to );

		} else if ( type == "out" ) {

			characterObject.fadeOut( speed, from, to );

		}
	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.flipCharacter = function flipCharacter( character ) {

	var self = this;

	function eventToAdd() {

		var characterObject = self.getCharacter( character.name );
		var sprite = characterObject.sprite;
		var newScale = sprite.scaleX > 0 ? -1 : 1;
		
		sprite.setScaleX( newScale ).update();
	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.addCharacter = function addCharacter( character, delay, fadeIn ) {

	var self = this;

	function createCharacter() {
		
		// show
		self.screenCharacterId.style.display = "block";

		var transformX = character.width / 2;

		var posY = ( self.screenHeight - character.height ) + 
				   ( self.screenHeight * character.pos.y );
		var posX = ( self.screenWidth * character.pos.x );

		var position = {
			x : Math.floor( posX ),
			y : Math.floor( posY ),
			z : 0
		};
		var transformOrigin = {
			x : transformX,
			y : 0,
			z : 0
		};
		var c = ObjectFactory( "Character", character.width, character.height, position, transformOrigin );
		c.setBackground( character.width, character.height, self.getCharacterImage( character ) );
		
		// To help us keep track of the character, use their name
		c.name = character.name;

		return c;
	}

	function callAddCharacter( c ) {

		self.characterContainer.addChild( c.sprite );
		self.characters.push( c );

	}

	function eventToAdd() {
		
		var c = createCharacter();

		if ( fadeIn ) {

			c.fadeIn( delay );

		}

		callAddCharacter( c );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.getCharacter = function getCharacter( name ) {

	var characterObjectInfo = this.util.getObjectInList( this.characters, "name", name );
	
	return characterObjectInfo.obj;

};

VisualNovel.prototype.getCharacterImage = function getCharacterImage( character, type ) {

	// character image is string
	// character = { image : "character/happy.png" };
	
	// character image is object
	// type = default if not provided
	// character = { image : 
	// { default : "character/happy.png", sleep : "character/sleep.png" } }

	var imgPath = this.imgPath;
	var charImage = character && character.image ? character.image : null;

	// TODO: add function to detect if charImage is an object and not an array...?
	if ( charImage && typeof charImage === "object" ) {

		if ( type ) {

			charImage = charImage[ type ];
		
		} else {

			charImage = charImage[ "default" ];

		}

		if ( typeof charImage === "object" ) {

			charImage = {
				src : imgPath + charImage.src,
				position : charImage.position
			};

		} else {

			charImage = imgPath + charImage;

		}

	} else if ( charImage ) {

		charImage = imgPath + charImage;

	}

	return charImage;

};

VisualNovel.prototype.changeCharacterImage = function changeCharacterImage( character, type ) {

	var self = this;

	function eventToAdd() {

		self.setCharacterImage( character, type );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setCharacterImage = function setCharacterImage( character, type ) {

	var characterObject = this.getCharacter( character.name );
	var characterImage = this.getCharacterImage( character, type );

	if ( typeof characterImage === "object" ) {

		requestAnimationFrame( function() {
			characterObject.sprite.setCSS( "background-image", 
				"url('" + characterImage.src + "')" );
			characterObject.sprite.setCSS( "background-position", characterImage.position );
		} );

	} else {

		requestAnimationFrame( function() {
			characterObject.sprite.setCSS( "background-image", 
				"url('" + characterImage + "')" );
		} );
	
	}

};

VisualNovel.prototype.removeCharacter = function removeCharacter( character, delay, fadeOut ) {

	var self = this;

	// TODO: refactor character object
	function callRemoveCharacter() {
		
		var characterObjectInfo = self.util.getObjectInList( self.characters, "name", character.name );
		var indexInList = characterObjectInfo.id;

		self.characterContainer.removeChildAt( indexInList + 1 ); // 0 for container so +1
		self.characters.splice( indexInList, 1 );
	}

	function eventToAdd() {

		if ( fadeOut ) {
			var characterObject = self.getCharacter( character.name );
			characterObject.fadeOut( delay );
		}

		self.eventTracker.delayCallback( delay, callRemoveCharacter );
	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.removeAllCharacter = function removeAllCharacter( delay ) {

	var self = this;

	function callRemoveAllCharacter() {
		self.resetCharacters();
	}

	function eventToAdd() {
		self.eventTracker.delayCallback( delay, callRemoveAllCharacter );
	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.resetCharacters = function resetCharacters() {

	var characters = this.characterContainer ? this.characterContainer.children : [];
	var totalCharacters = characters.length;

	for( var i = totalCharacters - 1; i >= 1; i-- ) {

		this.characterContainer.removeChildAt( i );

	}

	this.characters = [];

};










VisualNovel.prototype.showTextByChar = function showTextByChar( message, index, interval ) {
	 	
 	if ( index < message.length ) {

    	this.setSayDialogText( message[ index++ ], true );

    	this.timers.dialog.text = setTimeout( function () {

    		this.showTextByChar( message, index, interval );

    	}.bind( this ), interval );

	} else {

		this.timers.dialog.text = null;

	}

};

VisualNovel.prototype.sayLine = function sayLine( character, line, delay ) {

	var self = this;
	var showLineByEachChar = typeof delay === "object";
	var delayTime = delay;
	var showDialogButton = typeof delay === "undefined";

	if ( showLineByEachChar ) {

		delayTime = delay.interval * line.length + ( delay.delay ? delay.delay : 0 );
		
		if ( delay.button ) {
			
			delayTime = 0;
			showDialogButton = true;
		
		}
	}

	function callSayLine() {

		var mode = self.novelMode;

		// Steps:
		// 1. show say dialog container
		// 2. build say dialog container
		// 3. update references to divs and button in container
		// 4. set text in container (TODO: add text later after building container)
		self.setSayDialogDisplay( true, mode );

		self.buildSayDialog( character, showLineByEachChar ? "" : line, delayTime, mode );

		self.updateSayDialogReference( self.novelId );

		// TODO : move ( inside condition ) to separate function
		if ( showDialogButton ) {

			self.updateSayDialogButtonReference( self.novelId );

			// Set button position
			self.updateDialogButtonPosition( character );
			self.refreshDialogButtonPositionView( character );

			self.updateDialogButtonListeners( character, function onDialogButtonClick() {
				
				var textTimer = self.timers.dialog.text;

				if ( textTimer ) {

					clearTimeout( textTimer );
					textTimer = null;
				
				}

			} );

		}

		if ( showLineByEachChar ) {

			// replace variables in line
			var dialogLine = self.parser.replaceVariablesInText( line, self.userInput );
			
			self.showTextByChar( dialogLine, 0, delay.interval );

		}
	}

	this.eventTracker.addEvent( delayTime ? "nowait" : "wait", callSayLine, delayTime );

};

VisualNovel.prototype.sayLineExtend = function sayLineExtend( line, delay ) {

	var self = this;

	function callSayLineExtend() {

		self.setSayDialogText( line, true );

	}

	this.eventTracker.addEvent( delay ? "nowait" : "wait" , callSayLineExtend, delay );

};

VisualNovel.prototype.sayMultipleLines = function sayMultipleLines( character, line ) {

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

VisualNovel.prototype.say = function say( character, line, delay ) {

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

VisualNovel.prototype.buildSayDialog = function buildSayDialog( character, line, delay, novelMode ) {

	var sayTemplate = this.getSayTemplate( character, line, delay );

	this.setSayDialogContainer( sayTemplate, novelMode );

};

VisualNovel.prototype.getSayTemplate = function getSayTemplate( character, line, delay ) {

	// variables to replace in template
	var templateVariables = this.getSayTemplateVariables( character, line, delay );

	// get template
	var sayTemplate = this.templates.get( "say" );
	sayTemplate = this.parser.parseTemplate( sayTemplate, templateVariables );

	// debug
	// console.log( templateVariables );
	// console.log( sayTemplate );

	return sayTemplate;

};

VisualNovel.prototype.getSayTemplateVariables = function getSayTemplateVariables( character, line, delay ) {

	var name = typeof character === "object" ? character.name : character;
	var dialogNameStyle = typeof character === "object" ? character.nameStyle : "";
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
			( dialogImageLocation == "left" ? "margin-right:10px;" : "margin-left:10px;" ) :
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
		"novelId" : this.novelId,
		"name" : name,
		"dialogNameStyle" : dialogNameStyle,
		"dialogLine" : dialogLine,

		"showDialogImage" : dialogSettings,
		"dialogImage" : dialogImage,
		"dialogImageStyle" : dialogImageLocation + dialogImageWidth + dialogImageHeight + dialogImageBorder,

		"showButtonText" : showButtonText,
		"dialogButtonText" : dialogButtonText,

		"showButtonImage" : showButtonImage,
		"dialogButtonImage" : dialogButtonImage,
		"dialogButtonImageStyle" : dialogButtonImageWidth + dialogButtonImageHeight
	};

	return templateVariables;

};

VisualNovel.prototype.setSayDialogContainer = function setSayDialogContainer( template, novelMode ) {

	// Default : dialogModeId
	var mode = novelMode ? novelMode : this.novelMode;
	var containerId = mode == "novel" ? "novelModeId" : "dialogModeId";

	this[ containerId ].innerHTML = template;

};

VisualNovel.prototype.setSayDialogText = function setSayDialogText( line, isAppend ) {

	this.dialogTextId.innerHTML = isAppend ? this.dialogTextId.innerHTML + line : line;

};

VisualNovel.prototype.updateSayDialogReference = function updateSayDialogReference( novelId ) {

	var doc = document;

	this.dialogImageId = doc.getElementById( novelId + "-dialog-dialogImage" );

	this.dialogTextId = doc.getElementById( novelId + "-dialog-dialogText" );

};

VisualNovel.prototype.updateSayDialogButtonReference = function updateSayDialogButtonReference( novelId ) {

	this.dialogButtonId = document.getElementById( novelId + "-dialog-dialogButton" );

};

VisualNovel.prototype.setSayDialogDisplay = function setSayDialogDisplay( show, novelMode ) {

	var mode = novelMode ? novelMode : this.novelMode;
	var display = show ? "block" : "none";

	if ( mode == "dialog" ) {
		this.dialogModeId.style.display = display;
		this.novelModeId.style.display = "none";
	}

	if ( mode == "novel" ) {
		this.dialogModeId.style.display = "none";
		this.novelModeId.style.display = display;
	}

};

VisualNovel.prototype.showSayDialog = function showSayDialog( show ) {

	var self = this;

	function callShowSayDialog() {

		self.setSayDialogDisplay( show, self.novelMode );

	}

	this.eventTracker.addEvent( "nowait", callShowSayDialog );

};

VisualNovel.prototype.input = function input( storeInputKey, message ) {

	var self = this;

	function eventToAdd() {
		
		// Show
		self.dialogMenuId.style.display = "block";

		self.buildUserInputContainer( message );

		self.updateUserInputReference( self.novelId );

		self.userInputButtonId.onclick = function clickUserInputButton() {
			self.getInput( storeInputKey );
		};
	}

	this.eventTracker.addEvent( "wait", eventToAdd );

};

VisualNovel.prototype.buildUserInputContainer = function buildUserInputContainer( message ) {

	this.dialogMenuId.innerHTML = this.getUserInputTemplate( message );

};

VisualNovel.prototype.getUserInputTemplate = function getUserInputTemplate( message ) {

	// variables to replace in template
	var toReplace = {
		novelId : this.novelId,
		message : message
	};

	// get template
	var userInputTemplate = this.templates.get( "userinput" );
	userInputTemplate = this.parser.parseTemplate( userInputTemplate, toReplace );

	return userInputTemplate;

};

VisualNovel.prototype.updateUserInputReference = function updateUserInputReference( novelId ) {

	var doc = document;

	this.userInputTextId = doc.getElementById( novelId + "-userInputText" );
	this.userInputButtonId = doc.getElementById( novelId + "-userInputButton" );

};

VisualNovel.prototype.getInput = function getInput( storeInputKey ) {

	var userInput = this.userInputTextId;

	this.userInput[ storeInputKey ] = userInput.value;

	this.dialogMenuId.style.display = "none";

	this.eventTracker.nextEvent();

};

VisualNovel.prototype.setInput = function setInput( key, value ) {

	if ( key ) {

		this.userInput[ key ] = value;

	}

};

VisualNovel.prototype.setValue = function setValue( key, value ) {

	var self = this;

	function eventToAdd() {
		
		self.setInput( key, value );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.getValue = function getValue( key ) {

	return this.userInput[ key ];

};

VisualNovel.prototype.resetNovelDialogText = function resetNovelDialogText() {

	this.novelModeId.innerHTML = "";
	this.dialogModeId.innerHTML = "";

};

VisualNovel.prototype.addCondition = function addCondition( var1, operator, var2, successCallback, failCallback ) {

	var self = this;

	function eventToAdd() {

		var conditionResult = false;
		var userInput = self.userInput;

		if ( operator == "=" ) {
			conditionResult = userInput[ var1 ] == var2;
		}

		if ( operator == ">" ) {
			conditionResult = userInput[ var1 ] > var2;
		}

		if ( operator == "<" ) {
			conditionResult = userInput[ var1 ] < var2;
		}

		if ( operator == "!=" ) {
			conditionResult = userInput[ var1 ] != var2;
		}

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
		self.eventTracker.startEvent();

	}

	// wait for condition success or fail events to register
	// then call startEvent
	this.eventTracker.addEvent( "wait", eventToAdd );

};

VisualNovel.prototype.choice = function choice( choiceEventId, listOfChoices, menuPos, menuImg ) {

	// choiceId = to track the choice event

	var self = this;

	function eventToAdd() {

		// show
		self.dialogMenuId.style.display = "block";

		var totalChoices = listOfChoices.length;

		for ( var i = totalChoices, tmp = []; i--; ) {

			// store choice in self.menuChoices
			// so that it can be called later on button click
			tmp.unshift( listOfChoices[ i ] );

		}

		// init event to menu choices 
		// and store the choices 
		// to perform the choices on button click
		self.menuChoices[ choiceEventId ] = tmp;

		// For choice menu:
		// 1. build choice buttons
		// 2. build choice image
		// 3. insert buttons and image to menu container
		self.buildMenuChoices( listOfChoices, menuImg );

		self.updateMenuChoicesReference( self.novelId );

		// Attach click events to dialog menu choice buttons
		self.addMenuChoicesHandler( choiceEventId, totalChoices );

		// position choice menu
		if ( menuPos ) {

			self.setMenuChoicesPosition( menuPos.x, menuPos.y );

		}

		// add new event
		self.eventTracker.addNewEventInProgress( choiceEventId );

		// Debug
		// console.log( "choice: " + choiceEventId );
		// console.log( self.eventsInProgress );
		// console.log( self.eventList );
		// console.log( self.eventId );
		
	}

	this.eventTracker.addEvent( "wait", eventToAdd );

};

VisualNovel.prototype.buildMenuChoices = function buildMenuChoices( listOfChoices, menuImage ) {

	// Get menu choices template
	var menuImg = menuImage ? menuImage : { image : "", width : 0, height : 0 };
	var imgPath = this.imgPath + menuImg.image;
	var menuChoiceTemplate = this.getMenuChoicesTemplate( listOfChoices, imgPath, 
		menuImg.width, menuImg.height );

	this.dialogMenuId.innerHTML = menuChoiceTemplate;

};

VisualNovel.prototype.getMenuChoicesTemplate = function getMenuChoicesTemplate( choices, imgPath, imgWidth, imgHeight ) {

	// variables to replace in template
	var toReplace = {
		novelId : this.novelId,
		choices : choices,
		imgPath : imgPath,
		imgWidth : imgWidth,
		imgHeight : imgHeight
	};

	// get template
	var menuChoiceTemplate = this.templates.get( "menuchoice" );
	
	menuChoiceTemplate = this.parser.parseTemplate( menuChoiceTemplate, toReplace );

	return menuChoiceTemplate;

};

VisualNovel.prototype.updateMenuChoicesReference = function updateMenuChoicesReference( novelId ) {

	this.dialogMenuChoiceContainerId = document.getElementById( this.novelId + "-dialogMenuChoiceContainer" );

};

VisualNovel.prototype.addMenuChoicesHandler = function addMenuChoicesHandler( choiceEventId, totalChoices ) {

	var self = this;
	var novelId = this.novelId;
	var onMenuChoiceClick = function( i ) {

		var index = i;

		return function clickDialogMenuChoiceButton() {

			// hide menu
			self.dialogMenuId.style.display = "none";

			self.performMenuChoice( choiceEventId, index );

		};

	};

	for ( var i = totalChoices; i--; ) {

		// TODO: add event delegation to menu choice container
		document.getElementById( novelId + "-dialogMenuChoiceButton" + i ).onclick = onMenuChoiceClick( i );

	}

};

VisualNovel.prototype.performMenuChoice = function performMenuChoice( choiceEventId, indexInListOfChoices ) {

	var choiceTaken = this.menuChoices[ choiceEventId ][ indexInListOfChoices ];

	// store choice taken
	this.menuChoicesTaken[ choiceEventId ] = choiceTaken;

	var action = choiceTaken.action;

	// register events in menu choice action
	action();

	// add event to reset menu choices so that
	// it only gets called after all
	// menu choice actions are done
	this.resetMenuChoicesForEvent( choiceEventId );

	// start events in menu choice action
	this.eventTracker.startEvent();

};

VisualNovel.prototype.setMenuChoicesPosition = function setMenuChoicesPosition( x, y ) {

	var pos = this.util.scalePosition(
			{ x : x, y : y },
			{ x : this.screenWidth, y : this.screenHeight }
		);

	this.dialogMenuChoiceContainerId.style.cssText += ";left:" + pos.x + "px;top:" +
		pos.y + "px;";

};

VisualNovel.prototype.resetMenuChoicesForEvent = function resetMenuChoicesForEvent( choiceEventId ) {

	var self = this;

	function eventToAdd() {
		
		self.menuChoices[ choiceEventId ] = [];

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.resetMenuChoices = function resetMenuChoices() {

	this.menuChoices = {};
	this.menuChoicesTaken = {};

};









/**
 * Function: loop
 *
 * Repeat the action passed a number of times or infinitely
 *
 * @param id = reference to loop so it can cleared later
 * @param repeat = no of times to repeat or repeat infinitely
 * @param action = action to perform
 * @param delay = delay before repeating the action
 */
VisualNovel.prototype.loop = function loop( id, repeat, action, delay ) {

	// repeat = true : repeat infinitely
	// repeat = number : repeat number of times
	// repeat = null/undefined : no repeat, perform action once

	if ( action ) {

		var self = this;
		var timerDelay = delay ? delay : 100;

		var eventToAdd = function eventToAdd() {

			// check if loop exists, and clear if it does
			if ( self.timers[ id ] ) {

				self.clearLoop( id );
				self.timers[ id ] = null;
			
			}

			if ( repeat === true ) {

				// repeat infinitely
				self.timers[ id ] = {
					type : "interval",
					timer : setInterval( function() {
						action();
					}, timerDelay )
				};

			} else if ( repeat > 0 ) {

				// repeat a number of times
				var repeatTimes = repeat;
				var repeatTimeout = function() {
					action();
					repeatTimes--;
					checkRepeat();
				};
				var checkRepeat = function() {
					
					if ( repeatTimes ) {
						self.timers[ id ].timer = setTimeout( repeatTimeout, timerDelay );
					} else {
						self.timers[ id ].timer = null;
					}

				};

				self.timers[ id ] = {
					type : "timeout",
					timer : null
				};

				checkRepeat();

			} else {

				action();
			
			}

		};

		this.eventTracker.addEvent( "nowait", eventToAdd );

	}

};

/**
 * Function: clearLoop
 *
 * Clear the loop stored in timers
 *
 * @param id = reference to loop timer
 */
VisualNovel.prototype.clearLoop = function clearLoop( id ) {

	var self = this;

	function eventToAdd() {

		self.clearTimer( id );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

/**
 * Function: clearTimer
 *
 * Clear a timer by checking it in timers
 *
 * @param id = reference to the timer
 */
VisualNovel.prototype.clearTimer = function clearTimer( id ) {

	var timerInfo = this.timers[ id ];

	if ( timerInfo ) {

		if ( timerInfo.type === "timeout" ) {

			clearTimeout( timerInfo.timer );

		} else if ( timerInfo.type === "interval" ) {

			clearInterval( timerInfo.timer );

		}

		this.timers[ id ] = null;

	}

};

/**
 * Function: resetLoops
 *
 * Reset all loops that have not been cleared
 * Loops are stored in timers
 */
VisualNovel.prototype.resetLoops = function resetLoops() {

	var loops = this.timers;
	var loopType = null;

	for ( var loopId in loops ) {

		loopType = loops[ loopId ] ? loops[ loopId ].type : null;

		if ( loopType && ( loopType === "timeout" || loopType === "interval" ) ) {

			this.clearTimer( loopId );
		
		}

	}

};