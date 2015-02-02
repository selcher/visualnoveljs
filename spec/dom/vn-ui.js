var novelId = 'test';

QUnit.test( 'Visual Novel Constructor', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );

	assert.equal( vn.novelId, novelId, 'novelId set to "test"' );
	assert.equal( vn.screenWidth, 800, 'screenWidth set to 800' );
	assert.equal( vn.screenHeight, 600, 'screenHeight set to 600' );
	assert.equal( vn.imgPath, '../../examples/img/' );

} );

QUnit.test( 'initObjects', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );
	
	vn.initObjects();

	assert.ok( vn.util instanceof Util, 'util instance of Util' );
	assert.ok( vn.parser instanceof Parser, 'parser instance of Parser' );
	assert.ok( vn.eventTracker instanceof EventTracker, 'eventTracker instance of EventTracker' );
	assert.ok( vn.templates instanceof TemplateFactory, 'templates instanceof TemplateFactory' );

} );

QUnit.test( 'initContainers', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );
	var initNovelContainer = false;
	var initSceneContainer = false;
	var initDialogMenuContainer = false;
	var initNovelModeContainer = false;
	var initDialogModeContainer = false;
	var initCharacterContainer = false;
	var initBGContainer = false;

	vn.initNovelContainer = function( id ) {
		initNovelContainer = id ? true : false;
	};
	vn.initSceneContainer = function() {
		initSceneContainer = true;
	};
	vn.initDialogMenuContainer = function() {
		initDialogMenuContainer = true;
	};
	vn.initNovelModeContainer = function() {
		initNovelModeContainer = true;
	};
	vn.initDialogModeContainer = function() {
		initDialogModeContainer = true;
	};
	vn.initCharacterContainer = function() {
		initCharacterContainer = true;
	};
	vn.initBGContainer = function() {
		initBGContainer = true;
	};
	vn.initContainers( novelId );

	assert.ok( initNovelContainer, 'initNovelContainer called' );
	assert.ok( initSceneContainer, 'initSceneContainer called' );
	assert.ok( initDialogMenuContainer, 'initDialogMenuContainer called' );
	assert.ok( initNovelModeContainer, 'initNovelModeContainer called' );
	assert.ok( initDialogModeContainer, 'initDialogModeContainer called' );
	assert.ok( initCharacterContainer, 'initCharacterContainer called' );
	assert.ok( initBGContainer, 'initBGContainer called' );

} );

QUnit.test( 'resetNovel', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );

	vn.initObjects();
	vn.resetNovel();

	assert.deepEqual( vn.eventTracker.eventsInProgress, [ 'main' ], 'events in progress reset' );
	assert.ok( vn.eventTracker.eventId.main === 0, 'event id set to 0 for main event' );
	assert.deepEqual( vn.menuChoices, {}, 'menu choices reset' );
	assert.deepEqual( vn.menuChoicesTaken, {}, 'menu choices taken reset' );
	assert.ok( vn.characters.length === 0, 'characters reset' );
	assert.ok( vn.scenes.text.length === 0, 'texts on scene reset' );
	assert.ok( vn.scenes.object.length === 0, 'objects on scene reset' );

} );

QUnit.test( 'setNovelTitle', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );
	vn.novelTitleTextId = { "innerHTML": ""	};
	vn.novelSubtitleTextId = { "innerHTML": "" };

	vn.setNovelTitle( 'Hello world', 'visual novel' );

	assert.deepEqual( vn.novelTitle, 'Hello world', 'novel title set' );
	assert.deepEqual( vn.novelSubtitle, 'visual novel', 'novel subtitle set' );
	assert.deepEqual( vn.novelTitleTextId.innerHTML, 'Hello world', 'novel title html set' );
	assert.deepEqual( vn.novelSubtitleTextId.innerHTML, 'visual novel', 'novel subtitle html set' );

} );

QUnit.test( 'buildNovelContainerContent', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );
	vn.initObjects();

	var content = vn.buildNovelContainerContent( novelId );

	var result = [
		"<div class='novel-container unSelectable'>",
			"<div id='test-screen-start' class='novel screen-start'></div>",
			"<div id='test-dialog-menu' class='novel dialog-menu'></div>",
			"<div id='test-dialog-novelmode' class='novel dialog-novelmode'></div>",
			"<div id='test-dialog-dialogmode' class='novel dialog-dialogmode'></div>",
			"<div id='test-screen-character' class='novel screen-character'></div>",
			"<div id='test-screen-scene' class='novel screen-scene'></div>",
			"<div id='test-screen-bg' class='novel screen-bg'></div>",
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