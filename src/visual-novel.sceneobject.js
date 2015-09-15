( function( VN ) {

	VN.prototype.addObjectToScene = function addObjectToScene( name, bgInfo, position, delay, fadeInfo ) {

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

			var sceneObject = getSceneObjectConstructor( self );

			sceneObject = sceneObject( width, height, pos );

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

	VN.prototype.moveSceneObject = function moveSceneObject( name, x, y, z, moveSpeed, delay ) {

		var self = this;

		function eventToAdd() {

			self.setSceneObjectPosition( name, x, y, z, moveSpeed );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, delay ? delay : 0 );

	};

	VN.prototype.setSceneObjectPosition = function setSceneObjectPosition( name, x, y, z, moveSpeed ) {

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

	VN.prototype.rotateSceneObject = function rotateSceneObject( name, axis, angle, duration, loop ) {

		var self = this;

		function eventToAdd() {

			self.setSceneObjectRotation( name, axis, angle, duration, loop );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.setSceneObjectRotation = function setSceneObjectRotation( name, axis, angle, duration, loop ) {

		var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
		var sceneObject = sceneObjectInfo.obj;

		if ( loop ) {
			
			sceneObject.rotate( axis, angle, loop );
		
		} else {

			sceneObject.rotateTo( axis, angle, duration );

		}

	};

	VN.prototype.fadeSceneObject = function fadeSceneObject( name, type, fadeSpeed, from, to ) {

		var self = this;

		function eventToAdd() {

			self.setSceneObjectFade( name, type, fadeSpeed, from, to );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.setSceneObjectFade = function setSceneObjectFade( name, type, fadeSpeed, from, to ) {

		var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
		var sceneObject = sceneObjectInfo.obj;
		var fadeType = typeof type === "string" ? type.toLowerCase() : "";

		if ( fadeType === "in" ) {

			sceneObject.fadeIn( fadeSpeed, from, to );

		} else if ( fadeType === "out" ) {

			sceneObject.fadeOut( fadeSpeed, from, to );

		}

	};

	VN.prototype.setSceneObjectStyle = function setSceneObjectStyle( name, style ) {

		var sceneObjectInfo = this.util.getObjectInList( this.scenes.object, "name", name );
		var sceneObject = sceneObjectInfo.obj;

		sceneObject.sprite.children[0].style.cssText += style;

	};

	VN.prototype.resetSceneObject = function resetSceneObject( name, action ) {

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

	VN.prototype.removeSceneObject = function removeSceneObject( name ) {

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

	/**
	 * Function: addTextToScene
	 *
	 * info = {
	 * 		width
	 * 		height
	 * 		x = x position
	 * 		y = y position
	 * 		z = z position
	 * 		size = font size
	 * 		color = font color
	 * 		bgColor = background color
	 * 		bgImage = background image
	 * 		fade = fade duration
	 * }
	 *
	 */
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






	/**
	 * Attach module to namespace
	 */
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {

				this.scenes = {
					"text": [],
					"object": []
				};

			},
			"reset": function reset() {

				this.scenes = {
					"text": [],
					"object": []
				};				
				
			}
		}
	);

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