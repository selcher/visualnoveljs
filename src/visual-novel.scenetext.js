( function( VN ) {

	// TODO : add another implementation since text isn't crisp / sharp because of transformation
	//			create another div for text container
	//			create a SceneText class

	VN.prototype.addTextToScene = function addTextToScene( name, text, info, delay ) {

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

			var sceneObject = getSceneObjectConstructor( self );

			sceneObject = sceneObject( width, height, pos );

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

	VN.prototype.fadeSceneText = function fadeSceneText( name, type, fadeSpeed ) {

		this.fadeSceneObject( name, type, fadeSpeed );

	};

	VN.prototype.moveSceneText = function moveSceneText( name, x, y, z, moveSpeed, delay ) {

		this.moveSceneObject( name, x, y, z, moveSpeed, delay );

	};

	VN.prototype.rotateSceneText = function rotateSceneText( name, axis, angle, speed, loop ) {

		this.rotateSceneObject( name, axis, angle, speed, loop );

	};

	VN.prototype.removeSceneText = function removeSceneText( name ) {

		this.removeSceneObject( name );

	};





	var getSceneObjectConstructor = function( novel ) {

		var Sprite = novel.sprite;

		/**
		 *	Object : Scene
		 *  States:
		 *		1. sprite
		 *  Behaviors:
		 *		1. Move
		 *		2. Rotate
		 *		3. FadeIn/FadeOut
		 **/
		function SceneObject( width, height, position, transformOrigin, rotate ) {

			if ( this instanceof SceneObject ) {

				// Call the parent constructor
				Sprite.apply( this, arguments );

				// Add states

				this.init( width, height, position, transformOrigin, rotate );

				return this;

			} else {

				return new SceneObject( width, height, position, transformOrigin, rotate );

			}

		}

		// Create a SceneObject.prototype object that inherits from Sprite.prototype
		SceneObject.prototype = Object.create( Sprite.prototype );

		// Set the "constructor" property to refer to SceneObject
		SceneObject.prototype.constructor = SceneObject;

		SceneObject.prototype.init = function init( width, height, position, transformOrigin, rotate ) {

			var pos = {
				x : position.x - 25,
				y : position.z,
				z : position.y
			};
			var trans = {
				x : position.x + ( width / 2 ),
				y : 0
			};

			var sceneObjectContainer = this.createSprite( 50, 50, pos, trans );

			sceneObjectContainer.addClassName( "sceneObjectContainer" );
			
			pos = {
				x : -( width / 2 ) + 25,
				y : -height,
				z : 0
			};
			trans = {
				x : 25,
				y : 0,
				z : 0
			};
			var rot = {
				x : 90, //+ 20, // refactor
				y : 0,
				z : 0
			};

			var sceneObject = this.createSprite( width, height, pos, trans, rot );
			sceneObject.addClassName( "sceneObject" ).update();

			// Add scene object ( perpendicular to floor )
			// inside container ( parallel to floor )
			// Note: to move object => move container
			//       to rotate object => rotate object
			sceneObjectContainer.addChild( sceneObject );

			this.sprite = sceneObjectContainer;

		};

		SceneObject.prototype.setBackground = function setBackground( width, height, image, color ) {

			// this.sprite => sceneObjectContainer
			var sceneObject = this.sprite.children[ 0 ];

			var bgSize = width && height ? "background-size:" + width + "px " + height + "px;" : "";
			var bgImage = image ? "background-image:url('" + image + "');" : "";
			var bgColor = color ? "background-color:" + color + ";" : "";
			var preSemicolon = bgSize || bgImage || bgColor ? ";" : "";

			sceneObject.style.cssText += preSemicolon + bgSize + bgImage + bgColor;

		};

		SceneObject.prototype.rotate = function rotate( axis, angle, loop, sprite ) {

			// this.sprite => sceneObjectContainer
			var sceneObject = this.sprite.children[ 0 ];

			Sprite.prototype.rotate.call( this, axis, angle, loop, sceneObject );

		};

		SceneObject.prototype.rotateTo = function rotateTo( axis, angle, duration, sprite ) {

			// this.sprite => sceneObjectContainer
			var sceneObject = this.sprite.children[ 0 ];

			Sprite.prototype.rotateTo.call( this, axis, angle, duration, sceneObject );

		};

		getSceneObjectConstructor = function() {

			return SceneObject;

		};

		return SceneObject;

	};

} )( window.VisualNovel = window.VisualNovel || {} );