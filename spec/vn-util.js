describe( 'Util class', function() {

	// var vn = new VisualNovel( 'test', 800, 600, 'img/' );
	var util = Util();

	it( 'getObjectInList', function() {

		// getObjectInList
		var obj = { name : 'test' };
		expect( util.getObjectInList( [ obj ], 'name', 'test' ) ).toEqual( 
			{ id : 0, obj : obj }
		);

	} );

	it( 'scalePosition', function() {

		// scalePosition
		var pos = { x : 0.5, y : 0.5, z : 0.5 };
		var pos2 = { x : 400, y : 300, z : 250 };
		var range = { x : 800, y : 600, z : 500 };
		expect( util.scalePosition( pos, range ) ).toEqual( pos2 );
		expect( util.scalePosition( pos2, range ) ).toEqual( pos2 );

	} );

	it( 'foreach', function() {

		// foreach
		var list = [ '' ];
		util.foreach( list, function( val, i ) { list[ i ] = 'hello ' + i; } );
		expect( list[ 0 ] ).toEqual( 'hello 0' );

	} );

	it( 'replaceVariablesInText', function() {

		// replaceVariablesInText
		var text = 'hello {name}';
		var values = { name : 'world' };
		expect( util.replaceVariablesInText( text, values ) ).toEqual( 'hello world' );

	} );

	it( 'isArray', function() {

		// isArray
		expect( util.isArray( [] ) ).toEqual( true );

	} );

} );