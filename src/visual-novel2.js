/**
 * Function: VisualNovel
 *
 * Create a visual novel instance
 *
 * @param id = novel id reference
 * @param width = width of novel container
 * @param height = height of novel container
 * @param imgPath = path to images folder
 */
function VisualNovel( id, width, height, imgPath ) {

	var vn = null;

	if ( this instanceof VisualNovel ) {

		// id for reference when there are multiple novels
		this.novelId = id;

		// screen
		this.screenWidth = width;
		this.screenHeight = height;

		// path to images
		this.imgPath = imgPath ? imgPath : "";

		vn = this;

		// initialize
		// vn.init( id );

	} else {

		vn = new VisualNovel( id, width, height, imgPath ); 

	}

	return vn;

}

/**
 * Function: init
 *
 * Initialize visualize novel
 * when creating a new VisualNovel instance
 *
 * @param novelId = id of visual novel div
 */
VisualNovel.prototype.init = function init( novelId ) {

	this.initObjects();

	this.initContainers( novelId );

	this.initScreenStart( novelId );

};










/**
 * Function: initObjects
 *
 * Initialize objects used for class
 */
VisualNovel.prototype.initObjects = function initObjects() {

	this.util = new Util();
	this.parser = new Parser();
	this.eventTracker = new EventTracker();
	this.templates = new TemplateFactory();

};










/**
 * Function: initContainers
 *
 * Add the dialog, character, scene and other containers
 * to the visual novel div
 *
 * @param novelId = id of visual novel div
 */
VisualNovel.prototype.initContainers = function initContainers( novelId ) {

	this.initNovelContainer( novelId );

	this.initSceneContainer();
	// this.initDialogMenuContainer();
	// this.initNovelModeContainer();
	// this.initDialogModeContainer();
	// this.initCharacterContainer();
	// this.initBGContainer();

};

/**
 * Function: initNovelContainer
 *
 * Initialize novel container template, size, and references
 *
 * @param novelId = id of visual novel div, and instance reference
 *
 */
VisualNovel.prototype.initNovelContainer = function initNovelContainer( novelId ) {

	this.novelContainerId = document.getElementById( novelId );

	var content = this.buildNovelContainerContent( novelId );
	this.setNovelContainerContent( content );
	this.updateNovelContainerReference( novelId );
	this.setNovelContainerSize( this.screenWidth, this.screenHeight );

};

/**
 * Function: buildNovelContainer
 *
 * Build the html content for the novel container
 *
 * @param novelId = id of visual novel div, and instance reference
 */
VisualNovel.prototype.buildNovelContainerContent = function buildNovelContainerContent( novelId ) {

	var novelContainer = this.templates.get( "novelcontainer" );

	novelContainer = this.parser.parseTemplate( novelContainer, { novelId : novelId } );

	return novelContainer;

};

/**
 * Function: setNovelContainerContent
 *
 * Set the html content of the novel container
 *
 * @param content = content of the novel container
 */
VisualNovel.prototype.setNovelContainerContent = function setNovelContainerContent( content ) {

	this.novelContainerId.innerHTML = content;

};

/**
 * Function: updateNovelContainerReference
 *
 * Update html references to the start screen, dialog, choice menu,
 * character container, scene container, bg container
 *
 * @param novelId = id of visual novel div, and instance reference
 */
VisualNovel.prototype.updateNovelContainerReference = function updateNovelContainerReference( novelId ) {

	var doc = document;

	this.screenStartId = doc.getElementById( novelId + "-screen-start" );
	this.novelModeId = doc.getElementById( novelId + "-dialog-novelmode" );
	this.dialogModeId = doc.getElementById( novelId + "-dialog-dialogmode" );
	this.dialogMenuId = doc.getElementById( novelId + "-dialog-menu" );
	this.screenCharacterId = doc.getElementById( novelId + "-screen-character" );
	this.screenSceneId = doc.getElementById( novelId + "-screen-scene" );
	this.screenBgId = doc.getElementById( novelId + "-screen-bg" );

};

/**
 * Function: setNovelContainerSize
 *
 * Set the size of the main novel container, and the containers inside
 *
 * @param width = new width
 * @param height = new height
 */
VisualNovel.prototype.setNovelContainerSize = function setNovelContainerSize( width, height ) {

	// TODO : may need refactoring

	var novelContainer = this.novelContainerId;
	var containers = novelContainer ? novelContainer.getElementsByClassName( "novel" ) : [];
	var newStyle = ";overflow:hidden;width:" + width +
		"px;height:" + height + "px;";
	
	// novel container
	novelContainer.style.cssText += newStyle;

	// containers ( scene, character, dialog, menu, ... )
	this.util.foreach( containers, function( container ) {

		newStyle = ";width:" + width + "px;height:" + height + "px;";
		container.style.cssText += newStyle;
	
	} );

};

/**
 * Function: initSceneContainer
 *
 * Initialize the container for the scenes
 */
VisualNovel.prototype.initSceneContainer = function initSceneContainer() {

	// TODO : needs refactoring

	var result = this.createSceneContainer( this.screenSceneId, this.sceneFloorWidth, this.sceneFloorHeight );
	
	// Store for reference
	this.sceneContainer = result.floorContainer;
	this.sceneFloor = result.floor;

};

/**
 * Function: createSceneContainer
 *
 * Create the container for the scenes
 *
 * @param element = dom container for scenes
 * @param width = width of container
 * @param height = height of container
 */
VisualNovel.prototype.createSceneContainer = function createSceneContainer( element, width, height ) {

	// build scene container
	var sceneContainer = ObjectFactory( "SpriteContainer", element );
	var stage = sceneContainer.children[ 0 ];

	// build scene floor
	var sceneFloor = ObjectFactory( "SceneFloor", width, height );
	var sceneFloorContainer = ObjectFactory( "SceneFloorContainer" );

	sceneFloorContainer.addChild( sceneFloor.sprite );

	stage.addChild( sceneFloorContainer );

	// Return floor container and floor
	var result = {
		floorContainer : sceneFloorContainer,
		floor : sceneFloor
	};

	return result;

};










/**
 * Function: initScreenStart
 *
 * Initialize the start screen
 *
 * @param novelId = id of novel div
 */
VisualNovel.prototype.initScreenStart = function initScreenStart( novelId ) {

	// var self = this;
	
	// this.buildStartMenu( novelId );
	// this.updateStartMenuReference( novelId );
	// this.showStartScreen( true );

	// this.addStartMenuButtonHandler();

};










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










/***
 * Function: EventTracker
 *
 * Create object for tracking events
 */
function EventTracker() {

	var eventTracker = null;

	if ( this instanceof EventTracker ) {

		// states
		this.doRepeatEvent = false;
		this.eventsInProgress = [ "main" ];
		this.eventList = {
			"main" : []
		};
		this.eventId = {
			"main" : 0
		};

		this.save = {
			eventsInProgress : [],
			eventId : {}
		};

		eventTracker = this;

	} else {

		eventTracker = new EventTracker();

	}

	return eventTracker;

}

/**
 * Function: addEvent
 *
 * Add event to eventList
 *
 * @param type = wait / nowait
 * @param evt = event to perform
 * @param delay = delay before next event
 */
EventTracker.prototype.addEvent = function addEvent( type, evt, delay ) {

	var eventsInProgress = this.eventsInProgress;
	var currentEvent = eventsInProgress[ eventsInProgress.length - 1 ];

	this.eventList[ currentEvent ].push(
		{
			"type" : type,
			"event" : evt,
			"delay" : delay ? delay : 0
		}
	);

};

/**
 * Function: addNewEventInProgress
 *
 * Add new type of event in list of events that are in progress
 * eventsInProgress = events in progress
 * eventList = stores the events of each event in progress
 *
 * @param eventName = new event to add in eventList, eventsInProgress, & eventId
 */
EventTracker.prototype.addNewEventInProgress = function addNewEventInProgress( eventName ) {

	// store in events in progress
	this.eventsInProgress.push( eventName );

	// create new list for events
	this.eventList[ eventName ] = [];

	// create new event id
	this.eventId[ eventName ] = 0;

};

/**
 * Function: startEvent
 *
 * Perform event in eventList of current event in progress
 * then perform next event if event type = 'nowait'
 */
EventTracker.prototype.startEvent = function startEvent() {

	var self = this;

	// TODO: implement deferred w/o jquery
	var deferred = $.Deferred();

	// Get event
	var eventsInProgress = this.eventsInProgress;
	var currentEventName = eventsInProgress[ eventsInProgress.length - 1 ];
	var currentEventList = this.eventList[ currentEventName ];
	var currentEventId = this.eventId[ currentEventName ];
	var evt = currentEventList[ currentEventId ];
	var type = evt.type;
	var delay = evt.delay;

	// Debug
	// console.log( "start event: " + currentEventName + " " + currentEventId );
	// console.log( currentEventList );

	// Perform event
	evt.event();

	this.delayCallback( delay, function() {
		deferred.resolve();
	} );

	// Event types: wait / nowait
	// Perform the next event if type:
	//	1. nowait
	deferred.done( function() {

		if ( type == "nowait" ) {
			self.nextEvent( );
		}

	} );

};

/**
 * Function: nextEvent
 *
 * Perform next event in eventList of
 * events in progress
 */
EventTracker.prototype.nextEvent = function nextEvent( ) {

	var eventsInProgress = this.eventsInProgress;
	var totalEventsInProgress = eventsInProgress.length;
	var currentEvent = eventsInProgress[ totalEventsInProgress - 1 ];
	var evtList = this.eventList[ currentEvent ];
	var eventId = this.eventId;
	eventId[ currentEvent ] += 1;
	var currentEventId = eventId[ currentEvent ];
	
	if ( currentEventId < evtList.length ) {

		this.startEvent( );

	} else {
		
		// Debug
		// console.log( "no more events for: " + currentEvent );

		if ( totalEventsInProgress == 1 ) {

			// Return to main menu
			// this.resetToMainMenu();

			// Changed so user has to reset manually... not sure if good...

		} else {

			// end current event
			eventsInProgress.pop();

			if ( this.doRepeatEvent ) {

				// repeat previous event
				this.doRepeatEvent = false;

				this.startEvent();

			} else {

				// continue from previous event
				this.nextEvent();

			}

		}

	}

};

/**
 * Function: resetEventsInProgress
 *
 * Reset eventsInProgress and eventId
 * eventList is not cleared since the events only get added on page load
 */
EventTracker.prototype.resetEventsInProgress = function resetEventsInProgress() {

	this.eventsInProgress = [ "main" ];
	this.eventId = { "main" : 0	};

};

/**
 * Function: delayCallback
 *
 * Delay the execution of the callback
 *
 * @param delay
 * @param callback
 */
EventTracker.prototype.delayCallback = function delayCallback( delay, callback ) {

	if ( delay ) {

		setTimeout( function() {
			callback();
		}, delay );

	} else {

		callback();

	}

};










/**
 * Function: TemplateFactory
 *
 */
function TemplateFactory() {

	var template = null;

	if ( this instanceof TemplateFactory ) {

		this.templates = {};

		template = this;

		template.init();

	} else {

		template = new TemplateFactory();

	}

	return template;

}

/**
 * Function: init
 *
 * Initialize templates
 */
TemplateFactory.prototype.init = function init() {

	this.templates = {

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
		],
		'startmenu' : [
			"<div id='{novelId}-novelTitleContainer' class='novelTitleContainer'>",
				"<div id='{novelId}-novelTitleText' class='novelTitleText'>{novelTitle}</div>",
				"<div id='{novelId}-novelSubtitleText' class='novelSubtitleText'>{novelSubtitle}</div>",
			"</div>",
			"<div id='{novelId}-startMenuButtonContainer' class='startMenuButtonContainer'>",
				"<button id='{novelId}-startMenuButton' class='startMenuButton' >",
				"START</button>",
			"</div>"
		],
		'say' : [
			"<if={showDialogImage}><img id='{novelId}-dialog-dialogImage' src='{dialogImage}' style='{dialogImageStyle}' /></if>",
			"<div id='{novelId}-dialog-dialogName' class='dialogName'>{name}</div>",
			"<div id='{novelId}-dialog-dialogText' class='dialogText'>{dialogLine}</div>",
			"<if={showButtonText}><button id='{novelId}-dialog-dialogButton' class='dialogButton'>{dialogButtonText}</button></if>",
			"<if={showButtonImage}><img id='{novelId}-dialog-dialogButton' class='dialogButton' src='{dialogButtonImage}' style='{dialogButtonImageStyle}' /></if>"
		],
		'userinput' : [
			"<div id='userInputContainer' class='userInputContainer'>",
				"<div id='userInputMessage' class='userInputMessage'>{message}</div><hr/><br/>",
				"<input id='{novelId}-userInputText' class='userInputText' type='text' /><br/><br/>",
				"<input type='button' id='{novelId}-userInputButton' class='userInputButton' value='OK' />",
			"</div>"
		],

		// For choice menu:
		// 1. build choice buttons
		// 2. build choice image
		// 3. insert buttons and image to menu container
		'menuchoice' : [
			"<div id='{novelId}-dialogMenuChoiceContainer' class='dialogMenuChoiceContainer'>",
				"<div id='{novelId}-dialogMenuChoiceButtonsContainer' class='dialogMenuChoiceButtonsContainer'>",
					"<foreach={choice in choices}>",
						"<button class='dialogMenuChoiceButton' id='{novelId}-dialogMenuChoiceButton{index}' >",
							"{choice.label}",
						"</button><br/>",
					"</foreach>",
				"</div>",
				"<div id='{novelId}-dialogMenuChoiceImageContainer' class='dialogMenuChoiceImageContainer'>",
					"<if={imgPath}><img src='{imgPath}' style='width:{imgWidth}px;height:{imgHeight}px;' /></if>",
				"</div>",
			"</div>"
		]

	};

};

/**
 * Function: get
 *
 * Get a template
 *
 * @param name
 */
TemplateFactory.prototype.get = function get( name ) {

	var templates = this.templates;
	var template = templates[ name ] ? templates[ name ].join( '' ) : '';

	return template;

};

/**
 * Function: set
 *
 * Store a template
 *
 * @param name
 * @param template
 */
TemplateFactory.prototype.set = function set( name, template ) {

	this.templates[ name ] = template;

	return this;

};










/**
 * Function: Sprite
 *
 * Constructor for creating a sprite
 *
 * States :
 *		1. sprite
 * Behaviors :
 *		1. Move
 *		2. Rotate
 *		3. Fade
 *
 * @param width = width of sprite
 * @param height = height of sprite
 * @parram position = x, y, z position of sprite
 * @param transformOrigin = position of css transform
 * @param rotate = rotation angles along x, y, z axis
 **/
function Sprite( width, height, position, transformOrigin, rotate ) {

	if ( this instanceof Sprite ) {

		// Add states
		this.sprite = null;

		this.init( width, height, position, transformOrigin, rotate );

		return this;

	} else {

		return new Sprite( width, height, position, transformOrigin, rotate );

	}

}

/**
 * Function: init
 *
 * Initialize sprite using Sprite3D JS library
 *
 * @param width = width of sprite
 * @param height = height of sprite
 * @parram position = x, y, z position of sprite
 * @param transformOrigin = position of css transform
 * @param rotate = rotation angles along x, y, z axis
 */
Sprite.prototype.init = function init( width, height, position, transformOrigin, rotate ) {

	var s = this.createSprite( width, height, position, transformOrigin, rotate );

	this.sprite = s;

};

/**
 * Function: createSprite
 *
 * Return a Sprite3D instance
 * Uses Sprite3D JS library
 *
 * @param width = width of sprite
 * @param height = height of sprite
 * @parram position = x, y, z position of sprite
 * @param transformOrigin = position of css transform
 * @param rotate = rotation angles along x, y, z axis
 */
Sprite.prototype.createSprite = function createSprite( width, height, position, transformOrigin, rotate ) {

	var pos = position;
	var transOrigx = transformOrigin.x;
	var transOrigy = transformOrigin.y;
	var transOrigz = transformOrigin.z;
	
	var s = new Sprite3D()
		.setClassName( "sprite" )
		.setSize( width, height )
		.setTransformOrigin( transOrigx, transOrigy, transOrigz )
		.setPosition( pos.x, pos.y, pos.z )
		.rotateX( rotate && rotate.x ? rotate.x : 0 )
		.rotateY( rotate && rotate.y ? rotate.y : 0 )
		.rotateZ( rotate && rotate.z ? rotate.z : 0 )
		.setRotateFirst( true );

	s.setCSS( "-webkit-transform-origin", 
		transOrigx + "px " + transOrigy + "px" ).update();

	s.timer = {};

	return s;

};

/**
 * Function: setBackground
 *
 * Set background image or color of sprite
 *
 * @param width = width of background image
 * @param height = height of background image
 * @param image = path to image
 * @param color = background color
 */
Sprite.prototype.setBackground = function setBackground( width, height, image, color ) {

	var bgSize = width && height ? "background-size:" + width + "px " + height + "px;" : "";
	var bgImage = image ? "background-image:url('" + image + "');" : "";
	var bgColor = color ? "background-color:" + color + ";" : "";
	var preSemicolon = bgSize || bgImage || bgColor ? ";" : "";

	this.sprite.style.cssText += preSemicolon + bgSize + bgImage + bgColor;

};

/**
 * Function: move
 *
 * Move sprite to position x, y, z at speed
 *
 * @param x = x position
 * @param y = y position
 * @param z = z position
 * @param speed = duration of move in milliseconds
 */
Sprite.prototype.move = function move( x, y, z, speed ) {

	// TODO: when moving, update transform origin...
	
	var self = this;
	var sprite = this.sprite;
	var spritex = sprite.x;
	var spritey = sprite.y;
	var spritez = sprite.z;

	// spriteType = character => use y ( up / down )
	//			  = container => use z ( up / down )
	var newPosx = x ? x : spritex;
	var newPosy = y ? y : spritey;
	var newPosz = z ? z : spritez;
		
	if ( sprite.moveStep == null ) {

		// Although could be looped...but may affect performance...
		if ( x ) {

			if ( spritex == newPosx ) {
				var stepx = 0;
			} else {
				var distancex = Math.abs( newPosx - spritex ) / 100;
				var stepx = spritex < newPosx ? distancex : -distancex;
				stepx = Math.round( stepx );
			}

		}

		if ( y ) {

			if ( spritey == newPosy ) {
				var stepy = 0;
			} else {
				var distancey = Math.abs( newPosy - spritey ) / 100;
				var stepy = spritey < newPosy ? distancey : -distancey;
				stepy = Math.round( stepy );
			}
			
		}

		if ( z ) {

			if ( spritez == newPosz ) {
				var stepz = 0;
			} else {
				var distancez = Math.abs( newPosz - spritez ) / 100;
				var stepz = spritez < newPosz ? distancez : -distancez;
				stepz = Math.round( stepz );
			}
			
		}

		sprite.moveStep = {
			x : stepx,
			y : stepy,
			z : stepz
		};

	}

	var moveStep = sprite.moveStep;
	var checkPosX = moveStep.x > 0 ? spritex < newPosx : spritex > newPosx;
	var checkPosY = moveStep.y > 0 ? spritey < newPosy : spritey > newPosy;
	var checkPosZ = moveStep.z > 0 ? spritez < newPosz : spritez > newPosz;

	// Debug
	// console.log( newPos );
	// console.log( distance );
	// console.log( checkPosX + "," + checkPosY + "," + checkPosZ );

	if ( checkPosX || checkPosY || checkPosZ ) {

		sprite.x = x ? spritex + moveStep.x : spritex;
		sprite.y = y ? spritey + moveStep.y : spritey;
		sprite.z = z ? spritez + moveStep.z : spritez;
		
		sprite.update();

		sprite.timer[ "move" ] = setTimeout( function() {

			self.move( x, y, z, speed );

		}, speed ? speed / 100 : 0 );

	} else {

		sprite.moveStep = null;

	}
};

// TODO: moveTo

/**
 * Function: rotate
 *
 * Rotate sprite along axis at the given speed
 *
 * @param axis = axis to rotate sprite
 * @param angle = angle to rotate sprite
 * @param speed = delay between each 1 angle rotation
 * @param loop = set to true to continuously rotate at given angle
 * @param sprite = sprite to rotate ( optional )
 */
Sprite.prototype.rotate = function rotate( axis, angle, speed, loop, sprite ) {
	
	// type : container ( z )
	//		  object ( y )
	//		  floor ( z )

	var spriteToRotate = sprite ? sprite : this.sprite;
	var callRotateSprite = function() {};
	var rotateDelay = speed ? speed : 0;

	if ( axis ) {

		callRotateSprite = function() {
			spriteToRotate[ "rotate" + axis.toUpperCase() ]( angle ).update();
		}

	}

	if ( loop ) {
		
		// Rotate sprite continuously
		spriteToRotate.timer[ "rotate" ] = setInterval( function() {
			
			callRotateSprite();
		
		}, rotateDelay );

	} else {

		// Rotate sprite after delay
		spriteToRotate.timer[ "rotate" ] = setTimeout( function() {

			callRotateSprite();

		}, rotateDelay );
		
	}

};

Sprite.prototype.rotateTo = function rotateTo( axis, angle, speed, sprite ) {
	
	// type : container ( z )
	//		  object ( y )
	//		  floor ( z )

	var self = this;
	var spriteToRotate = sprite ? sprite : this.sprite;
	var rotateAxis = axis.toUpperCase();
	var currentAngle = spriteToRotate[ "rotation" + rotateAxis ];
	
	// Rotate sprite after delay
	if ( currentAngle != angle ) {

		var angleInc = angle >= 0 ? 1 : -1;
		var callRotateSprite = function callRotateSprite() {
			spriteToRotate[ "setRotation" + rotateAxis ](
				currentAngle + angleInc ).update();
		};

		spriteToRotate.timer[ "rotate" ] = setTimeout( function() {

				callRotateSprite();
				self.rotateTo( axis, angle, speed, sprite );

		}, speed ? speed : 0 );

	} else {

		spriteToRotate.timer[ "rotate" ] = null;

	}

};

Sprite.prototype.fade = function fade( startOpacity, endOpacity, step, speed ) {
	
	// Step + => fade in
	// Step - => fade out
	var newOpacity = startOpacity + step;
	var fadeNotDone = step < 0 ? 
		endOpacity <= newOpacity && newOpacity <= startOpacity :
		startOpacity <= newOpacity && newOpacity <= endOpacity;

	if ( fadeNotDone ) {

		var self = this;
		var sprite = this.sprite;

		sprite.setOpacity( newOpacity / 100 );

		sprite.timer[ "fade" ] = setTimeout( function() {

			self.fade( newOpacity, endOpacity, step, speed );

		}, speed / 100 );

	}

};

Sprite.prototype.fadeIn = function fadeIn( speed, from, to ) {
	
	// Step + => fade in
	var startOpacity = from && from > 0 ? from : 0;
	var endOpacity = to && to > 0 ? to : 100;
	
	this.fade( startOpacity, endOpacity, 1, speed );

};

Sprite.prototype.fadeOut = function fadeOut( speed, from, to ) {
	
	// Step + => fade in
	var startOpacity = from && from > 0 ? from : 100;
	var endOpacity = to && to > 0 ? to : 0;
	
	this.fade( startOpacity, endOpacity, -1, speed );

};