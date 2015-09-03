( function( VN ) {

	VN.prototype.userInput = {};

	VN.prototype.input = function input( storeInputKey, message ) {

		var self = this;

		function eventToAdd() {
			
			var template = self.getUserInputTemplate( message );

			self.inputDialog.input( storeInputKey, template,
				function() {

					var userInput = self.inputDialog.getInput();

					self.setInput( storeInputKey, userInput );

					self.inputDialog.setInputDialogDisplay( false );

					self.eventTracker.nextEvent();
				
				}
			);

		}

		this.eventTracker.addEvent( "wait", eventToAdd );

	};

	/**
	 * Variable: userInputTemplate
	 *
	 * Template for user input.
	 */
	VN.prototype.userInputTemplate = [
		"<div id='userInputContainer' class='userInputContainer'>",
			"<div id='userInputMessage' class='userInputMessage'>{message}</div>",
			"<hr/><br/>",
			"<input id='{novelId}-userInputText' class='userInputText' type='text' />",
			"<br/><br/>",
			"<input type='button' id='{novelId}-userInputButton' class='userInputButton' value='OK' />",
		"</div>"
	].join( "" );

	VN.prototype.getUserInputTemplate = function getUserInputTemplate( message ) {

		// variables to replace in template
		var toReplace = {
			"novelId": this.novelId,
			"message": message
		};

		// get template
		var userInputTemplate = this.parser.parseTemplate( this.userInputTemplate, toReplace );

		return userInputTemplate;

	};

	VN.prototype.setInput = function setInput( key, value ) {

		if ( key ) {

			this.userInput[ key ] = value;

		}

	};

	VN.prototype.setValue = function setValue( key, value ) {

		var self = this;

		function eventToAdd() {
			
			self.setInput( key, value );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	VN.prototype.getValue = function getValue( key ) {

		return this.userInput[ key ];

	};





	// Add module
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {

				this.inputDialog = new InputDialog( novelId );

				this.inputDialog.init();

			},
			"reset": function reset() {}
		}
	);

	function InputDialog( novelId ) {

		this.novelId = novelId;

	}

	InputDialog.prototype.init = function init() {

		var novelId = this.novelId;

		this.inputDialogId = document.getElementById( novelId + "-dialog-input" );

		this.setInputDialogDisplay( false );

	};

	InputDialog.prototype.input = function input( storeInputKey, template, callback ) {
		
		var self = this;

		this.setInputDialogDisplay( true );

		this.setUserInputContainer( template );

		this.updateUserInputReference();

		this.userInputButtonId.onclick = function clickUserInputButton() {

			callback();

		};

	};

	InputDialog.prototype.setInputDialogDisplay = function setInputDialogDisplay( show ) {

		this.inputDialogId.style.display = show ? "block" : "none";

	};

	InputDialog.prototype.setUserInputContainer = function setUserInputContainer( template ) {

		this.inputDialogId.innerHTML = template;

	};

	InputDialog.prototype.updateUserInputReference = function updateUserInputReference() {

		var novelId = this.novelId;
		var doc = document;

		this.userInputTextId = doc.getElementById( novelId + "-userInputText" );
		this.userInputButtonId = doc.getElementById( novelId + "-userInputButton" );

	};

	InputDialog.prototype.getInput = function getInput() {

		var userInput = this.userInputTextId;

		return userInput ? userInput.value : "";

	};

} )( window.VisualNovel = window.VisualNovel || {} );