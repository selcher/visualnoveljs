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
		this.screenSceneId = null;
		this.screenBgId = null;

		// TODO: place default values here...
		this.defaultVal = {};

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

		// input
		this.userInput = {};

		// screen
		this.screenWidth = width;
		this.screenHeight = height;

		// scene
		this.sceneFloorHeight = height > width ? height : width;
		this.sceneFloorWidth = height > width ? height : width;

		// timers
		this.timers = {};

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
	var newStyle = ";overflow:hidden;width:" + width + "px;height:" + height + "px;";
	
	// novel container
	novelContainer.style.cssText += newStyle;

	// containers ( scene, character, dialog, menu, ... )
	this.util.foreach( containers, function( container ) {

		newStyle = ";width:" + width + "px;height:" + height + "px;";
		container.style.cssText += newStyle;
	
	} );

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

	var objectFactory = this.objectFactory;

	// build scene container
	var sceneContainer = objectFactory( "SpriteContainer", element );
	var stage = sceneContainer.children[ 0 ];

	// build scene floor
	var sceneFloor = objectFactory( "SceneFloor", width, height );
	var sceneFloorContainer = objectFactory( "SceneFloorContainer" );

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





















VisualNovel.prototype.initCharacterContainer = function initCharacterContainer() {

	// TODO: refactor

	var screenCharacter = this.screenCharacterId;

	// set character container size and hide it
	var newStyle = ";display:none;width:" + this.screenWidth + 
		"px;height:" + this.screenHeight + "px;";
		
	screenCharacter.style.cssText += newStyle;

	// create character sprite container
	this.characterContainer = this.objectFactory( "SpriteContainer", screenCharacter );

};










VisualNovel.prototype.initBGContainer = function initBGContainer() {

	// create screen bg sprite container
	// this.screenBgId = ObjectFactory( "SpriteContainer", this.screenBgId );
	this.screenBgId = this.objectFactory( "ScreenBg", this.screenBgId );

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
	// Note: for animation: use setBGScale instead

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

	this.screenBgId.setSize( width, height )
				.setCSS( "background-size", width + "px " + height + "px" );

};

VisualNovel.prototype.setBgScale = function setBgScale( scaleWidth, scaleHeight, duration, delay ) {

	var self = this;

	function eventToAdd() {

		var sprite = self.screenBgId;
		
		if ( duration ) {

			var previousScaleWidth = sprite.scaleX;
			var previousScaleHeight = sprite.scaleY;
			var distance = {
				"width": scaleWidth - previousScaleWidth,
				"height": scaleHeight - previousScaleHeight
			};

			var animationStartTime = Date.now();
			var animationDuration = duration;

			var bgScaleUpdate = function() {

				var currentTime = Date.now();
				var timeDifference = ( currentTime - animationStartTime ) / animationDuration;

				if ( timeDifference <= 1 ) {

					sprite.setScale(
						previousScaleWidth + ( timeDifference * distance.width ),
						previousScaleHeight + ( timeDifference * distance.height ),
						1
					).update();

					requestAnimationFrame( bgScaleUpdate );
				
				}

			};

			requestAnimationFrame( bgScaleUpdate );

		} else {

			sprite.setScale( scaleWidth, scaleHeight, 1 ).update();

		}

	}

	this.eventTracker.addEvent( "nowait", eventToAdd, delay );

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