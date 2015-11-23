var novelId = 'test';

QUnit.test( 'Visual Novel Constructor', function( assert ) {

	var vn = new VisualNovel( novelId, 800, 600, '../../examples/img/' );

	assert.equal( vn.novelId, novelId, 'novelId set to "test"' );
	assert.equal( vn.screenWidth, 800, 'screenWidth set to 800' );
	assert.equal( vn.screenHeight, 600, 'screenHeight set to 600' );
	assert.equal( vn.imgPath, '../../examples/img/' );

} );