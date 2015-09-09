( function( VN ) {

	/**
	 * Function: createSceneContainer
	 *
	 * Create the container for the scenes
	 *
	 * @param element = dom container for scenes
	 * @param width = width of container
	 * @param height = height of container
	 */
	VN.prototype.createSceneContainer = function createSceneContainer( element, width, height ) {

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
			"floorContainer": sceneFloorContainer,
			"floor": sceneFloor
		};

		return result;

	};

	VN.prototype.rotateScene = function rotateScene( axis, angle, speed, loop ) {

		var self = this;

		function eventToAdd() {
			
			self.sceneFloor.rotate( axis, angle, speed, loop );
		
		}

		this.eventTracker.addEvent( "nowait", eventToAdd );
	};

	VN.prototype.moveScene = function moveScene( x, y, z, speed ) {

		var self = this;

		function eventToAdd() {
			
			self.sceneFloor.move( x, y, z, speed );
		
		}

		this.eventTracker.addEvent( "nowait", eventToAdd );
	};


	/**
	 * Attach module to namespace
	 */
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {

				this.screenSceneId = document.getElementById( this.novelId + "-screen-scene" );

				var result = this.createSceneContainer( this.screenSceneId, this.sceneFloorWidth, this.sceneFloorHeight );
				
				// Store for reference
				this.sceneContainer = result.floorContainer;
				this.sceneFloor = result.floor;

			},
			"reset": function reset() {

				var scenes = this.sceneContainer ? this.sceneContainer.children : [];
				var totalScenes = scenes.length;

				if ( totalScenes > 1 ) {
					
					for( var i = totalScenes - 1; i--; ) {
						
						// Don't include 0 since it is the scene floor
						this.sceneContainer.removeChildAt( i + 1 );

					}

				}
				
			}
		}
	);

} )( window.VisualNovel = window.VisualNovel || {} );