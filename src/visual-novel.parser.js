/**
 * Function: Parser
 *
 * Parser : parsing templates
 * Extends Util
 */
function Parser() {

	var parser = null;

	if ( this instanceof Parser ) {

		Util.apply( this, arguments );

		parser = this;

	} else {

		parser = new Parser();

	}

	return parser;

}

// Create a Parser.prototype object that inherits from Util.prototype
Parser.prototype = Object.create( Util.prototype );

// Set the "constructor" property to refer to Parser
Parser.prototype.constructor = Parser;

/**
 * Function: parseTemplate
 *
 * Parse conditions and loops in template,
 * and replace variables in template
 *
 * @param template
 * @param valuesToReplace
 */
Parser.prototype.parseTemplate = function parseTemplate( template, valuesToReplace ) {

	// Parse conditions first before parsing variables
	template = this.parseConditionsInTemplate( template, valuesToReplace );

	// Parse variables in template
	template = this.replaceVariablesInText( template, valuesToReplace );

	// Parse for each loops
	template = this.parseLoopsInTemplate( template, valuesToReplace );

	return template;

};

/**
 * Function: parseConditionsInTemplate
 *
 * template : '<if={delay}><button>OK</button></if>'
 * valuesToReplace : { delay : true }
 *
 * @param template = array of strings
 * @param valuesToReplace = object of values to replace in template
 */
Parser.prototype.parseConditionsInTemplate = function parseConditionsInTemplate( template, valuesToReplace ) {

	// TODO: refactor...
	
	var parsedTemplate = template.slice();
	var conditions = [];
	var tempConditions = parsedTemplate.split( /(<\s*if\s*[^>]*>(.|\n)*?<\s*\/\s*if>)/i );
	
	// trim "" and ">" returned by the split...expression may need refactoring
	this.foreach( tempConditions, function( condition ) {
		
		if ( condition !== "" && condition !== ">" ) {
			conditions.unshift( condition );
		}

	} );

	if ( conditions.length > 1 ) {

		// there may be multiple conditions, so parse each condition
		this.foreach( conditions, function( condition, conditionIndex ) {

			var conditionVariable = condition.replace( /<if={(.*)}>.*<\/if>/i, "$1" );
			var conditionVariableValue = valuesToReplace[ conditionVariable ];
			var conditionContentFormat = conditionVariableValue === undefined ?
				conditionVariable :
				conditionVariableValue ? condition.replace( /<if={.*}>(.*)<\/if>/i, "$1" ) : "";

			conditions[ conditionIndex ] = conditionContentFormat.slice();

		}, this );

	}

	parsedTemplate = conditions.join( "" );

	return parsedTemplate;

};

/**
 * Function: parseLoopsInTemplate
 *
 * template : <foreach={choice in choices}><button>{choice.label}</button></foreach>
 * valuesToReplace : { choices : [ { label:'new' }, {label:'continue'}, {label:'exit'} ] }
 *
 * @param template
 * @param valuesToReplace
 */
Parser.prototype.parseLoopsInTemplate = function parseLoopsInTemplate( template, valuesToReplace ) {

	// TODO : refactor...

	var parsedTemplate = template.slice();
	var loops = parsedTemplate.match( /<foreach={.*}>.*<\/foreach>/gi );

	if ( loops && loops.length > 0 ) {

		var parsedLoops = [];
		
		// there may be multiple loops, so parse each loop
		this.foreach( loops, function( loop, loopIndex ) {

			var parsedLoop = [];

			var loopContentFormat = loop.replace( /<foreach={.*}>(.*)<\/foreach>/gi, "$1" );
			var loopForeachVariables = loop.replace( /<foreach={(.*)}>.*<\/foreach>/gi, "$1" );
			loopForeachVariables = loopForeachVariables.split( " " );
			// choice in choices
			var forEachList = loopForeachVariables[ 2 ];
			var forEachVariable = loopForeachVariables[ 0 ];

			// build each loop content
			this.foreach( valuesToReplace[ forEachList ], function( eachObject, eachIndex ) {

				var loopContent = loopContentFormat.replace( /{index}/gi, eachIndex );
				var eachVariableExp = new RegExp( "{" + forEachVariable + ".(.*)}", "gi" );
				loopContent = loopContent.replace( eachVariableExp, "{$1}" );
				loopContent = this.replaceVariablesInText( loopContent, eachObject );

				parsedLoop.unshift( loopContent );
			
			}, this );

			// store parsed loop content
			parsedLoops.push( parsedLoop.join( "" ) );	

		}, this );

		// replace each loop in template with parsed loop content
		this.foreach( parsedLoops, function( parsedLoop ) {

			parsedTemplate = parsedTemplate.replace( /<foreach={.*}>.*<\/foreach>/i, parsedLoop );

		} );

	}

	return parsedTemplate;

};