describe( 'EventTracker class', function() {

	var eventTracker = EventTracker();

	it( 'addEvent', function() {

		expect( eventTracker.eventList[ 'main' ] ).toEqual( [] );

		// addEvent
		var evt = {
			"type" : 'nowait',
			"event" : function() {},
			"delay" : 100
		};
		eventTracker.addEvent( evt.type, evt.event, evt.delay );
		expect( eventTracker.eventList[ 'main' ].length ).toEqual( 1 );
		expect( eventTracker.eventList[ 'main' ] ).toEqual( [ evt ] );

	} );

	it( 'addNewEventInProgress', function() {

		// addNewEventInProgress
		eventTracker.addNewEventInProgress( 'test' );
		expect( eventTracker.eventsInProgress.length ).toEqual( 2 );
		expect( eventTracker.eventsInProgress[ 1 ] ).toEqual( 'test' );
		expect( eventTracker.eventList[ 'test' ] ).toBeDefined();
		expect( eventTracker.eventList[ 'test' ] ).toEqual( [] );
		expect( eventTracker.eventId[ 'test' ] ).toBeDefined();
		expect( eventTracker.eventId[ 'test' ] ).toEqual( 0 );

	} );

	it( 'startEvent', function() {

		// startEvent
		eventTracker = new EventTracker();
		val = 0;
		evt = {
			"type" : 'wait',
			"event" : function() { val = 1; },
			"delay" : 0
		};
		eventTracker.addEvent( evt.type, evt.event, evt.delay );
		eventTracker.startEvent();
		expect( val ).toEqual( 1 );

	} );

	it( 'nextEvent', function() {

		// nextEvent
		evt = {
			"type" : 'wait',
			"event" : function() { val = 2; },
			"delay" : 0
		};
		eventTracker.addEvent( evt.type, evt.event, evt.delay );
		eventTracker.nextEvent();
		expect( val ).toEqual( 2 );

	} );

	it( 'resetEventsInProgress', function() {

		// resetEventsInProgress
		eventTracker.resetEventsInProgress();
		expect( eventTracker.eventsInProgress ).toEqual( [ 'main' ] );
		expect( eventTracker.eventId ).toEqual( { 'main' : 0 } );

	} );

	it( 'delayCallback', function() {

		// delayCallback
		var val = 0;
		eventTracker.delayCallback( 0, function() { val = 1; } );
		expect( val ).toEqual( 1 );

	} );

} );