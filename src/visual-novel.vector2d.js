// Create unit vector for v1 and v2

function vector2D( v1, v2, param1, param2 ) {

	var v1prop1 = v1[ param1 ];
	var v1prop2 = v1[ param2 ];
	var v2prop1 = v2[ param1 ];
	var v2prop2 = v2[ param2 ];
	var ptDiffx = Math.abs( v2prop1 - v1prop1 );
	var ptDiffy = Math.abs( v2prop2 - v1prop2 );
	var signDiffx = v1prop1 < v2prop1 ? 1 : -1;
	var signDiffy = v1prop2 < v2prop2 ? 1 : -1;

	var maxPtDiff = ptDiffy;
	var maxPtDiffAxis = param2.slice();
	var x = signDiffx * ( ptDiffx / ptDiffy );
	var y = signDiffy;

	if ( ptDiffx > ptDiffy ) {

		maxPtDiff = ptDiffx;
		maxPtDiffAxis = param1.slice();
		x = signDiffx;
		y = signDiffy * ( ptDiffy / ptDiffx );

	}

	var unitVector = {
		"axis" : maxPtDiffAxis,
		"maxDifference" : maxPtDiff
	};

	unitVector[ param1 ] = x;
	unitVector[ param2 ] = y;

	return unitVector;

}