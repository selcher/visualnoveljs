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

} )( window.VisualNovel = window.VisualNovel || {} );