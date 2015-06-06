// Factory for creating objects

function ObjectFactory( type ) {

	var newObject = null;
	
	if ( type === "SceneObject" ) {

		newObject = SceneObject.apply( {}, [].slice.call( arguments, 1 ) );

	}

	if ( type === "Character" ) {

		newObject = Character.apply( {}, [].slice.call( arguments, 1 ) );

	}

	if ( type === "SpriteContainer" ) {

		// TODO: refactor into SpriteContainer class so ScreenBg can reuse it
		newObject = new Sprite3D( arguments[ 1 ] );
		newObject.addChild( Sprite3D.createCenteredContainer() );

	}

	if ( type === "ScreenBg" ) {

		// TODO: refactor to create ScreenBg class
		newObject = new Sprite3D( arguments[ 1 ] );
		newObject.addChild( Sprite3D.createCenteredContainer() );

		newObject.sprite = newObject;
		newObject.timer = {};		
		newObject.rotate = Sprite.prototype.rotate;
		newObject.rotateTo = Sprite.prototype.rotateTo;
		newObject.fade = Sprite.prototype.fade;
		newObject.fadeIn = Sprite.prototype.fadeIn;
		newObject.fadeOut = Sprite.prototype.fadeOut;

	}

	if ( type === "SceneFloor" ) {

		var width = arguments[ 1 ];
		var height = arguments[ 2 ];
		var position = { x : -( width / 2 ), y : -( height / 2 ), z : -50 };
		var transformOrigin = { x : 0, y : 0 };
		var rotate = { x : -90, y : 0, z : 0 };
		newObject = new Sprite( width, height, position, transformOrigin, rotate );

	}

	if ( type === "SceneFloorContainer" ) {

		// TODO : refactor
		newObject = new Sprite3D()
			.setClassName( "sceneFloorContainer" )
			.setZ( 0 )
			.rotateX( -20 )
			.update();

	}

	return newObject;

}
















































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

/**
 * Function: setBackground
 *
 * Set background image or color of sprite
 *
 * @param width = width of background image
 * @param height = height of background image
 * @param image = path to image
 * @param color = background color
 */
Character.prototype.setBackground = function setBackground( width, height, image, color ) {

	var bgSize = "";
	var bgImage = "";

	if ( typeof image === "object" ) {

		bgImage = image && image.src ? "background-image:url('" + image.src + "');" : "";
		bgImage += bgImage && image.position ? "background-position:" + image.position + ";" : "";

	} else {

		bgSize = width && height ? "background-size:" + width + "px " + height + "px;" : "";
		bgImage = image ? "background-image:url('" + image + "');" : bgImage;

	}
	
	var bgColor = color ? "background-color:" + color + ";" : "";
	var preSemicolon = bgSize || bgImage || bgColor ? ";" : "";

	this.sprite.style.cssText += preSemicolon + bgSize + bgImage + bgColor;

};


















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
		x : 90 + 20, // refactor
		y : 0,
		z : 0
	};

	var sceneObject = this.createSprite( width, height, pos, trans, rot );
	sceneObject.update();

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

SceneObject.prototype.rotate = function rotate( axis, angle, speed, loop, sprite ) {

	// this.sprite => sceneObjectContainer
	var sceneObject = this.sprite.children[ 0 ];

	Sprite.prototype.rotate.call( this, axis, angle, speed, loop, sceneObject );

};

SceneObject.prototype.rotateTo = function rotateTo( axis, angle, speed, sprite ) {

	// this.sprite => sceneObjectContainer
	var sceneObject = this.sprite.children[ 0 ];

	Sprite.prototype.rotateTo.call( this, axis, angle, speed, sceneObject );

};