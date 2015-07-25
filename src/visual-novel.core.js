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

		// store images for preloading, or let user handle it?
		// preloading not yet implemented ( use preloadjs )
		this.imgPath = imgPath ? imgPath : "";
		this.images = [];

		// div elements
		this.novelContainerId = null;
		
		this.screenCharacterId = null;

		// TODO: place default values here...
		this.defaultVal = {};

		// scene
		this.scenes = {
			text : [],
			object : []
		};

		// character
		this.characterContainer = null;
		this.characters = [];

		// input
		this.userInput = {};

		// screen
		this.screenWidth = width;
		this.screenHeight = height;

		// scene
		this.sceneFloorHeight = height > width ? height : width;
		this.sceneFloorWidth = height > width ? height : width;

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

	this.initContainers( this.novelId );

	this.initScreenStart( this.novelId );

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
	
	this.initDialog( this.screenWidth, 150, 0, this.screenHeight - 150 );

	this.initCharacterContainer();

	this.initBGContainer();

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
	this.dialog.resetMenuChoices();
	this.resetCharacters();
	this.resetScenes();
	this.resetLoops();

	this.scenes = {
		"text": [],
		"object": []
	};

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
	var newStyle = ";overflow:hidden;width:" + width + "px;height:" + height + "px;";
	
	// novel container
	novelContainer.style.cssText += newStyle;

	// containers ( scene, character, dialog, menu, ... )
	this.util.foreach( containers, function( container ) {

		newStyle = ";width:" + width + "px;height:" + height + "px;";
		container.style.cssText += newStyle;
	
	} );

};




































VisualNovel.prototype.addObjectToScene = function addObjectToScene( name, bgInfo, position, delay, fadeInfo ) {

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

		var sceneObject = self.objectFactory( "SceneObject", width, height, pos );

		sceneObject.setBackground( width, height, 
			bgInfo.path ? self.imgPath + bgInfo.path : "", bgInfo.color );

		if ( fadeInfo ) {

			sceneObject.fadeIn( fadeInfo.duration, fadeInfo.from, fadeInfo.to );

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
			{
				x : typeof x !== "undefined" ? x : sprite.x,
				y : typeof y !== "undefined" ? y : sprite.y,
				z : typeof z !== "undefined" ? z : sprite.z
			},
			{
				x : this.screenWidth,
				y : this.screenHeight,
				z : this.screenHeight
			}
		);

	if ( moveSpeed ) {
		sceneObject.move( newPos.x, newPos.y, newPos.z, moveSpeed );
	} else {
		sceneObject.moveTo( newPos.x, newPos.y, newPos.z );
	}

};

VisualNovel.prototype.rotateSceneObject = function rotateSceneObject( name, axis, angle, duration, loop ) {

	var self = this;

	function eventToAdd() {

		self.setSceneObjectRotation( name, axis, angle, duration, loop );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setSceneObjectRotation = function setSceneObjectRotation( name, axis, angle, duration, loop ) {

	var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
	var sceneObject = sceneObjectInfo.obj;

	if ( loop ) {
		
		sceneObject.rotate( axis, angle, loop );
	
	} else {

		sceneObject.rotateTo( axis, angle, duration );

	}

};

VisualNovel.prototype.fadeSceneObject = function fadeSceneObject( name, type, fadeSpeed, from, to ) {

	var self = this;

	function eventToAdd() {

		self.setSceneObjectFade( name, type, fadeSpeed, from, to );

	}

	this.eventTracker.addEvent( "nowait", eventToAdd );

};

VisualNovel.prototype.setSceneObjectFade = function setSceneObjectFade( name, type, fadeSpeed, from, to ) {

	var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
	var sceneObject = sceneObjectInfo.obj;
	var fadeType = typeof type === "string" ? type.toLowerCase() : "";

	if ( fadeType === "in" ) {

		sceneObject.fadeIn( fadeSpeed, from, to );

	} else if ( fadeType === "out" ) {

		sceneObject.fadeOut( fadeSpeed, from, to );

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

			if ( action === "rotate" ) {

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

		var sceneObject = self.objectFactory( "SceneObject", width, height, pos );

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












VisualNovel.prototype.initCharacterContainer = function initCharacterContainer() {

	// TODO: refactor

	this.screenCharacterId = document.getElementById( this.novelId + "-screen-character" );

	var screenCharacter = this.screenCharacterId;

	// set character container size and hide it
	var newStyle = ";display:none;width:" + this.screenWidth + 
		"px;height:" + this.screenHeight + "px;";
		
	screenCharacter.style.cssText += newStyle;

	// create character sprite container
	this.characterContainer = this.objectFactory( "SpriteContainer", screenCharacter );

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
		var c = self.objectFactory( "Character", character.width, character.height, position, transformOrigin );
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