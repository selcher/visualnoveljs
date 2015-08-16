/*!
 * Visual Novel JS
 * version: 1.0-2014.06.15
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

( function( w ) {

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

			// TODO: place default values here...
			this.defaultVal = {};

			// TODO: move to dialog module
			// input
			this.userInput = {};

			// screen
			this.screenWidth = width;
			this.screenHeight = height;

			// scene
			this.sceneFloorHeight = this.sceneFloorWidth =
				height > width ? height : width;

			return this;

		} else {

			return new VisualNovel( width, height, imgPath );

		}

	}

	/**
	 * Function: init
	 *
	 * Initialize visualize novel
	 * when creating a new VisualNovel instance.
	 *
	 * @param callback = function to perform after initialization
	 *					 ( e.g. add effects to start screen )
	 */
	VisualNovel.prototype.init = function init( callback ) {

		this.initContainers( this.novelId );

		this.initScreenStart( this.novelId );

		if ( callback ) {
			
			setTimeout( callback );
		
		}

	};

	/**
	 * Function: initContainers
	 *
	 * Add the dialog, character, scene and other containers
	 * to the main visual novel div container.
	 *
	 * @param novelId = id of visual novel div, and instance reference
	 */
	VisualNovel.prototype.initContainers = function initContainers( novelId ) {

		this.initNovelContainer( novelId );

		this.initSceneContainer();

		this.initSceneObjects();
		
		this.initDialog( this.screenWidth, 150, 0, this.screenHeight - 150 );

		this.initCharacterContainer();

		this.initBGContainer();

	};

	/**
	 * Function: reset
	 *
	 * Reset novel to return to the start screen.
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
	 * Called when resetting the novel.
	 * ( reset events, menu choices, characters, scenes )
	 */
	VisualNovel.prototype.resetNovel = function resetNovel() {

		this.eventTracker.resetEventsInProgress();
		this.dialog.resetMenuChoices();
		this.resetCharacters();
		this.resetScenes();
		this.resetLoops();

		this.initSceneObjects();

	};





	/**
	 * Function: initNovelContainer
	 *
	 * Initialize novel container template, size, and references.
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
	 * Variable: novelContainerTemplate
	 *
	 * Template for novel container.
	 */
	VisualNovel.prototype.novelContainerTemplate = [
		"<div class='novel-container unSelectable'>",
			"<div id='{novelId}-screen-start' class='novel screen-start'></div>",
			"<div id='{novelId}-dialog-menu' class='novel dialog-menu'></div>",
			"<div id='{novelId}-dialog-novelmode' class='novel dialog-novelmode'></div>",
			"<div id='{novelId}-dialog-dialogmode' class='novel dialog-dialogmode'></div>",
			"<div id='{novelId}-screen-character' class='novel screen-character'></div>",
			"<div id='{novelId}-screen-scene' class='novel screen-scene'></div>",
			"<div id='{novelId}-screen-bg' class='novel screen-bg'></div>",
		"</div>"
	].join( "" );

	/**
	 * Function: buildNovelContainer
	 *
	 * Build the html content for the novel container.
	 *
	 * @param novelId = id of visual novel div, and instance reference
	 */
	VisualNovel.prototype.buildNovelContainerContent = function buildNovelContainerContent( novelId ) {

		return this.parser.parseTemplate( this.novelContainerTemplate, { "novelId": novelId } );

	};

	/**
	 * Function: setNovelContainerContent
	 *
	 * Set the html content of the novel container.
	 *
	 * @param content = content of the novel container
	 */
	VisualNovel.prototype.setNovelContainerContent = function setNovelContainerContent( content ) {

		this.novelContainerId.innerHTML = content;

	};

	/**
	 * Function: setNovelContainerSize
	 *
	 * Set the size of the main novel container, and the containers inside.
	 *
	 * @param width = new width
	 * @param height = new height
	 */
	VisualNovel.prototype.setNovelContainerSize = function setNovelContainerSize( width, height ) {

		// TODO : may need refactoring

		// novel container
		var novelContainer = this.novelContainerId;
		var sizeStyle = ";width:" + width + "px;height:" + height + "px;";
		var newStyle = ";overflow:hidden" + sizeStyle;
		
		novelContainer.style.cssText += newStyle;

		// containers ( scene, character, dialog, menu, ... )
		var containers = novelContainer.getElementsByClassName( "novel" );

		this.util.foreach( containers, function( container ) {

			container.style.cssText += sizeStyle;
		
		} );

	};

	// Add as global namespace
	w.VisualNovel = VisualNovel;

} )( window );