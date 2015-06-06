/**
 * Function: Util
 *
 * Utility ( General purpose ) functions
 */
function Util() {

	var util = null;

	if ( this instanceof Util ) {

		util = this;

	} else {

		util = new Util();

	}

	return util;

}

/**
 * Function: getObjectInList
 *
 * Get the object in the list where the key and value matches
 * Return {
 *     id : index of object in list
 *     obj : object found	
 * }
 *
 * @param list = list of objects
 * @param key = object key
 * @value = value of object key
 */
Util.prototype.getObjectInList = function getObjectInList( list, key, value ) {

	var objectFound = {
		id : null,
		obj : null
	};
	var objects = list ? list : [];

	for ( var i = objects.length; i--; ) {

		if ( objects[ i ][ key ] == value ) {

			objectFound = {
				id : i,
				obj : objects[ i ]
			};

		}

	}

	return objectFound;

};

/**
 * Function: scalePosition
 *
 * Returns the scaled position based on the range
 * e.g. 0.5 of 800 = 400
 *
 * @param position
 * @param range
 */
Util.prototype.scalePosition = function scalePosition( position, range ) {

	var posx = position.x;
	var posy = position.y;
	var posz = position.z;
	var pos = {
		x : posx > 1 || posx < -1 ? posx : posx * range.x,
		y : posy > 1 || posy < -1 ? posy : posy * range.y,
		z : posz > 1 || posz < -1 ? posz : posz * range.z
	};

	return pos;

};

/**
 * Function: foreach
 *
 * Loop list and perform callback in each item in list
 *
 * @param list
 * @param callback
 * @param context
 */
Util.prototype.foreach = function foreach( list, callback, context ) {

	for( var i = list.length; i--; ) {

		if ( context ) {

			callback.call( context, list[ i ], i );

		} else {

			callback( list[ i ], i );

		}

	}

};

/**
 * Function: replaceVariablesInText
 *
 * Replace the variables in the string with the passed values
 *
 * text : "My name is {name}..."
 * valuesToReplace : { name : "elizabeth" }
 *
 * @param text
 * @param valuesToReplace = object containing keys that will be replaced in text
 */
Util.prototype.replaceVariablesInText = function replaceVariablesInText( text, valuesToReplace ) {

	var processedText = text + "";
	var key = "";
	var newText = "";
	var exp = null;

	// for in...seems fine to use for objects except arrays!
	for ( key in valuesToReplace ) {

		newText = valuesToReplace[ key ];
		exp = new RegExp( "{" + key + "}", "gi" );
		processedText = processedText.replace( exp, newText );

	}
	
	return processedText;

};

/**
 * Function: isArray
 *
 * Check if passed object is an array
 *
 * @param obj
 */
Util.prototype.isArray = function isArray( obj ) {

	return Object.prototype.toString.call( obj ) === "[object Array]";

};