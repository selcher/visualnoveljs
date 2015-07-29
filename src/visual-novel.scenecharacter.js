( function( VN ) {
	
	VN.prototype.initCharacterContainer = function initCharacterContainer() {

		// TODO: refactor

		this.screenCharacterId = document.getElementById( this.novelId + "-screen-character" );

		var screenCharacter = this.screenCharacterId;

		// set character container size and hide it
		var newStyle = ";display:none;width:" + this.screenWidth + 
			"px;height:" + this.screenHeight + "px;";
			
		screenCharacter.style.cssText += newStyle;

		// create character sprite container
		var spritely = this.spritely;
		var characterContainer = new spritely( screenCharacter );

		characterContainer.addChild( spritely.createCenteredContainer() );

		this.characterContainer = characterContainer;

	};

	VN.prototype.addCharacter = function addCharacter( character, delay, fadeIn ) {

		var self = this;

		function createCharacter() {
			
			// show
			self.screenCharacterId.style.display = "block";

			var characterWidth = character.width;
			var characterHeight = character.height;

			var transformX = characterWidth / 2;

			var posY = ( self.screenHeight - characterHeight ) + 
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

			
			var c = getCharacterConstructor( self );
			
			c = c( characterWidth, characterHeight, position, transformOrigin );

			c.setBackground( characterWidth, characterHeight, self.getCharacterImage( character ) );
			
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

	VN.prototype.getCharacter = function getCharacter( name ) {

		var characterObjectInfo = this.util.getObjectInList( this.characters, "name", name );
		
		return characterObjectInfo.obj;

	};

	VN.prototype.getCharacterImage = function getCharacterImage( character, type ) {

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

	VN.prototype.changeCharacterImage = function changeCharacterImage( character, type ) {

		var self = this;

		function eventToAdd() {

			self.setCharacterImage( character, type );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.setCharacterImage = function setCharacterImage( character, type ) {

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

	VN.prototype.removeCharacter = function removeCharacter( character, delay, fadeOut ) {

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

	VN.prototype.removeAllCharacter = function removeAllCharacter( delay ) {

		var self = this;

		function callRemoveAllCharacter() {
			self.resetCharacters();
		}

		function eventToAdd() {
			self.eventTracker.delayCallback( delay, callRemoveAllCharacter );
		}

		this.eventTracker.addEvent( "nowait", eventToAdd, delay );

	};

	VN.prototype.resetCharacters = function resetCharacters() {

		var characters = this.characterContainer ? this.characterContainer.children : [];
		var totalCharacters = characters.length;

		for( var i = totalCharacters - 1; i >= 1; i-- ) {

			this.characterContainer.removeChildAt( i );

		}

		this.characters = [];

	};





	VN.prototype.moveCharacter = function moveCharacter( character, x, y, delay ) {

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

	VN.prototype.fadeCharacter = function fadeCharacter( character, type, speed, from, to ) {

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

	VN.prototype.flipCharacter = function flipCharacter( character ) {

		var self = this;

		function eventToAdd() {

			var characterObject = self.getCharacter( character.name );
			var sprite = characterObject.sprite;
			var newScale = sprite.scaleX > 0 ? -1 : 1;
			
			sprite.setScaleX( newScale ).update();
		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};






	var getCharacterConstructor = function( novel ) {

		var Sprite = novel.sprite;

		/**
		 *	Object : Character
		 *  States:
		 *		1. sprite
		 *  Behaviors:
		 *		1. Move
		 *		2. Rotate
		 *		3. FadeIn/FadeOut
		 **/
		function Character( width, height, position, transformOrigin, rotate ) {

			if ( this instanceof Character ) {

				// Call the parent constructor
				Sprite.apply( this, arguments );

				// Add states

				this.init( width, height, position, transformOrigin, rotate );

				return this;

			} else {

				return new Character( width, height, position, transformOrigin, rotate );

			}

		}

		// Create a Character.prototype object that inherits from Sprite.prototype
		Character.prototype = Object.create( Sprite.prototype );

		// Set the "constructor" property to refer to Character
		Character.prototype.constructor = Character;

		getCharacterConstructor = function() {

			return Character;

		};

		return Character;

	};

} )( window.VisualNovel = window.VisualNovel || {} );