/**
 * Function: Sprite
 *
 * Constructor for creating a sprite
 *
 * States :
 *		1. sprite
 * Behaviors :
 *		1. Move
 *		2. Rotate
 *		3. Fade
 *
 * @param width = width of sprite
 * @param height = height of sprite
 * @parram position = x, y, z position of sprite
 * @param transformOrigin = position of css transform
 * @param rotate = rotation angles along x, y, z axis
 **/
function Sprite( width, height, position, transformOrigin, rotate ) {

	if ( this instanceof Sprite ) {

		// Add states
		this.sprite = null;

		this.init( width, height, position, transformOrigin, rotate );

		return this;

	} else {

		return new Sprite( width, height, position, transformOrigin, rotate );

	}

}

/**
 * Function: init
 *
 * Initialize sprite using Sprite3D JS library
 *
 * @param width = width of sprite
 * @param height = height of sprite
 * @parram position = x, y, z position of sprite
 * @param transformOrigin = position of css transform
 * @param rotate = rotation angles along x, y, z axis
 */
Sprite.prototype.init = function init( width, height, position, transformOrigin, rotate ) {

	var s = this.createSprite( width, height, position, transformOrigin, rotate );

	this.sprite = s;

};

/**
 * Function: createSprite
 *
 * Return a Sprite3D instance
 * Uses Sprite3D JS library
 *
 * @param width = width of sprite
 * @param height = height of sprite
 * @parram position = x, y, z position of sprite
 * @param transformOrigin = position of css transform
 * @param rotate = rotation angles along x, y, z axis
 */
Sprite.prototype.createSprite = function createSprite( width, height, position, transformOrigin, rotate ) {

	var pos = position;
	var transOrigx = transformOrigin.x;
	var transOrigy = transformOrigin.y;
	var transOrigz = transformOrigin.z;
	
	var s = new Sprite3D()
		.setClassName( "sprite" )
		.setSize( width, height )
		.setTransformOrigin( transOrigx, transOrigy, transOrigz )
		.setPosition( pos.x, pos.y, pos.z )
		.rotateX( rotate && rotate.x ? rotate.x : 0 )
		.rotateY( rotate && rotate.y ? rotate.y : 0 )
		.rotateZ( rotate && rotate.z ? rotate.z : 0 )
		.setRotateFirst( true );

	s.setCSS( "-webkit-transform-origin", 
		transOrigx + "px " + transOrigy + "px" ).update();

	s.timer = {};

	return s;

};

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
Sprite.prototype.setBackground = function setBackground( width, height, image, color ) {

	var bgSize = width && height ? "background-size:" + width + "px " + height + "px;" : "";
	var bgImage = image ? "background-image:url('" + image + "');" : "";
	var bgColor = color ? "background-color:" + color + ";" : "";
	var preSemicolon = bgSize || bgImage || bgColor ? ";" : "";

	this.sprite.style.cssText += preSemicolon + bgSize + bgImage + bgColor;

};

/**
 * Function: move
 *
 * Move sprite to position x, y, z at speed
 *
 * @param x = x position
 * @param y = y position
 * @param z = z position
 * @param duration = duration of move in milliseconds
 */
Sprite.prototype.move = function move( x, y, z, duration ) {

	// console.log( "from:", this.sprite.x, this.sprite.y );
	// console.log( "to:", x, y, z, duration );
	
	// spriteType = character => use y ( up / down )
	//			  = container => use z ( up / down )
	var sprite = this.sprite;
	var originalPos = {
		"x": sprite.x,
		"y": sprite.y,
		"z": sprite.z
	};
	var distance = {
		"x": x - sprite.x,
		"y": y - sprite.y,
		"z": z - sprite.z
	};

	var animationStartTime = Date.now();
	var animationDuration = 500;

	var moveUpdate = function() {

		var currentTime = Date.now();
		var timeDifference = ( currentTime - animationStartTime ) / animationDuration;

		// TODO: when moving, update transform origin...

		sprite.x = originalPos.x + Math.floor( timeDifference * distance.x );
		sprite.y = originalPos.y + Math.floor( timeDifference * distance.y );
		// console.log( timeDifference, sprite.x, sprite.y );

		sprite.update();

		if ( timeDifference <= 1 ) {

			requestAnimationFrame( moveUpdate );
		
		}

	};

	requestAnimationFrame( moveUpdate );

};

// TODO: moveTo
/**
 * Function: moveTo
 *
 * Move sprite to position x, y, z
 *
 * @param x = x position
 * @param y = y position
 * @param z = z position
 */
Sprite.prototype.moveTo = function moveTo( x, y, z, sprite ) {

	var spriteToMove = sprite ? sprite : this.sprite;

	spriteToMove.x = x;
	spriteToMove.y = y;
	spriteToMove.z = z;

	spriteToMove.update();

};

/**
 * Function: rotate
 *
 * Rotate sprite along axis at the given speed
 *
 * @param axis = axis to rotate sprite
 * @param angle = angle to rotate sprite
 * @param speed = delay between each 1 angle rotation
 * @param loop = set to true to continuously rotate at given angle
 * @param sprite = sprite to rotate ( optional )
 */
Sprite.prototype.rotate = function rotate( axis, angle, speed, loop, sprite ) {
	
	// type : container ( z )
	//		  object ( y )
	//		  floor ( z )

	var spriteToRotate = sprite ? sprite : this.sprite;
	var callRotateSprite = function() {};
	var rotateDelay = speed ? speed : 0;

	if ( axis ) {

		callRotateSprite = function() {
			spriteToRotate[ "rotate" + axis.toUpperCase() ]( angle ).update();
		};

	}

	if ( loop ) {
		
		// Rotate sprite continuously
		spriteToRotate.timer.rotate = setInterval( function() {
			
			callRotateSprite();
		
		}, rotateDelay );

	} else {

		// Rotate sprite after delay
		spriteToRotate.timer.rotate = setTimeout( function() {

			callRotateSprite();

		}, rotateDelay );
		
	}

};

Sprite.prototype.rotateTo = function rotateTo( axis, angle, speed, sprite ) {
	
	// type : container ( z )
	//		  object ( y )
	//		  floor ( z )

	var self = this;
	var spriteToRotate = sprite ? sprite : this.sprite;
	var rotateAxis = axis.toUpperCase();
	var currentAngle = spriteToRotate[ "rotation" + rotateAxis ];
	
	// Rotate sprite after delay
	if ( currentAngle != angle ) {

		var angleInc = angle >= 0 ? 1 : -1;
		var callRotateSprite = function callRotateSprite() {
			spriteToRotate[ "setRotation" + rotateAxis ](
				currentAngle + angleInc ).update();
		};

		spriteToRotate.timer.rotate = setTimeout( function() {

				callRotateSprite();
				self.rotateTo( axis, angle, speed, sprite );

		}, speed ? speed : 0 );

	} else {

		spriteToRotate.timer.rotate = null;

	}

};

Sprite.prototype.fade = function fade( startOpacity, endOpacity, step, duration ) {

	// TODO: remove step...no longer needed... or keep?
	// Step + => fade in
	// Step - => fade out

	// console.log( "fade:", startOpacity, endOpacity, step, duration );

	var distance = endOpacity - startOpacity;
	var sprite = this.sprite;

	var animationStartTime = Date.now();
	var animationDuration = duration;

	var fadeUpdate = function() {

		var currentTime = Date.now();
		var timeDifference = ( currentTime - animationStartTime ) / animationDuration;

		var newOpacity = startOpacity + ( timeDifference * distance );
		// console.log( timeDifference, newOpacity );

		sprite.setOpacity( newOpacity / 100 );

		if ( timeDifference <= 1 ) {

			requestAnimationFrame( fadeUpdate );

		}

	};

	requestAnimationFrame( fadeUpdate );

};

Sprite.prototype.fadeIn = function fadeIn( speed, from, to ) {
	
	// Step + => fade in
	var startOpacity = from && from > 0 ? from : 0;
	var endOpacity = to && to > 0 ? to : 100;
	
	this.fade( startOpacity, endOpacity, 1, speed );

};

Sprite.prototype.fadeOut = function fadeOut( speed, from, to ) {
	
	// Step + => fade in
	var startOpacity = from && from > 0 ? from : 100;
	var endOpacity = to && to > 0 ? to : 0;
	
	this.fade( startOpacity, endOpacity, -1, speed );

};