( function( VN ) {
	
	/**
	 * Function: initScreenStart
	 *
	 * Initialize the start screen
	 *
	 * @param novelId = id of the novel div, and instance reference
	 */
	VisualNovel.prototype.initScreenStart = function initScreenStart( novelId ) {

		var self = this;
		var screenStart = this.screenStart = new ScreenStart( novelId );

		this.screenStart.screenStartId = document.getElementById( novelId + "-screen-start" );
		
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
	VisualNovel.prototype.startNovel = function startNovel() {

		// hide start main menu
		this.screenStart.showStartScreen( false );
		
		this.eventTracker.startEvent();

	};

	/**
	 * Function: buildStartMenu
	 *
	 * Build the html for the start menu
	 *
	 * @param novelId = id of the novel div, and instance reference
	 */
	VisualNovel.prototype.buildStartMenu = function builStartMenu( novelId ) {

		var screenStart = this.screenStart.screenStartId;

		var startMenuTemplate = this.templates.get( "startmenu" );
		var parseVariables = {
			"novelId": novelId,
			"novelTitle": this.novelTitle,
			"novelSubtitle": this.novelSubtitle
		};

		startMenuTemplate = this.parser.parseTemplate( startMenuTemplate, parseVariables );

		screenStart.innerHTML = startMenuTemplate;	

	};

	VisualNovel.prototype.showStartScreen = function showStartScreen( show ) {

		this.screenStart.showStartScreen( show );

	};

	VisualNovel.prototype.setStartScreenBgImage = function setStartScreenBgImage( imgPath, width, height ) {

		this.screenStart.setStartScreenBgImage( this.imgPath + imgPath, width, height );

	};

	VisualNovel.prototype.setStartScreenBgColor = function setStartScreenBgColor( color ) {

		this.screenStart.setStartScreenBgColor( color );

	};

	VisualNovel.prototype.setStartScreenMenuBgImage = function setStartScreenMenuBgImage( imgPath, width, height ) {

		this.screenStart.setStartScreenBgImage( this.imgPath + imgPath, width, height );

	};

	VisualNovel.prototype.setStartScreenMenuBgColor = function setStartScreenMenuBgColor( color ) {

		this.screenStart.setStartScreenMenuBgColor( color );

	};

	VisualNovel.prototype.setStartScreenMenuPos = function setStartScreenMenuPos( x, y ) {

		var posX = x > 1 ? x : x * this.screenHeight;
		var posY = y > 1 ? y : y * this.screenWidth;

		this.screenStart.setStartScreenMenuPos( posX, posY );

	};

	/**
	 * Function: setNovelTitle
	 *
	 * Set the novel title in the model and view
	 *
	 * @param title = new novel title
	 * @param subtitle = new novel subtitle
	 */
	VisualNovel.prototype.setNovelTitle = function setNovelTitle( title, subtitle ) {

		this.updateNovelTitleModel( title, subtitle );
		this.updateNovelTitleView( title, subtitle );

	};

	/**
	 * Function: updateNovelTitleModel
	 *
	 * Set the novel title in the model
	 *
	 * @param title = new novel title
	 * @param subtitle = new novel subtitle
	 */
	VisualNovel.prototype.updateNovelTitleModel = function updateNovelTitleModel( title, subtitle ) {

		this.novelTitle = title;
		this.novelSubtitle = subtitle;

	};

	/**
	 * Function: updateNovelTitleView
	 *
	 * Set the novel title in the view
	 *
	 * @param title = new novel title
	 * @param subtitle = new novel subtitle
	 */
	VisualNovel.prototype.updateNovelTitleView = function updateNovelTitleView( title, subtitle ) {

		this.screenStart.updateNovelTitleView( title, subtitle );

	};

	/**
	 * Function: setNovelTitlePosition
	 *
	 * Set the position of the novel title on the start screen
	 *
	 * @param x = distance from left
	 * @param y = distance from top
	 */
	VisualNovel.prototype.setNovelTitlePosition = function setNovelTitlePosition( x, y ) {

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
	 * Start
	 */
	function ScreenStart( novelId ) {

		this.novelId = novelId;

		this.novelTitleContainerId = null;
		this.novelTitleTextId = null;
		this.novelSubtitleTextId = null;
		this.screenStartId = null;
		this.screenStartMenuButtonContainerId = null;
		this.screenStartMenuStartButtonId = null;
	
	}

	ScreenStart.prototype.showStartScreen = function showStartScreen( show ) {

		var display = show ? "block" : "none";

		this.screenStartId.style.display = display;

	};

	/**
	 * Function: updateStartMenuReference
	 *
	 * Update refences to html elements on the start screen
	 *
	 * @param novelId = id of the novel div, and instance reference
	 */
	ScreenStart.prototype.updateStartMenuReference = function updateStartMenuReference() {

		var doc = document;
		var novelId = this.novelId;

		this.novelTitleContainerId = doc.getElementById( novelId + "-novelTitleContainer" );
		this.novelTitleTextId = doc.getElementById( novelId + "-novelTitleText" );
		this.novelSubtitleTextId = doc.getElementById( novelId + "-novelSubtitleText" );
		this.screenStartMenuButtonContainerId = doc.getElementById( novelId + "-startMenuButtonContainer" );
		this.screenStartMenuStartButtonId = doc.getElementById( novelId + "-startMenuButton" );
		
	};

	/**
	 * Function: addStartMenuButtonHandler
	 *
	 * Add the event handlers for the start menu
	 */
	ScreenStart.prototype.addStartMenuButtonHandler = function addStartMenuButtonHandler( callback ) {

		// TODO: refactor...event delegation
		this.screenStartMenuStartButtonId.onclick = callback;

	};

	ScreenStart.prototype.setStartScreenBgImage = function setStartScreenBgImage( imgPath, width, height ) {

		var newStyle = ";background-image:url('" + imgPath + "');" +
			"background-size:" + width + "px " + height + "px;";

		this.screenStartId.style.cssText += newStyle;

	};

	ScreenStart.prototype.setStartScreenBgColor = function setStartScreenBgColor( color ) {

		this.screenStartId.style[ "background-color" ] = color;

	};

	ScreenStart.prototype.setStartScreenMenuBgImage = function setStartScreenMenuBgImage( imgPath, width, height ) {

		var newStyle = ";background-image:url('" + imgPath + "');" + 
			"background-size:" + width + "px " + height + "px;";

		this.screenStartMenuButtonContainerId.style.cssText += newStyle;

	};

	ScreenStart.prototype.setStartScreenMenuBgColor = function setStartScreenMenuBgColor( color ) {

		this.screenStartMenuButtonContainerId.style[ "background-color" ] = color;

	};

	ScreenStart.prototype.setStartScreenMenuPos = function setStartScreenMenuPos( x, y ) {

		var newStyle = ";left:" + x + "px;top:" + y + "px;";

		this.screenStartMenuButtonContainerId.style.cssText += newStyle;

	};

	/**
	 * Function: updateNovelTitleView
	 *
	 * Set the novel title in the view
	 *
	 * @param title = new novel title
	 * @param subtitle = new novel subtitle
	 */
	ScreenStart.prototype.updateNovelTitleView = function updateNovelTitleView( title, subtitle ) {

		this.novelTitleTextId.innerHTML = title;
		this.novelSubtitleTextId.innerHTML = subtitle;

	};

	/**
	 * Function: setNovelTitlePosition
	 *
	 * Set the position of the novel title on the start screen
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