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

} )( window.VisualNovel = window.VisualNovel || {} );