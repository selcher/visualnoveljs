describe( 'Sprite class', function() {

	var w = 100;
	var h = 300;
	var pos = {
		x : 0,
		y : 0,
		z : 0
	};
	var transOrigin = {
		x : 0,
		y : 0,
		z : 0
	};
	var rotate = {
		x : 0,
		y : 0,
		z : 0
	};

	it( 'init', function() {

		var sprite = {
			createSprite : Sprite.prototype.createSprite
		};

		Sprite.prototype.init.call( sprite, w, h, pos, transOrigin, rotate );

		expect( sprite.sprite instanceof Sprite3D ).toEqual( true );

	} );

	it( 'createSprite', function() {

		var sprite = {};

		sprite = Sprite.prototype.createSprite.call( sprite, w, h, pos, transOrigin, rotate );

		expect( sprite instanceof Sprite3D ).toEqual( true );
		expect( sprite.getClassName() ).toEqual( 'sprite' );
		expect( sprite.width ).toEqual( w );
		expect( sprite.height ).toEqual( h );
		expect( sprite.x ).toEqual( pos.x );
		expect( sprite.y ).toEqual( pos.y );
		expect( sprite.z ).toEqual( pos.z );

		expect( sprite.timer ).toEqual( {} );

	} );

	it( 'setBackground', function() {

		var sprite = {
			sprite : {
				style : {
					cssText : ''
				}
			}
		};

		Sprite.prototype.setBackground.call( sprite, w, h, 'img/test.jpg', 'white' );

		expect( sprite.sprite.style.cssText ).toEqual(
			";background-size:100px 300px;background-image:url('img/test.jpg');background-color:white;"
		);

	} );

	it( 'move', function() {

		var sprite = {};

		sprite = Sprite.prototype.createSprite.call( sprite, w, h, pos, transOrigin, rotate );

		expect( sprite.x ).toEqual( pos.x );
		expect( sprite.y ).toEqual( pos.y );
		expect( sprite.z ).toEqual( pos.z );

		sprite.move( 1, 2, 3, 0 );

		expect( sprite.x ).toEqual( 1 );
		expect( sprite.y ).toEqual( 2 );
		expect( sprite.z ).toEqual( 3 );

	} );

	it( 'rotate', function( done ) {

		var sprite = {};

		sprite = Sprite.prototype.createSprite.call( sprite, w, h, pos, transOrigin, rotate );

		expect( sprite.rotationX ).toEqual( rotate.x );
		expect( sprite.rotationY ).toEqual( rotate.y );
		expect( sprite.rotationZ ).toEqual( rotate.z );

		Sprite.prototype.rotate.call( sprite, 'x', 45, 0, false, sprite );
		Sprite.prototype.rotate.call( sprite, 'y', 45, 0, false, sprite );
		Sprite.prototype.rotate.call( sprite, 'z', 45, 0, false, sprite );

		setTimeout( function() {
			done();
		}, 0 );

		setTimeout( function() {
			expect( sprite.rotationX ).toEqual( 45 );
			expect( sprite.rotationY ).toEqual( 45 );
			expect( sprite.rotationZ ).toEqual( 45 );
		}, 0 );
		
	} );

} );