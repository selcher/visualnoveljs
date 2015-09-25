( function( VN ) {

	VN.prototype.choice = function choice( choiceEventId, listOfChoices, menuPos, menuImg ) {

		// choiceEventId = to track the choice event

		var self = this;
		var totalChoices = listOfChoices.length;

		// For choice menu:
		// 1. build choice buttons
		// 2. build choice image
		// 3. insert buttons and image to menu container
		var choicesTemplate = this.buildMenuChoices( listOfChoices, menuImg );

		//  choice menu position
		var pos = this.util.scalePosition(
					{ "x": menuPos.x, "y": menuPos.y },
					{ "x": this.screenWidth, "y": this.screenHeight }
				);

		function eventToAdd() {

			// show
			self.menuChoicesDialog.setMenuChoicesDisplay( true );

			// init event to menu choices 
			// and store the choices 
			// to perform the choices on button click

			// Store choices to call later on button click
			self.menuChoicesDialog.menuChoices[ choiceEventId ] = listOfChoices.slice();

			self.menuChoicesDialog.setMenuChoices( choicesTemplate );

			self.menuChoicesDialog.updateMenuChoicesReference();

			// Attach click events to dialog menu choice buttons
			self.menuChoicesDialog.addMenuChoicesHandler(
				choiceEventId,
				listOfChoices,
				function() {

					// add event to reset menu choices so
					// that it only gets called after
					// all menu choice actions are done
					self.resetMenuChoicesForEvent( choiceEventId );

					// start events in menu choice action
					self.eventTracker.startEvent(); 
				}
			);

			// position choice menu
			if ( menuPos ) {

				self.menuChoicesDialog.setMenuChoicesPosition( pos.x, pos.y );

			}

			// add new event
			self.eventTracker.addNewEventInProgress( choiceEventId );

			// Debug
			// console.log( "choice: " + choiceEventId );
			// console.log( self.eventTracker.eventsInProgress );
			// console.log( self.eventTracker.eventList );
			// console.log( self.eventTracker.eventId );
			
		}

		this.eventTracker.addEvent( "wait", eventToAdd );

	};

	VN.prototype.buildMenuChoices = function buildMenuChoices( listOfChoices, menuImage ) {

		// Get menu choices template
		var menuImg = menuImage ? menuImage : { "image": "", "width": 0, "height": 0 };
		var imgPath = menuImage ? this.imgPath + menuImg.image : "";
		var menuChoiceTemplate = this.getMenuChoicesTemplate( listOfChoices, imgPath, 
			menuImg.width, menuImg.height );

		return menuChoiceTemplate;

	};

	/**
	 * Variable: menuChoiceTemplate
	 *
	 * Template for menu choice.
	 */
	VN.prototype.menuChoiceTemplate = [
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
	].join( "" );

	VN.prototype.getMenuChoicesTemplate = function getMenuChoicesTemplate( choices, imgPath, imgWidth, imgHeight ) {

		// variables to replace in template
		var toReplace = {
			"novelId": this.novelId,
			"choices": choices,
			"imgPath": imgPath,
			"imgWidth": imgWidth,
			"imgHeight": imgHeight
		};

		// get template
		var menuChoiceTemplate = "";

		if ( this.parser ) {

			menuChoiceTemplate = this.parser.parseTemplate( this.menuChoiceTemplate, toReplace );

		} else {

			this.log( "[dialog-choice]VisualNovelJS Error: parser module not found" );

		}

		return menuChoiceTemplate;

	};

	VN.prototype.resetMenuChoicesForEvent = function resetMenuChoicesForEvent( choiceEventId ) {

		var self = this;

		function eventToAdd() {
			
			self.menuChoicesDialog.resetMenuChoicesForEvent( choiceEventId );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};










	// Add module
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {

				this.menuChoicesDialog = new MenuChoicesDialog( novelId );

				this.menuChoicesDialog.init();

			},
			"reset": function reset() {

				this.menuChoicesDialog.resetMenuChoices();

			}
		}
	);

	function MenuChoicesDialog( novelId ) {

		this.novelId = novelId;
		this.menuChoicesTaken = {};
		this.menuChoices = {};

		this.dialogMenuId = null;
		this.dialogMenuChoiceContainerId = null;

		return this;

	}

	MenuChoicesDialog.prototype.init = function init() {

		this.dialogMenuId = document.getElementById( this.novelId + "-dialog-menu" );

		// Init dialog menu container
		this.hideDialogMenuContainer();

	};

	MenuChoicesDialog.prototype.hideDialogMenuContainer = function hideDialogMenuContainer() {

		this.dialogMenuId.style.display = "none";

	};

	MenuChoicesDialog.prototype.setMenuChoices = function setMenuChoices( template ) {

		this.dialogMenuId.innerHTML = template;

	};

	MenuChoicesDialog.prototype.updateMenuChoicesReference = function updateMenuChoicesReference() {

		this.dialogMenuChoiceContainerId = document.getElementById( this.novelId + "-dialogMenuChoiceContainer" );

	};

	MenuChoicesDialog.prototype.addMenuChoicesHandler = function addMenuChoicesHandler( choiceEventId, choices, callback ) {

		var self = this;
		var doc = document;
		var novelId = this.novelId;
		var onMenuChoiceClick = function( i ) {

			var index = i;

			return function clickDialogMenuChoiceButton() {

				// hide menu
				self.dialogMenuId.style.display = "none";

				self.performMenuChoice( choiceEventId, index );

				callback();

			};

		};

		for ( var i = choices.length; i--; ) {

			// TODO: add event delegation to menu choice container
			doc.getElementById( novelId + "-dialogMenuChoiceButton" + i ).onclick = onMenuChoiceClick( i );

		}

	};

	MenuChoicesDialog.prototype.performMenuChoice = function performMenuChoice( choiceEventId, indexInListOfChoices ) {

		var choiceTaken = this.menuChoices[ choiceEventId ][ indexInListOfChoices ];

		// store choice taken
		this.menuChoicesTaken[ choiceEventId ] = choiceTaken;

		var action = choiceTaken.action;

		// register events in menu choice action
		action();

	};

	MenuChoicesDialog.prototype.resetMenuChoicesForEvent = function resetMenuChoicesForEvent( choiceEventId ) {

		this.menuChoices[ choiceEventId ] = [];

	};

	MenuChoicesDialog.prototype.resetMenuChoices = function resetMenuChoices() {

		this.menuChoices = {};
		this.menuChoicesTaken = {};

	};

	MenuChoicesDialog.prototype.setMenuChoicesDisplay = function setMenuChoicesDisplay( show ) {

		this.dialogMenuId.style.display = show ? "block" : "none";

	};

	MenuChoicesDialog.prototype.setMenuChoicesPosition = function setMenuChoicesPosition( x, y ) {

		this.dialogMenuChoiceContainerId.style.cssText += ";left:" + x + "px;top:" + y + "px;";

	};

} )( window.VisualNovel = window.VisualNovel || {} );