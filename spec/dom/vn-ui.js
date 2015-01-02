var novelId = 'test';

// QUnit.test( 'Visual Novel Constructor', function( assert ) {

// 	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );

// 	assert.equal( vn.novelId, novelId, 'novelId set to "test"' );
// 	assert.equal( vn.screenWidth, 800, 'screenWidth set to 800' );
// 	assert.equal( vn.screenHeight, 600, 'screenHeight set to 600' );
// 	assert.equal( vn.imgPath, '../../examples/img/' );

// } );

QUnit.test( 'initObjects', function( assert ) {

	var vn = {};
	VisualNovel.prototype.initObjects.call( vn );

	assert.ok( vn.util instanceof Util, 'util instance of Util' );
	assert.ok( vn.parser instanceof Parser, 'parser instance of Parser' );
	assert.ok( vn.eventTracker instanceof EventTracker, 'eventTracker instance of EventTracker' );
	assert.ok( vn.templates instanceof TemplateFactory, 'templates instanceof TemplateFactory' );

} );

QUnit.test( 'buildNovelContainerContent', function( assert ) {

	var vn = {
		templates : {

			'novelcontainer' : [
				"<div class='novel-container unSelectable'>",
					"<div id='{novelId}-screen-start' class='novel screen-start'></div>",
					"<div id='{novelId}-dialog-menu' class='novel dialog-menu'></div>",
					"<div id='{novelId}-dialog-novelmode' class='novel dialog-novelmode'></div>",
					"<div id='{novelId}-dialog-dialogmode' class='novel dialog-dialogmode'></div>",
					"<div id='{novelId}-screen-character' class='novel screen-character'></div>",
					"<div id='{novelId}-screen-scene' class='novel screen-scene'></div>",
					"<div id='{novelId}-screen-bg' class='novel screen-bg'></div>",
					"<div id='{novelId}-images' style='display:none;'></div>",
				"</div>"
			]
			
		}
	};
	VisualNovel.prototype.initObjects.call( vn );

	var content = VisualNovel.prototype.buildNovelContainerContent.call( vn, novelId );
	var result = [
		"<div class='novel-container unSelectable'>",
			"<div id='test-screen-start' class='novel screen-start'></div>",
			"<div id='test-dialog-menu' class='novel dialog-menu'></div>",
			"<div id='test-dialog-novelmode' class='novel dialog-novelmode'></div>",
			"<div id='test-dialog-dialogmode' class='novel dialog-dialogmode'></div>",
			"<div id='test-screen-character' class='novel screen-character'></div>",
			"<div id='test-screen-scene' class='novel screen-scene'></div>",
			"<div id='test-screen-bg' class='novel screen-bg'></div>",
			"<div id='test-images' style='display:none;'></div>",
		"</div>"
	].join( '' );

	assert.equal( content, result, 'Novel Container content: ' + result );


} );

QUnit.test( 'setNovelContainerContent', function( assert ) {

	var vn = {
		novelContainerId : document.getElementById( novelId )
	};

	VisualNovel.prototype.setNovelContainerContent.call( vn, 'content' );

	assert.equal( vn.novelContainerId.innerHTML, 'content', 'Novel Container content set to "content"' );

} );

QUnit.test( 'updateNovelContainerReference', function( assert ) {

	var vn = {};

	VisualNovel.prototype.updateNovelContainerReference.call( vn, novelId );

	assert.equal( vn.screenStartId, document.getElementById( novelId + '-screen-start' ), 
		'screen start' );
	assert.equal( vn.novelModeId, document.getElementById( novelId + '-dialog-novelmode' ), 
		'novel mode' );
	assert.equal( vn.dialogModeId, document.getElementById( novelId + '-dialog-dialogmode' ), 
		'dialog mode' );
	assert.equal( vn.dialogMenuId, document.getElementById( novelId + '-dialog-menu' ), 
		'dialog menu' );
	assert.equal( vn.screenCharacterId, document.getElementById( novelId + '-screen-character' ), 
		'screen character' );
	assert.equal( vn.screenSceneId, document.getElementById( novelId + '-screen-scene' ), 
		'screen scene' );
	assert.equal( vn.screenBgId, document.getElementById( novelId + '-screen-bg' ), 
		'screen background' );

} );

QUnit.test( 'setNovelContainerSize', function( assert ) {

	var w = 400;
	var h = 300;
	var vn = {
		novelContainerId : document.getElementById( novelId )
	};

	VisualNovel.prototype.initObjects.call( vn );
	VisualNovel.prototype.updateNovelContainerReference.call( vn, novelId );
	VisualNovel.prototype.setNovelContainerSize.call( vn, w, h );

	var newStyle = "overflow-x: hidden; overflow-y: hidden; width: " + w +
		"px; height: " + h + "px;";

	var containers = [ 'novelContainerId', 'screenStartId', 'novelModeId', 'dialogModeId',
		'dialogMenuId', 'screenCharacterId', 'screenSceneId', 'screenBgId' ];
	var containerId = '';

	for ( var len = containers.length, i = len; i--; ) {

		containerId = containers[ i ];
		assert.equal( vn[ containerId ].offsetWidth, w, containerId + 'width set to ' + w );
		assert.equal( vn[ containerId ].offsetHeight, h, containerId + 'height set to ' + h );

	}


} );