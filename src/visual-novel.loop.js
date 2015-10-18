( function( VN ) {

	/**
	 * Variable: timers
	 *
	 * Hold timers for loop
	 */
	VN.prototype.timers = {};

	/**
	 * Function: loop
	 *
	 * Repeat the action passed a number of times or infinitely
	 *
	 * @param id = reference to loop so it can cleared later
	 * @param repeat = no of times to repeat or repeat infinitely
	 * @param action = action to perform
	 * @param delay = delay before repeating the action
	 */
	VN.prototype.loop = function loop( id, repeat, action, delay ) {

		// repeat = true : repeat infinitely
		// repeat = number : repeat number of times
		// repeat = null/undefined : no repeat, perform action once

		if ( action ) {

			var self = this;
			var timerDelay = delay ? delay : 100;

			// TODO: refactor since it is long
			var eventToAdd = function eventToAdd() {

				// check if loop exists, and clear if it does
				if ( self.timers[ id ] ) {

					self.clearLoop( id );
					self.timers[ id ] = null;
				
				}

				if ( repeat === true ) {

					// repeat infinitely
					self.timers[ id ] = {
						type : "interval",
						timer : setInterval( function() {
							action();
						}, timerDelay )
					};

				} else if ( repeat > 0 ) {

					// repeat a number of times
					var repeatTimes = repeat;
					var repeatTimeout = function() {
						action();
						repeatTimes--;
						checkRepeat();
					};
					var checkRepeat = function() {
						
						if ( repeatTimes ) {
							self.timers[ id ].timer = setTimeout( repeatTimeout, timerDelay );
						} else {
							self.timers[ id ].timer = null;
						}

					};

					self.timers[ id ] = {
						type : "timeout",
						timer : null
					};

					checkRepeat();

				} else {

					action();
				
				}

			};

			this.eventTracker.addEvent( "nowait", eventToAdd );

		}

	};

	/**
	 * Function: clearLoop
	 *
	 * Clear the loop stored in timers
	 *
	 * @param id = reference to loop timer
	 */
	VN.prototype.clearLoop = function clearLoop( id ) {

		var self = this;

		function eventToAdd() {

			self.clearTimer( id );

		}

		this.eventTracker.addEvent( "nowait", eventToAdd );

	};

	/**
	 * Function: clearTimer
	 *
	 * Clear a timer by checking it in timers
	 *
	 * @param id = reference to the timer
	 */
	VN.prototype.clearTimer = function clearTimer( id ) {

		var timerInfo = this.timers[ id ];

		if ( timerInfo ) {

			// TODO: refactor as another function
			if ( timerInfo.type === "timeout" ) {

				clearTimeout( timerInfo.timer );

			} else if ( timerInfo.type === "interval" ) {

				clearInterval( timerInfo.timer );

			}

			this.timers[ id ] = null;

		}

	};

	/**
	 * Function: resetLoops
	 *
	 * Reset all loops that have not been cleared
	 * Loops are stored in timers
	 */
	VN.prototype.resetLoops = function resetLoops() {

		var loops = this.timers;
		var loopType = null;

		// TODO: research for more efficient way
		for ( var loopId in loops ) {

			loopType = loops[ loopId ] ? loops[ loopId ].type : null;

			if ( loopType && ( loopType === "timeout" || loopType === "interval" ) ) {

				this.clearTimer( loopId );
			
			}

		}

	};

	/**
	 * Attach module to namespace
	 */
	VN.prototype.modules.push(
		{
			"init": function init( novelId ) {},
			"reset": function reset() {

				this.resetLoops();

			}
		}
	);

} )( window.VisualNovel = window.VisualNovel || {} );