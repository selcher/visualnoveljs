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

function VisualNovel( width, height, imgPath ) {

	if ( this instanceof VisualNovel ) {

		this.novelMode = "dialog"; // dialog or novel
		this.imgPath = imgPath ? imgPath : "";
		this.screenStartId = document.getElementById( "screen-start" );
		this.novelModeId = document.getElementById( "dialog-novelmode" );
		this.dialogModeId = document.getElementById( "dialog-dialogmode" );
		this.dialogMenuId = document.getElementById( "dialog-menu" );
		this.screenCharacterId = document.getElementById( "screen-character" );
		this.screenSceneId = document.getElementById( "screen-scene" );
		this.screenBgId = document.getElementById( "screen-bg" );


		this.sceneContainer = null;
		this.sceneFloor = null;
		this.scenes = {
			text : [],
			object : []
		};

		this.characterContainer = null;
		this.characters = [];

		this.menuChoicesTaken = {};
		this.menuChoices = {};

		this.userInput = {};

		this.eventsInProgress = [ "main" ];
		this.eventId = {
			"main" : 0
		};
		this.eventList = {
			"main" : []
		};
		this.doRepeatEvent = false;

		this.timers = {};


		this.screenHeight = height;
		this.screenWidth = width;

		this.dialogHeight = 150;
		this.dialogPadding = 10;
		this.dialogTextColor = "white";
		this.dialogBgColor = "rgba(0,0,0,0.5)";

		this.sceneHeight = this.screenHeight - this.dialogHeight;
		this.sceneFloorHeight = height > width ? height : width;
		this.sceneFloorWidth = height > width ? height : width;


		this.init();

		return this;

	} else {

		return new VisualNovel( width, height, imgPath );

	}

}

VisualNovel.prototype.init = function init() {

	this.initNovelContainer();
	this.initScreenStart();

	this.initSceneContainer();
	this.initDialogMenuContainer();
	this.initNovelModeContainer();
	this.initDialogModeContainer();
	this.initCharacterContainer();

	// create objects...
	this.util = new Util();
	this.effect = new Effect( this.screenWidth, this.screenHeight );

};

VisualNovel.prototype.initNovelContainer = function initNovelContainer() {

	var list = document.getElementsByClassName( "novel" );
	var length = list ? list.length : 0;
	var style = null;

	for( var i = 0; i < length; i++ ) {

		style = list[ i ].style;
		style.width = this.screenWidth + "px";
		style.height = this.screenHeight + "px";

	}

};

VisualNovel.prototype.initScreenStart = function initScreenStart() {

	var self = this;
	var screenStart = this.screenStartId;

	var startMenuButtons = "";

	startMenuButtons += "<div id='startMenuButtonContainer'>";
	startMenuButtons += "<button id='startMenuButton' class='startMenuButton' >";
	startMenuButtons += "START</button>";
	startMenuButtons += "</div>";

	// show
	screenStart.style.display = "block";

	screenStart.innerHTML = startMenuButtons;

	document.getElementById( "startMenuButton" ).onclick = function clickStartMenuButton() {
		self.startNovel();
	};

};

VisualNovel.prototype.initSceneContainer = function initSceneContainer() {

	var sceneContainer = new Sprite3D( this.screenSceneId );
	var stage = Sprite3D.createCenteredContainer();
	sceneContainer.addChild( stage );

	
	var sceneFloor = new Sprite3D()
		.setClassName( "sceneFloor" )
		.setSize( this.sceneFloorWidth, this.sceneFloorHeight )
		.setTransformOrigin( 0, 0 )
		.setPosition( -( this.sceneFloorWidth / 2 ), -( this.sceneFloorHeight / 2 ), -50 )
		.rotateX( -90 )
		.setRotateFirst( true )
		.update();

	sceneFloor.indexInList = "floor";

	var sceneFloorContainer = new Sprite3D().setZ( 0 ).rotateX( -20 ).update();

	sceneFloorContainer.addChild( sceneFloor );

	stage.addChild( sceneFloorContainer );

	this.sceneContainer = sceneFloorContainer;
	this.sceneFloor = sceneFloor;

};

VisualNovel.prototype.initDialogMenuContainer = function initDialogMenuContainer() {

	// Hide
	this.dialogMenuId.style.display = "none";

};

VisualNovel.prototype.initNovelModeContainer = function initNovelModeContainer() {

	// Hide
	this.novelModeId.style.display = "none";

};

VisualNovel.prototype.initDialogModeContainer = function initDialogModeContainer() {

	var style = this.dialogModeId.style;

	style.height = ( this.dialogHeight - ( this.dialogPadding * 2 ) ) + "px";
	style.width = ( this.screenWidth - ( this.dialogPadding * 2 ) ) + "px";
	style.top = this.sceneHeight + "px";

	style.color = this.dialogTextColor;
	style[ "background-color" ] = this.dialogBgColor;

	// Hide
	style.display = "none";

};

VisualNovel.prototype.initCharacterContainer = function initCharacterContainer() {

	var style = this.screenCharacterId.style;

	style.height = this.screenHeight + "px";
	style.display = "none";

	this.characterContainer = new Sprite3D( this.screenCharacterId );
	this.characterContainer.addChild( Sprite3D.createCenteredContainer() );

};

VisualNovel.prototype.setStartScreenBgImage = function setStartScreenBgImage( imgPath, width, height ) {

	var style = this.screenStartId.style;

	style[ "background-image" ] = "url('" + this.imgPath + imgPath + "')";
	style[ "background-size" ] = width + "px " + height + "px";

};

VisualNovel.prototype.setStartScreenBgColor = function setStartScreenBgColor( color ) {

	this.screenStartId.style[ "background-color" ] = color;

};

VisualNovel.prototype.setStartScreenMenuBgImage = function setStartScreenMenuBgImage( imgPath, width, height ) {

	var style = document.getElementById( "startMenuButtonContainer" ).style;

	style[ "background-image" ] = "url('" + this.imgPath + imgPath + "')";
	style[ "background-size" ] = width + "px " + height + "px";

};

VisualNovel.prototype.setStartScreenMenuBgColor = function setStartScreenMenuBgColor( color ) {

	document.getElementById( "startMenuButtonContainer" ).style[ "background-color" ] = color;

};

VisualNovel.prototype.setStartScreenMenuPos = function setStartScreenMenuPos( x, y ) {

	var posX = x * this.screenHeight;
	var posY = y * this.screenWidth;
	var style = document.getElementById( "startMenuButtonContainer" ).style;

	style.left = posX + "px";
	style.top = posY + "px";

};

VisualNovel.prototype.setNovelMode = function setNovelMode( mode ) {

	var self = this;

	function eventToAdd() {
		self.novelMode = mode ? mode : "dialog";
	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setBgImage = function setBgImage( bgImg, width, height ) {

	var self = this;

	function eventToAdd() {

		var style = self.screenBgId.style;

		style[ "background-image" ] = "url('" + self.imgPath + bgImg + "')";
		style[ "background-size" ] = width + "px " + height + "px";

	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setBgColor = function setBgColor( bgColor ) {

	var self = this;

	function eventToAdd() {
		self.screenBgId.style.background = bgColor;
	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setDialogBgImage = function setDialogBgImage( img, width, height ) {

	this.dialogModeId.style[ "background-img" ] = img ? "url('" + this.imgPath + img + "')" : "";

	if ( width && height ) {

		this.dialogModeId.style[ "background-size" ] = width + "px " + height + "px";

	}

};

VisualNovel.prototype.setDialogBgColor = function setDialogBgColor( color ) {

	this.dialogModeId.style[ "background-color" ] = color ? color : "black";

};

VisualNovel.prototype.setDialogTextColor = function setDialogTextColor( color ) {

	this.dialogModeId.style[ "color" ] = color ? color : "white";

};

VisualNovel.prototype.setDialogBorderStyle = function setDialogBorderWidth( img, color, top, right, bottom, left, radius ) {

	var style = this.dialogModeId.style;

	var borderImg = img ? "url('" + this.imgPath + img + "')" : "";
	var borderColor = color ? color : "rgba( 0, 0, 0, 0.5 )";
	var borderRadius = radius ? radius : 0;

	style[ "border-top" ] = top + "px solid " + borderColor;
	style[ "border-right" ] = right + "px solid " + borderColor;
	style[ "border-bottom" ] = bottom + "px solid " + borderColor;
	style[ "border-left" ] = left + "px solid " + borderColor;
	style[ "border-radius" ] = radius + "px";

	style.height = ( this.dialogHeight - ( this.dialogPadding * 2 ) - ( top + bottom ) ) + "px";
	style.width = ( this.screenWidth - ( this.dialogPadding * 2 ) - ( left + right ) ) + "px";

	// dialog button needs to be repositioned
	// but can't right now since it is being added dynamically..

};

// TODO: test and implement
VisualNovel.prototype.addSceneObject = function setScene( index, imgPath, posInfo, effectInfo ) {

	var self = this;

	function eventToAdd() {

		// text container parallel to floor
		// x & y = 0 ~ 1
		var posX = posInfo.x > 1 || posInfo.x < -1 ? posInfo.x : ( posInfo.x * self.sceneFloorWidth ) - ( posInfo.width / 4 );
		var posZ = posInfo.z > 1 || posInfo.z < -1 ? posInfo.z : ( posInfo.z * self.sceneFloorHeight );
		var transformX = posX + 25;
		var transformY = posY + 25;

		var sceneTextContainer = new Sprite3D()
			.setClassName( "sceneText" )
			.setSize( 50, 50 )
			.setPosition( posX, posZ, 0 )
			.setRotateFirst( true )
			.update();

		sceneTextContainer.setCSS( "background-color", "" );
		sceneTextContainer.setCSS( "-webkit-transform-origin", 
			( posX + ( posInfo.width / 2 ) ) + "px " + "0px" );

		// text perpendicular to floor
		var posX = -posInfo.width / 4;
		var posY = posInfo.y > 1 || posInfo.y < -1 ? posInfo.y : ( posInfo.y ) * ( -self.sceneFloorHeight ) - posInfo.height;

		var sceneText = new Sprite3D()
			.setClassName( "sceneText" )
			.setSize( posInfo.width, posInfo.height )
			.setPosition( posX, posY, 0 )
			.rotateX( 90 )					// perpendicular to floor
			.setRotateFirst( true )
			.update();

		sceneText.setCSS( "background-image", 
			"url('" + self.imgPath + imgPath + "')" );
		sceneText.setCSS( "background-size",
			posInfo.width + "px " + posInfo.height + "px" );
		sceneText.setCSS( "-webkit-transform-origin", 
			"25px " + "0px" );

		if ( effectInfo ) {

			sceneText.setCSS( "color", effectInfo.color );

			// Perform text effect e.g. fadeIn
			if ( effectInfo.type ) {

				self.effect.perform( effectInfo.type, sceneText, "object", effectInfo.delay, effectInfo );

			}
		
		}
		
		sceneText.update();

		// To help us keep track of the scene text
		sceneTextContainer.indexInList = index;
		sceneText.indexInList = index;
		sceneTextContainer.type = "container";
		sceneText.type = "object";

		// Add scene object ( perpendicular to floor )
		// inside container ( parallel to floor )
		// Note: to move object => move container
		//       to rotate object => rotate object
		sceneTextContainer.addChild( sceneText );

		// Add scene object to floor and store in scenes list
		self.sceneFloor.addChild( sceneTextContainer );
		self.scenes[ "object" ].push( sceneTextContainer );

	}

	this.addEvent( "nowait", eventToAdd, effectInfo ? effectInfo.delay : 0 );

};

VisualNovel.prototype.addSceneText = function addSceneText( index, line, posInfo, effectInfo ) {

	var self = this;

	function eventToAdd() {

		var posX = ( posInfo.x ) * ( self.sceneFloorWidth );
		var posY = ( posInfo.y ) * ( -self.sceneFloorHeight );

		var sceneText = new Sprite3D()
			.setClassName( "sceneText" )
			.setPosition( posX, posY, 0 )
			.setRotateFirst( true )
			.update();

		sceneText.setCSS( "-webkit-transform-origin", 
			posX + "px " + posY + "px" );

		if ( effectInfo ) {

			sceneText.setCSS( "color", effectInfo.color );

			// Perform text effect e.g. fadeIn
			if ( effectInfo.type ) {

				self.effect.perform( effectInfo.type, sceneText, "text", effectInfo.delay, effectInfo );

			}
		
		}
		
		sceneText.setInnerHTML( line );
		sceneText.update();

		// To help us keep track of the scene text
		sceneText.indexInList = index;
		sceneText.type = "text";

		self.sceneContainer.addChild( sceneText );

		self.scenes[ "text" ].push( sceneText );

	}

	this.addEvent( "nowait", eventToAdd, effectInfo ? effectInfo.delay : 0 );

};

VisualNovel.prototype.getSceneObject = function getSceneObject( index, type ) {

	// sceneObject can be a scene text or a scene object
	var scenes = this.sceneContainer.children;
	var list = scenes;

	if ( type == "object" ) {
		var floor = scenes[ 0 ];
		var objectContainer = this.util.getObjectInList( floor.children, "indexInList", index );
		list = objectContainer ? objectContainer.obj.children : [];
	}

	if ( type == "container" ) {
		var floor = scenes[ 0 ];
		list = floor.children;
	}		

	var sceneObjectInfo = this.util.getObjectInList( list, "indexInList", index );

	return sceneObjectInfo;

};

VisualNovel.prototype.rotateScene = function rotateScene( angle, delay ) {

	var self = this;

	function eventToAdd() {
		
		var data = {
			axis : "z",
			angle : angle
		};
		var floor = self.getSceneObject( "floor" ).obj;
		self.effect.perform( "rotate", floor, "floor", delay, data );
	
	}

	this.addEvent( "nowait", eventToAdd );
};

VisualNovel.prototype.resetSceneEffect = function resetsceneEffect( index, type, effectType ) {

	var self = this;

	function eventToAdd() {

		var sceneObject = self.getSceneObject( index, type );
		sceneObject = sceneObject.obj;

		if ( sceneObject && sceneObject.timer[ effectType ] ) {

			if ( effectType == "rotate" ) {

				window.clearInterval( sceneObject.timer[ effectType ] );
				sceneObject.timer[ effectType ] = null;

			}

		}

	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.addSceneEffect = function addSceneEffect( index, type, effectInfo ) {

	var self = this;

	function eventToAdd() {

		var sceneObjectInfo = self.getSceneObject( index, type );

		self.effect.perform( effectInfo.type, sceneObjectInfo.obj, type, effectInfo.delay, effectInfo );

	}

	this.addEvent( "nowait", eventToAdd, effectInfo ? effectInfo.delay : 0 );

};

VisualNovel.prototype.removeFromScene = function removeFromScene( index, type ) {

	var self = this;

	function eventToAdd() {

		var sceneObjectInfo = self.getSceneObject( index, type );
		var sceneIndex = sceneObjectInfo.id;

		if ( type == "text" ) {
			self.sceneContainer.removeChildAt( sceneIndex );
			self.scenes[ "text" ].splice( sceneIndex, 1 );
		}

		if ( type == "object" ) {
			var sceneFloor = self.sceneContainer.children[ 0 ];
			sceneFloor.removeChildAt( sceneIndex );
			self.scenes[ "object" ].splice( sceneIndex, 1 );
		}

	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.resetScenes = function resetScenes() {

	var scenes = this.sceneContainer.children;
	var totalScenes = scenes.length;

	// Don't include 0 since it is the scene floor
	for( var i = totalScenes - 1; i >= 1; i-- ) {

		this.sceneContainer.removeChildAt( i );

	}

	this.scenes = {
		text : [],
		object : []
	};

};

VisualNovel.prototype.addCharacterEffect = function addCharacterEffect( character, effectInfo ) {

	var self = this;

	function eventToAdd() {

		var characterObjectInfo = self.util.getObjectInList( self.characterContainer.children, "name", character.name );

		self.effect.perform( effectInfo.type, characterObjectInfo.obj, "character", effectInfo.delay, effectInfo );

	}

	this.addEvent( "nowait", eventToAdd, effectInfo ? effectInfo.delay : 0 );

};

VisualNovel.prototype.moveCharacter = function moveCharacter( character, x, y, delay ) {

	var self = this;

	function eventToAdd() {

		var characterObjectInfo = self.util.getObjectInList( self.characterContainer.children, "name", character.name );
		var newPos = {
			x : x,
			y : y
		};

		self.effect.perform( "move", characterObjectInfo.obj, "character", delay, newPos );
	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.addCharacter = function addCharacter( character, delay, effect ) {

	// show
	this.screenCharacterId.style.display = "block";

	var self = this;

	var transformX = character.width / 2;

	var posY = ( this.screenHeight - character.height ) + 
			   ( this.screenHeight * character.pos.y );
	var posX = ( this.screenWidth * character.pos.x );

	var c = new Sprite3D()
		.setClassName( "sprite" )
		.setSize( character.width, character.height )
		.setTransformOrigin( transformX, 0, 0 )
		.setPosition( posX, posY, 0 )
		.rotateY( 0 )
		.setRotateFirst( true )
		.update();
	
	c.setCSS( "background-image",
		"url('" + this.imgPath + character.image + "')" );
	c.setCSS( "background-size",
		character.width + "px " + character.height + "px" );

	// To help us keep track of the character, use their name
	c.name = character.name;

	function callAddCharacter() {

		self.characterContainer.addChild( c );
		self.characters.push( c );

	}

	function eventToAdd() {
		
		if ( effect ) {

			self.effect.perform( effect, c, "character", delay );

		}

		callAddCharacter();

	}

	this.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.removeCharacter = function removeCharacter( character, delay, effect ) {

	var self = this;

	function callRemoveCharacter() {
		
		var characterObjectInfo = self.util.getObjectInList( self.characterContainer.children, "name", character.name );
		var indexInList = characterObjectInfo.id;

		self.characterContainer.removeChildAt( indexInList );
		self.characters.splice( indexInList, 1 );
	}

	function eventToAdd() {

		if ( effect ) {
			var characterObjectInfo = self.util.getObjectInList( self.characterContainer.children, "name", character.name );
			self.effect.perform( effect, characterObjectInfo.obj, "character", delay );
		}

		self.delayCallback( delay, callRemoveCharacter );
	}

	this.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.removeAllCharacter = function removeAllCharacter( delay ) {

	var self = this;

	function callRemoveAllCharacter() {
		var characters = self.characterContainer.children;
		var totalCharacters = characters.length;

		for( var i = totalCharacters - 1; i >= 0; i-- ) {
			self.characterContainer.removeChildAt( i );
		}

		self.characters = [];
	}

	function eventToAdd() {
		self.delayCallback( delay, callRemoveAllCharacter );
	}

	this.addEvent( "nowait", eventToAdd, delay );

};

VisualNovel.prototype.resetCharacters = function resetCharacters() {

	var characters = this.characterContainer.children;
	var totalCharacters = characters.length;

	for( var i = totalCharacters - 1; i >= 0; i-- ) {

		this.characterContainer.removeChildAt( i );

	}

	this.characters = [];

};

VisualNovel.prototype.replaceVariablesInText = function replaceVariablesInText( text ) {

	var processedText = text + "";

	for ( var key in this.userInput ) {

		processedText = processedText.replace("{" + key + "}", this.userInput[ key ] );

	}
	
	return processedText;

};

VisualNovel.prototype.say = function say( name, line ) {

	var mode = this.novelMode;
	var container = null;

	var self = this;

	function callSay() {

		// show
		if ( mode == "dialog" ) {
			self.dialogModeId.style.display = "block";
			self.novelModeId.style.display = "none";
			containerId = "dialogModeId";
		}

		if ( mode == "novel" ) {
			self.dialogModeId.style.display = "none";
			self.novelModeId.style.display = "block";
			containerId = "novelModeId";
		}

		var dialogLine = self.replaceVariablesInText( line );

		var dialogName = "<div id='dialogName'>" + name + "</div>";
		var dialogText = "<div id='dialogText'>" + dialogLine + "</div>";
		var okButton = "<button id='dialogButton'>OK</button>";

		self[ containerId ].innerHTML = dialogName + dialogText + okButton;

		document.getElementById( "dialogButton" ).onclick = function clickDialogButton() {
			self.nextEvent();
		};
	}

	this.addEvent( "wait", callSay );

};

VisualNovel.prototype.input = function input( storeInputKey, message ) {

	var self = this;

	function eventToAdd() {
		var menuContainer = self.dialogMenuId;

		menuContainer.style.display = "block";

		var inputDialog = "<div id='userInputContainer'>";
		inputDialog += "<div id='userInputMessage'>" + message + "</div><hr/><br/>";
		inputDialog += "<input id='userInput' type='text' /><br/><br/>";
		inputDialog += "<input type='button' id='userInputButton' value='OK' />";
		inputDialog += "</div>";

		menuContainer.innerHTML = inputDialog;

		document.getElementById( "userInputButton" ).onclick = function clickUserInputButton() {
			self.getInput( storeInputKey );
		};
	}

	this.addEvent( "wait", eventToAdd );

};

VisualNovel.prototype.getInput = function getInput( storeInputKey ) {

	var userInput = document.getElementById( "userInput" );

	this.userInput[ storeInputKey ] = userInput.value;

	this.dialogMenuId.style.display = "none";

	this.nextEvent();

};

VisualNovel.prototype.setValue = function setValue( key, value ) {

	var self = this;

	function eventToAdd() {
		
		if ( key ) {

			self.userInput[ key ] = value;

		}

	}

	this.addEvent( "nowait", eventToAdd );

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

		var totalEventsInProgress = self.eventsInProgress.length;
		var choiceEventId = self.eventsInProgress[ totalEventsInProgress - 1 ] + 
							"-condition-" + totalEventsInProgress;

		// store in events in progress
		self.eventsInProgress.push( choiceEventId );

		// create new list for events
		self.eventList[ choiceEventId ] = [];

		// create new event id
		self.eventId[ choiceEventId ] = 0;

		// register success or fail events
		if ( conditionResult ) {
			successCallback();
		} else {
			failCallback();
		}

		// call success or fail events
		self.startEvent();

	}

	// wait for condition success or fail events to register
	// then call startEvent
	this.addEvent( "wait", eventToAdd );

};

VisualNovel.prototype.choice = function choice( choiceEventId, listOfChoices, menuPos, menuImg ) {

	// choiceId = to track the choice event

	var self = this;

	function eventToAdd() {

		// show
		self.dialogMenuId.style.display = "block";

		// init event to menu choices 
		// so that we can store the choices 
		// to perform the choices on button click
		self.menuChoices[ choiceEventId ] = [];

		// For choice menu:
		// 1. build choice buttons
		// 2. build choice image
		// 3. insert buttons and image to menu container

		var choiceContainer = "<div id='dialogMenuChoiceContainer'>";

		// build choice buttons
		var buttonChoicesContainer = "<div id='dialogMenuChoiceButtonsContainer'>";
		var buttonChoices = "";
		var totalChoices = listOfChoices.length;

		for ( var i = 0; i < totalChoices; i++ ) {

			// store choice in self.menuChoices
			// so that it can be called later on button click
			self.menuChoices[ choiceEventId ].push( listOfChoices[ i ] );

			buttonChoices += "<button class='dialogMenuChoiceButton' " +
							 "id='dialogMenuChoiceButton" + i + "' >" +
							 listOfChoices[ i ].label + "</button><br/>";

		}

		buttonChoicesContainer += buttonChoices + "</div>";

		// build choice image
		var choiceImageContainer = "<div id='dialogMenuChoiceImageContainer'>";
		var choiceImage = "";
		if ( menuImg ) {

			choiceImage += "<img src='" + self.imgPath + menuImg.image + "' style='" +
						   "width:" + menuImg.width + "px;height:" + menuImg.height + ";' />";

		}
		
		choiceImageContainer += choiceImage + "</div>";
		
		// finally, build choice menu
		choiceContainer += buttonChoicesContainer + choiceImageContainer + "</div>";

		self.dialogMenuId.innerHTML = choiceContainer;

		// Attach click events to dialog menu choice buttons
		for ( var i = 0; i < totalChoices; i++ ) {

			document.getElementById( "dialogMenuChoiceButton" + i ).onclick =
				( function() {

					var index = i;

					return function clickDialogMenuChoiceButton() {
						self.performMenuChoice( choiceEventId, index );
					};

				} )()

		}

		// position choice menu
		if ( menuPos ) {

			var style = document.getElementById( "dialogMenuChoiceContainer" ).style;
			var posX = menuPos.x * self.screenWidth;
			var posY = menuPos.y * self.screenHeight;

			style.left = posX + "px";
			style.top = posY + "px";

		}

		// store in events in progress
		self.eventsInProgress.push( choiceEventId );

		// create new list for events
		self.eventList[ choiceEventId ] = [];

		// create new event id
		self.eventId[ choiceEventId ] = 0;

		// Debug
		// console.log( "choice: " + choiceEventId );
		// console.log( self.eventsInProgress );
		// console.log( self.eventList );
		// console.log( self.eventId );
		
	}

	this.addEvent( "wait", eventToAdd );

};

VisualNovel.prototype.performMenuChoice = function performMenuChoice( choiceEventId, indexInListOfChoices ) {

	var choiceTaken = this.menuChoices[ choiceEventId ][ indexInListOfChoices ];

	// store choice taken
	this.menuChoicesTaken[ choiceEventId ] = choiceTaken;

	var action = choiceTaken.action;

	// hide menu
	this.dialogMenuId.style.display = "none";

	// register events in menu choice action
	action();

	// add event to reset menu choices so that
	// it only gets called after all
	// menu choice actions are done
	this.resetMenuChoices( choiceEventId );

	// start events in menu choice action
	this.startEvent();

};

VisualNovel.prototype.resetMenuChoices = function resetMenuChoices( choiceEventId ) {

	var self = this;

	function eventToAdd() {
		
		self.menuChoices[ choiceEventId ] = [];

	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.delayCallback = function delayCallback( delay, callback ) {

	if ( delay ) {

		setTimeout( function() {
			callback();
		}, delay );

	} else {

		callback();

	}

};

VisualNovel.prototype.pause = function pause( delay ) {

	var self = this;

	function eventToAdd() {
		
		setTimeout( function() {
			self.nextEvent();
		}, delay );

	}

	this.addEvent( "wait", eventToAdd );

};

VisualNovel.prototype.startNovel = function startNovel() {

	// hide start main menu
	this.screenStartId.style.display = "none";
	
	this.startEvent();

};

VisualNovel.prototype.resetToMainMenu = function resetToMainMenu() {

	// reset menu choices
	this.menuChoicesTaken = {};
	this.menuChoices = {};

	this.eventId = {
		"main" : 0
	};
	this.eventsInProgress = [ "main" ];

	// clear dialog, characters, and scenes added
	this.resetNovelDialogText();
	this.resetCharacters();
	this.resetScenes();

	// hide dialog
	this.dialogModeId.style.display = "none";
	this.novelModeId.style.display = "none";

	// show start screen
	this.screenStartId.style.display = "block";

};

VisualNovel.prototype.repeatEvent = function repeatEvent( ) {

	var self = this;

	function eventToAdd() {
		self.doRepeatEvent = true;
	}

	this.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.addEvent = function addEvent( type, evt, delay ) {

	var currentEvent = this.eventsInProgress[ this.eventsInProgress.length - 1 ];

	this.eventList[ currentEvent ].push(
		{
			"type" : type,
			"event" : evt,
			"delay" : delay ? delay : 0
		}
	);

};

VisualNovel.prototype.startEvent = function startEvent() {

	var self = this;

	// TODO: implement deferred w/o jquery
	var deferred = $.Deferred();
	// deferred.resolve();
	// return deferred.promise();
	// promise.then( function() {
	// 	// next step
	// });

	// Get event
	var eventsInProgress = this.eventsInProgress;
	var currentEvent = eventsInProgress[ eventsInProgress.length - 1 ];
	var evtList = this.eventList[ currentEvent ];
	var evtId = this.eventId[ currentEvent ];
	var evt = evtList[ evtId ];
	var type = evt.type;
	var delay = evt.delay;

	// Debug
	// console.log( "start event: " + currentEvent + " " + evtId );
	// console.log( evtList );

	// Perform event
	evt.event();

	this.delayCallback( delay, function() {
		deferred.resolve();
	} );

	// Event types: wait / nowait
	// Perform the next event if type:
	//	1. nowait
	deferred.done( function() {

		if ( type == "nowait" ) {
			self.nextEvent( );
		}

	} );

};

VisualNovel.prototype.nextEvent = function nextEvent( ) {

	var currentEvent = this.eventsInProgress[ this.eventsInProgress.length - 1 ];
	var evtList = this.eventList[ currentEvent ];
	this.eventId[ currentEvent ] += 1;
	var evtId = this.eventId[ currentEvent ];
	
	if ( evtId < evtList.length ) {

		this.startEvent( );

	} else {
		
		// Debug
		// console.log( "no more events for: " + currentEvent );

		if ( this.eventsInProgress.length == 1 ) {

			// Return to main menu
			this.resetToMainMenu();

		} else {

			// end current event
			this.eventsInProgress.pop();

			if ( this.doRepeatEvent ) {

				// repeat previous event
				this.doRepeatEvent = false;

				this.startEvent();

			} else {

				// continue from previous event
				this.nextEvent();

			}

		}

	}

};





















// Utility ( General purpose ) functions

function Util() {

	if ( this instanceof Util ) {

		return this;

	} else {

		return new Util();

	}

}

Util.prototype.getObjectInList = function getObjectInList( list, key, value ) {

	var objectFound = {
		id : null,
		obj : null
	};
	var objects = list ? list : [];
	var totalObjects = objects.length;

	for( var i = totalObjects - 1; i >= 0; i-- ) {
		if ( objects[ i ][ key ] == value ) {
			objectFound.id = i;
			objectFound.obj = objects[ i ];
		}
	}

	return objectFound;

};

Util.prototype.extend = function extend( newClass, baseClass ) {

	// Copy states of baseClass
	for ( i in baseClass ) {

		if ( typeof newClass[ i ] === "undefined" ) {

			newClass[ i ] = baseClass[ i ];

		}

	}

	// Inherit behaviors of baseClass
	newClass.prototype = baseClass.prototype;

};




















// Effects
function Effect( screenWidth, screenHeight ) {

	if ( this instanceof Effect ) {

		this.screenWidth = screenWidth;
		this.screenHeight = screenHeight;

		return this;

	} else {

		return new Effect();

	}

}

Effect.prototype.perform = function perform( effectType, sprite, spriteType, delay, data ) {

	if ( sprite.timer == null ) {
		sprite.timer = {};
	}

	// effectType : fadeIn, fadeOut, move, rotate
	// spriteType : character, text, container, object

	if ( this[ effectType ] ) {

		this[ effectType ]( sprite, spriteType, delay, data );

	}

};

Effect.prototype.fadeIn = function fadeIn( sprite, spriteType, delay, data ) {
	
	// Step + => fade in
	var step = data && data.step ? data.step : 1;
	var startOpacity = data && typeof data.from !== "undefined" && data.from >= 0 ? data.from : 0;
	var endOpacity = data && typeof data.to !== "undefined" && data.to >= 0 ? data.to : 100;
	
	this.fade( sprite, delay, startOpacity, endOpacity, step );

};

Effect.prototype.fadeOut = function fadeIn( sprite, spriteType, delay, data ) {
	
	// Step + => fade in
	var step = data && data.step ? data.step : -1;
	var startOpacity = data && typeof data.from !== "undefined" && data.from >= 0 ? data.from : 100;
	var endOpacity = data && typeof data.to !== "undefined" && data.to >= 0 ? data.to : 0;
	
	this.fade( sprite, delay, startOpacity, endOpacity, step );

};

Effect.prototype.fade = function fade( sprite, delay, startOpacity, endOpacity, step ) {
	
	var self = this;

	// Step + => fade in
	// Step - => fade out
	var stepVal = step < 0 ? -1 : 1;
	var newOpacity = startOpacity + stepVal;
	var fadeDone = step < 0 ?
				   ( endOpacity <= newOpacity && newOpacity <= startOpacity ) :
				   ( startOpacity <= newOpacity && newOpacity <= endOpacity );

	if ( fadeDone ) {

		sprite.setOpacity( newOpacity / 100 );

		sprite.timer[ "fade" ] = setTimeout( function() {

			self.fade( sprite, delay, newOpacity, endOpacity, step );

		}, delay / 100 );

	}

};

Effect.prototype.move = function move( sprite, spriteType, delay, data ) {
	
	// TODO: when moving, update transform origin...
	
	var self = this;

	var x = data.x;
	var y = data.y;
	var z = data.z;
	
	// spriteType = character => use y ( up / down )
	//			  = container => use z ( up / down )
	var newPos = {
		x : x ? x > 1 || x < -1 ? x : x * self.screenWidth : sprite.x,
		y : y ? y > 1 || y < -1 ? y : y * self.screenHeight : sprite.y,
		z : z ? z > 1 || z < -1 ? z : z * self.screenHeight : sprite.x
	};

	var distance = {
		x : x ? Math.abs( newPos.x - sprite.x ) : 0,
		y : y ? Math.abs( newPos.y - sprite.y ) : 0,
		z : z ? Math.abs( newPos.z - sprite.z ) : 0
	};

	if ( sprite.moveStep == null ) {

		var step = {
			x : x ? sprite.x < newPos.x ? ( distance.x / 100 ) : ( -distance.x / 100 ) : 0,
			y : y ? sprite.y < newPos.y ? ( distance.y / 100 ) : ( -distance.y / 100 ) : 0,
			z : z ? sprite.z < newPos.z ? ( distance.z / 100 ) : ( -distance.z / 100 ) : 0
		};

		step.x = x ? sprite.x == newPos.x ? 0 : Math.round( step.x ) : 0;
		step.y = y ? sprite.y == newPos.y ? 0 : Math.round( step.y ) : 0;
		step.z = z ? sprite.z == newPos.z ? 0 : Math.round( step.z ) : 0;

		sprite.moveStep = step;console.log( step );
	}

	var moveStep = sprite.moveStep;
	var checkPosX = moveStep.x > 0 ? sprite.x < newPos.x : sprite.x > newPos.x;
	var checkPosY = moveStep.y > 0 ? sprite.y < newPos.y : sprite.y > newPos.y;
	var checkPosZ = moveStep.z > 0 ? sprite.z < newPos.z : sprite.z > newPos.z;
	
	// Debug
	// console.log( newPos );
	// console.log( distance );
	// console.log( checkPosX + "," + checkPosY + "," + checkPosZ );

	if ( checkPosX || checkPosY || checkPosZ ) {

		sprite.x = x ? sprite.x + moveStep.x : sprite.x;
		sprite.y = y ? sprite.y + moveStep.y : sprite.y;
		sprite.z = z ? sprite.z + moveStep.z : sprite.z;
		
		sprite.update();

		sprite.timer[ "move" ] = setTimeout( function() {

			self.move( sprite, spriteType, delay, data );

		}, delay / 100 );

	} else {

		sprite.moveStep = null;

	}

};

Effect.prototype.rotate = function rotate( sprite, spriteType, delay, data ) {

	// type : container ( z )
	//		  object ( y )
	//		  floor ( z )

	var axis = data.axis;
	var angle = data.angle;

	var spriteToRotate = sprite;
	var callRotateSprite = null;

	if ( axis == "y" ) {

		callRotateSprite = function() {
			spriteToRotate.rotateY( angle );
		};

	}

	if ( axis == "z" ) {

		callRotateSprite = function() {
			spriteToRotate.rotateZ( angle );
		};

	}

	if ( delay >= 0 ) {

		// Rotate sprite after delay
		sprite.timer[ "rotate" ] = setTimeout( function() {

			callRotateSprite();
			spriteToRotate.update();

		}, delay );

	} else {
		
		// Rotate sprite continuously
		sprite.timer[ "rotate" ] = setInterval( function() {
			
			callRotateSprite();
			spriteToRotate.update();
		
		}, -delay );

	}

};



















/**
 * Object : Sprite
 * States :
 *		1. sprite
 * Behaviors :
 *		1. Move
 *		2. Rotate
 *		3. Fade
 **/
function Sprite( width, height, position, transformOrigin ) {

	if ( this instanceof Sprite ) {

		// Add states

		this.init( width, height, position, transformOrigin );

		return this;

	} else {

		return new Sprite();

	}

}

Sprite.prototype.init = function init( width, height, position, transformOrigin ) {

	var s = createSprite( width, height, position, transformOrigin );

	this.sprite = s;

};

Sprite.prototype.createSprite = function createSprite( width, height, position, transformOrigin ) {

	var pos = position;
	var transOrig = transformOrigin;
	
	var s = new Sprite3D()
		.setClassName( "sprite" )
		.setSize( width, height )
		.setTransformOrigin( transOrig.x, transOrig.y, transOrig.z )
		.setPosition( pos.x, pos.y, pos.z )
		.update();

	return s;

};

Sprite.prototype.move = function move() {
	// override in concrete class
};

Sprite.prototype.rotate = function rotate() {
	// override in concrete class
};

Sprite.prototype.fade = function fade() {
	// override in concrete class
};



















/**
 *	Object : Character
 *  States:
 *  Behaviors:
 *		1. Move
 *		2. Rotate
 *		3. FadeIn/FadeOut
 **/
function Character() {

}

Util.prototype.extend( Character, Sprite );


















/**
 *	Object : Scene
 *  States:
 *  Behaviors:
 *		1. Move
 *		2. Rotate
 *		3. FadeIn/FadeOut
 **/
function SceneObject() {

}

Util.prototype.extend( SceneObject, Sprite );