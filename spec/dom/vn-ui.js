var novelId = 'test';

QUnit.test( 'Visual Novel Constructor', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );

	assert.equal( vn.novelId, novelId, 'novelId set to "test"' );
	assert.equal( vn.screenWidth, 800, 'screenWidth set to 800' );
	assert.equal( vn.screenHeight, 600, 'screenHeight set to 600' );
	assert.equal( vn.imgPath, '../../examples/img/' );

} );

QUnit.test( 'Visual Novel init', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );

	var initNovelContainerCalled = false;
	vn.initNovelContainer = function() {
		initNovelContainerCalled = true;
	};

	var initModulesCalled = false;
	vn.initModules = function() {
		initModulesCalled = true;
	};

	vn.init();

	assert.equal( typeof vn.init === 'function', true, 'Instance has init method' );
	assert.equal( initNovelContainerCalled, true, 'initNovelContainer called' );
	assert.equal( initModulesCalled, true, 'initModules called' );

});

QUnit.test( 'Visual Novel reset', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );

	var eventType = '';
	var eventCallback = null;
	vn.createEvent = function( type, callback ) {
		eventType = type;
		eventCallback = callback;
	};

	// pollyfill bind
	Function.prototype.bind = function( context ) {
		var self = this;
		return function() {
			var args = Array.prototype.slice.call( arguments, 1 );
			self.apply( context, args );
		};
	};

	vn.reset();

	assert.equal( eventType, 'wait', 'wait event added' );
	assert.equal( typeof eventCallback === 'function', true, 'event callback set' );

});