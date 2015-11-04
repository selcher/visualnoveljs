( function( VN ) {
	
	/**
	 * Function: initScreenStart
	 *
	 * Initialize the start screen
	 *
	 * @param novelId = id of the novel div, and instance reference
	 */
	VN.prototype.initScreenStart = function initScreenStart( novelId ) {

		var self = this;
		var screenStart = this.screenStart = new ScreenStart( novelId );

		var template = this.parser.parseTemplate(
				"<div id='{novelId}-screen-start' class='novel start-menu' " +
				"style='width:{width}px;height:{height}px;'></div>",
				{
					"novelId": novelId,
					"width": this.screenWidth,
					"height": this.screenHeight
				}
			);

		this.screenStart.screenStartId = this.attachToNovelContainer( template );

		this.buildStartMenu( novelId );

		this.screenStart.updateStartMenuReference();
		this.screenStart.showStartScreen( true );

		this.screenStart.addStartMenuButtonHandler( function() {
			self.startNovel();
		} );

	};

	/**
	 * Function: startNovel
	 *
	 * Hide the start screen, and start the added events in the novel
	 */
	VN.prototype.startNovel = function startNovel() {

		this.screenStart.showStartScreen( false );
		
		this.eventTracker.startEvent();

	};

	/**
	 * Variable: startMenuTemplate
	 *
	 * Template for start menu.
	 *
	 * TODO: extend start menu with other options
	 */
	VN.prototype.startMenuTemplate = [
		"<div id='{novelId}-startMenuTitleContainer' class='startMenuTitleContainer'>",
			"<div id='{novelId}-startMenuTitleText' class='startMenuTitleText'>{novelTitle}</div>",
			"<div id='{novelId}-startMenuSubtitleText' class='startMenuSubtitleText'>{novelSubtitle}</div>",
		"</div>",
		"<div id='{novelId}-startMenuButtonContainer' class='startMenuButtonContainer'>",
			"<button id='{novelId}-startMenuButton' class='startMenuButton' >",
			"START</button>",
		"</div>"
	].join( "" );

	/**
	 * Function: buildStartMenu
	 *
	 * Build the html for the start menu
	 *
	 * @param novelId = id of the novel div, and instance reference
	 */
	VN.prototype.buildStartMenu = function builStartMenu( novelId ) {

		var screenStart = this.screenStart;
		var parseVariables = {
			"novelId": novelId,
			"novelTitle": screenStart.novelTitle,
			"novelSubtitle": screenStart.novelSubtitle
		};

		var startMenuTemplate = "";

		if ( this.parser ) {

			startMenuTemplate = this.parser.parseTemplate( this.startMenuTemplate, parseVariables );

		} else {

			this.log( "[start]VisualNovelJS Error: parser module not found" );

		}

		screenStart.setContent( startMenuTemplate );

	};

	/**
	 * Function: showStartScreen
	 *
	 * Show screen for start menu.
	 *
	 * @param show = true / false
	 */
	VN.prototype.showStartScreen = function showStartScreen( show ) {

		this.screenStart.showStartScreen( show );

	};

	/**
	 * Function: setStartScreenBgImage
	 *
	 * Set the background image of the start screen.
	 *
	 * @param imgPath = path of background image
	 * @param width = width of image
	 * @param height = height of image
	 */
	VN.prototype.setStartScreenBgImage = function setStartScreenBgImage( imgPath, width, height ) {

		this.screenStart.setStartScreenBgImage( this.imgPath + imgPath, width, height );

	};

	/**
	 * Function: setStartScreenBgColor
	 *
	 * Set the background color of the start screen.
	 *
	 * @param color = new background color of start screen
	 */
	VN.prototype.setStartScreenBgColor = function setStartScreenBgColor( color ) {

		this.screenStart.setStartScreenBgColor( color );

	};

	/**
	 * Function: setStartScreenMenuBgImage
	 *
	 * Set the background image of the start menu.
	 *
	 * @param imgPath = path of the background image
	 * @param width = width of image
	 * @param height = height of image
	 */
	VN.prototype.setStartScreenMenuBgImage = function setStartScreenMenuBgImage( imgPath, width, height ) {

		this.screenStart.setStartScreenBgImage( this.imgPath + imgPath, width, height );

	};

	/**
	 * Function: setStartScreenMenuBgColor
	 *
	 * Set the background color of the start menu.
	 *
	 * @param color = new background color of the start menu
	 */
	VN.prototype.setStartScreenMenuBgColor = function setStartScreenMenuBgColor( color ) {

		this.screenStart.setStartScreenMenuBgColor( color );

	};

	/**
	 * Function: setStartScreenMenuPos
	 *
	 * Set the position of the start menu.
	 *
	 * @param x
	 * @param y
	 */
	VN.prototype.setStartScreenMenuPos = function setStartScreenMenuPos( x, y ) {

		var posX = x > 1 ? x : x * this.screenHeight;
		var posY = y > 1 ? y : y * this.screenWidth;

		this.screenStart.setStartScreenMenuPos( posX, posY );

	};

	/**
	 * Function: setNovelTitle
	 *
	 * Set the novel title and subtitle in the start screen.
	 *
	 * @param title = new novel title
	 * @param subtitle = new novel subtitle
	 */
	VN.prototype.setNovelTitle = function setNovelTitle( title, subtitle ) {

		this.screenStart.updateNovelTitle( title, subtitle );

	};

	/**
	 * Function: setNovelTitlePosition
	 *
	 * Set the position of the novel title on the start screen
	 *
	 * @param x = distance from left
	 * @param y = distance from top
	 */
	VN.prototype.setNovelTitlePosition = function setNovelTitlePosition( x, y ) {

		var pos = this.util.scalePosition(
				{
					"x": x,
					"y": y
				},
				{
					"x": this.screenWidth,
					"y": this.screenHeight
				}
			);

		this.screenStart.setNovelTitlePosition( pos.x, pos.y );

	};





	/**
	 * Attach module to namespace
	 */
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {

				this.initScreenStart( novelId );

			},
			"reset": function reset() {}
		}
	);

	/**
	 * Constructor: Start Screen
	 *
	 * Create start screen for novel with given id.
	 *
	 * @param novelId
	 */
	function ScreenStart( novelId ) {

		this.novelId = novelId;

		this.novelTitleContainerId = null;
		this.novelTitle = "";
		this.novelTitleTextId = null;
		this.novelSubtitle = "";
		this.novelSubtitleTextId = null;

		this.screenStartId = null;
		this.screenStartMenuButtonContainerId = null;
		this.screenStartMenuStartButtonId = null;
	
	}

	/**
	 * Function: setContent
	 *
	 * Set content of start screen.
	 *
	 * @param content
	 */
	ScreenStart.prototype.setContent = function setContent( content ) {

		this.screenStartId.innerHTML = content;

	};

	/**
	 * Function: showStartScreen
	 *
	 * Show or hide the start screen.
	 *
	 * @param show = true / false
	 */
	ScreenStart.prototype.showStartScreen = function showStartScreen( show ) {

		var display = show ? "block" : "none";

		this.screenStartId.style.display = display;

	};

	/**
	 * Function: updateStartMenuReference
	 *
	 * Update refences to html elements on the start screen.
	 *
	 * @param novelId = id of the novel div, and instance reference
	 */
	ScreenStart.prototype.updateStartMenuReference = function updateStartMenuReference() {

		var doc = document;
		var novelId = this.novelId;

		this.novelTitleContainerId = doc.getElementById( novelId + "-startMenuTitleContainer" );
		this.novelTitleTextId = doc.getElementById( novelId + "-startMenuTitleText" );
		this.novelSubtitleTextId = doc.getElementById( novelId + "-startMenuSubtitleText" );
		this.screenStartMenuButtonContainerId = doc.getElementById( novelId + "-startMenuButtonContainer" );
		this.screenStartMenuStartButtonId = doc.getElementById( novelId + "-startMenuButton" );
		
	};

	/**
	 * Function: addStartMenuButtonHandler
	 *
	 * Add the event handlers for the start menu.
	 *
	 * @param callback = called when start menu button is clicked
	 */
	ScreenStart.prototype.addStartMenuButtonHandler = function addStartMenuButtonHandler( callback ) {

		// TODO: refactor...event delegation
		this.screenStartMenuStartButtonId.onclick = callback;

	};

	/**
	 * Function: setStartScreenBgImage
	 *
	 * Set the background image of the start screen.
	 *
	 * @param imgPath = path of the background image
	 * @param width = width of the image
	 * @param height = height of the image
	 */
	ScreenStart.prototype.setStartScreenBgImage = function setStartScreenBgImage( imgPath, width, height ) {

		var newStyle = ";background-image:url('" + imgPath + "');" +
			"background-size:" + width + "px " + height + "px;";

		this.screenStartId.style.cssText += newStyle;

	};

	/**
	 * Function: setStartScreenBgColor
	 *
	 * Set the background color of the start screen.
	 *
	 * @param color = new background color of the start screen
	 */
	ScreenStart.prototype.setStartScreenBgColor = function setStartScreenBgColor( color ) {

		this.screenStartId.style[ "background-color" ] = color;

	};

	/**
	 * Function: setStartScreenMenuBgImage
	 *
	 * Set the background image of the start menu.
	 *
	 * @param imgPath = path of the background image
	 * @param width = width of the image
	 * @param height = height of the image
	 */
	ScreenStart.prototype.setStartScreenMenuBgImage = function setStartScreenMenuBgImage( imgPath, width, height ) {

		var newStyle = ";background-image:url('" + imgPath + "');" + 
			"background-size:" + width + "px " + height + "px;";

		this.screenStartMenuButtonContainerId.style.cssText += newStyle;

	};

	/**
	 * Function: setStartScreenMenuBgColor
	 *
	 * Set the background color of the start menu.
	 *
	 * @param color = new background color of the start menu
	 */
	ScreenStart.prototype.setStartScreenMenuBgColor = function setStartScreenMenuBgColor( color ) {

		this.screenStartMenuButtonContainerId.style[ "background-color" ] = color;

	};

	/**
	 * Function: setStartScreenMenuPos
	 *
	 * Set the position of the start menu on the start screen.
	 *
	 * @param x = distance from left
	 * @param y = distance from top
	 */
	ScreenStart.prototype.setStartScreenMenuPos = function setStartScreenMenuPos( x, y ) {

		var newStyle = ";left:" + x + "px;top:" + y + "px;";

		this.screenStartMenuButtonContainerId.style.cssText += newStyle;

	};

	/**
	 * Function: updateNovelTitle
	 *
	 * Set the novel title and subtitle on the start screen.
	 *
	 * @param title = new novel title
	 * @param subtitle = new novel subtitle
	 */
	ScreenStart.prototype.updateNovelTitle = function updateNovelTitleView( title, subtitle ) {

		this.novelTitleTextId.innerHTML = this.novelTitle = title;
		this.novelSubtitleTextId.innerHTML = this.novelSubtitle = subtitle;

	};

	/**
	 * Function: setNovelTitlePosition
	 *
	 * Set the position of the novel title on the start screen.
	 *
	 * @param x = distance from left
	 * @param y = distance from top
	 */
	ScreenStart.prototype.setNovelTitlePosition = function setNovelTitlePosition( x, y ) {

		// TODO: minimize reflows
		// http://jsperf.com/csstext-vs-multiple-css-rules/4
		// Using multiple style rule is efficient than cssText
		// but it does not consider reflow/repaint
		// so cssText may be better...probably
		var newStyle = ";left:" + x + "px;top:" + y + "px;";

		this.novelTitleContainerId.style.cssText += newStyle;

	};





} )( window.VisualNovel = window.VisualNovel || {} );