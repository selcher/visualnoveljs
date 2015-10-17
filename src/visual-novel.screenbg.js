( function( VN ) {

	VN.prototype.setBgImage = function setBgImage( bgImg, width, height, repeat, widthSize, heightSize ) {

		var bg = this.screenBgId;
		var img = this.imgPath + bgImg;

		function eventToAdd() {

			bg.setBgImage( img, width, height, repeat, widthSize, heightSize );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.setBgColor = function setBgColor( bgColor ) {

		var bg = this.screenBgId;

		function eventToAdd() {

			bg.setBgColor( bgColor );
		
		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.setBgSize = function setBgSize( width, height, duration, delay ) {

		// Note: for animation: use setBGScale instead

		var bg = this.screenBgId;

		function eventToAdd() {
			
			bg.setBgSize( width, height, duration );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, delay );

	};

	VN.prototype.getBgSize = function getBgSize() {

		return this.screenBgId.getBgSize();

	};

	VN.prototype.setBgSizeTo = function setBgSizeTo( width, height ) {

		this.screenBgId.setBgSizeTo( width, height );

	};

	VN.prototype.setBgScale = function setBgScale( scaleWidth, scaleHeight, duration, delay ) {

		var bg = this.screenBgId;

		function eventToAdd() {

			bg.setBgScale( scaleWidth, scaleHeight, duration );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, delay );

	};

	VN.prototype.setBgPosition = function setBgPosition( x, y, duration, delay ) {

		// TODO : refactor for smoother animation
		//		  look for better method or optimization techniques
		//		  using requestAimationFrame

		var bg = this.screenBgId;

		function eventToAdd() {

			bg.setBgPosition( x, y, duration );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, delay );

	};

	VN.prototype.getBgPosition = function getBgPosition() {

		return this.screenBgId.getBgPosition();

	};

	VN.prototype.rotateBg = function rotateBg( axis, angle, speed, loop, sprite ) {

		// Test : Rotate bg
		// vn.rotateBg( "z", 1, 25, true );
		// vn.pause( 5000 );
		// vn.stopRotateBg( 1000 );
		// vn.resetBg( "rotate" );

		var bg = this.screenBgId;

		function eventToAdd() {

			bg.rotateBg( axis, angle, speed, loop, sprite );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, 0 );	

	};

	VN.prototype.rotateBgTo = function rotateBgTo( axis, angle, speed, loop, sprite ) {

		// Test : Rotate bg to
		// vn.rotateBgTo( "z", -45, 25 );
		// vn.pause( 2000 );
		// vn.rotateBgTo( "z", 0, 25 );
		// vn.pause( 2000 );
		// vn.resetBg( "rotate" );

		var bg = this.screenBgId;

		function eventToAdd() {

			bg.rotateBgTo( axis, angle, speed, loop, sprite );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, 0 );	

	};

	VN.prototype.stopRotateBg = function stopRotateBg( delay ) {

		// TODO: implement and test with rotateBgTo

		var self = this;

		function eventToAdd() {

			// window.clearInterval( self.screenBgId.timer.rotate );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, delay );

	};

	VN.prototype.fadeBg = function fadeBg( type, fadeSpeed ) {

		var bg = this.screenBgId;

		function eventToAdd() {

			bg.fadeBg( type, fadeSpeed );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.resetBg = function resetBg( action, delay ) {

		var bg = this.screenBgId;

		function eventToAdd() {

			bg.resetBg( action );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd, delay );

	};





	/**
	 * Attach module to namespace
	 */
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {

				// create screen bg sprite container
				this.screenBgId = new ScreenBg(
					this.objectFactory(
						"ScreenBg",
						document.getElementById( novelId + "-screen-bg" )
					)
				);

			},
			"reset": function reset() {}
		}
	);

	/**
	 * Screen Background
	 */
	function ScreenBg( bg ) {

		this.screenBgId = bg;

		return this;

	}

	ScreenBg.prototype.setBgImage = function setBgImage( bgImg, width, height, repeat, widthSize, heightSize ) {

		var screenBg = this.screenBgId;

		// TODO : check how Sprite3D updates css...
		screenBg.setPosition( 0, 0, 0 ).setSize( width, height ).setCSS(
			"background-image", "url('" + bgImg + "')" );

		if ( widthSize && heightSize ) {

 			screenBg.setCSS( "background-size", widthSize + "px " + heightSize + "px" );

		}

		// Update bg at start of frame
		requestAnimationFrame( function() {

			screenBg.update();
		
		} );

	};

	ScreenBg.prototype.setBgColor = function setBgColor( bgColor ) {

		this.screenBgId.style[ "background-color" ] = bgColor;

	};

	ScreenBg.prototype.setBgSize = function setBgSize( width, height, duration ) {

		// Note: for animation: use setBGScale instead
			
		if ( duration ) {

			var self = this;
			var previousSize = this.getBgSize();
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

			this.setBgSizeTo( width, height );

		}

		this.screenBgId.update();

		// debug
		// console.log( "set bg size : " + width + "," + height );

	};

	ScreenBg.prototype.getBgSize = function getBgSize() {

		var screenBg = this.screenBgId;
		
		return {
			"width": screenBg.width,
			"height": screenBg.height
		};

	};

	ScreenBg.prototype.setBgSizeTo = function setBgSizeTo( width, height ) {

		this.screenBgId.setSize( width, height )
					.setCSS( "background-size", width + "px " + height + "px" );

	};

	ScreenBg.prototype.setBgScale = function setBgScale( scaleWidth, scaleHeight, duration ) {

		var sprite = this.screenBgId;
		
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

	};

	ScreenBg.prototype.setBgPosition = function setBgPosition( x, y, duration ) {

		var previousPosition = this.getBgPosition();
		var distance = {
			"x": x - previousPosition.x,
			"y": y - previousPosition.y
		};

		var sprite = this.screenBgId;

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

	};

	ScreenBg.prototype.getBgPosition = function getBgPosition() {

		var screenBgId = this.screenBgId;
		var position = {
			"x": screenBgId.x,
			"y": screenBgId.y
		};

		return position;

	};

	ScreenBg.prototype.rotateBg = function rotateBg( axis, angle, speed, loop, sprite ) {

		// Test : Rotate bg
		// vn.rotateBg( "z", 1, 25, true );
		// vn.pause( 5000 );
		// vn.stopRotateBg( 1000 );
		// vn.resetBg( "rotate" );

		this.screenBgId.rotate( axis, angle, speed, loop, sprite );

	};

	ScreenBg.prototype.rotateBgTo = function rotateBgTo( axis, angle, speed, loop, sprite ) {

		// Test : Rotate bg to
		// vn.rotateBgTo( "z", -45, 25 );
		// vn.pause( 2000 );
		// vn.rotateBgTo( "z", 0, 25 );
		// vn.pause( 2000 );
		// vn.resetBg( "rotate" );

		this.screenBgId.rotateTo( axis, angle, speed, loop, sprite );

	};

	ScreenBg.prototype.fadeBg = function fadeBg( type, fadeSpeed ) {

		var sceneObject = this.screenBgId;

		if ( type === "in" ) {
		
			sceneObject.fadeIn( fadeSpeed );
		
		}

		if ( type === "out" ) {
		
			sceneObject.fadeOut( fadeSpeed );
		
		}

	};

	ScreenBg.prototype.resetBg = function resetBg( action ) {

		var screenBg = this.screenBgId;

		if ( action == "rotate" ) {

			// TODO: remove commented code once stopRotateBg is implemented
			// window.clearInterval( screenBg.timer.rotate );

			screenBg.setRotation( 0, 0, 0 ).update();
		
		}

		if ( action == "fade" ) {
			
			screenBg.fadeIn( 0 );
		
		}

	};

} )( window.VisualNovel = window.VisualNovel || {} );