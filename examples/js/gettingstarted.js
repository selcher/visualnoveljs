
// When page is ready, initialize app
$( "document" ).ready(

	function() {

		initMenu();
		initGettingStarted();

	}

);

function initMenu() {

	function getTabList() {

		var args = [].slice.call( arguments );
		var doc = document;
		var tab = null;
		var tabs = [];
		var tabsMap = {};

		args.forEach( function( tabInfo ) {

			tab = doc.getElementById( tabInfo.content );
			tabs.push( tab );
			tabsMap[ tabInfo.link ] = tab;
		
		} );

		return {
			"list" : tabs,
			"map" : tabsMap
		};

	}

	function initMenuLinks( linkClass, tabList, tabListMap ) {

		var menuLinkDivs = document.getElementsByClassName( linkClass );
		var menuLinkDivsLength = menuLinkDivs.length;
		
		for ( var i = 0; i < menuLinkDivsLength; i++ ) {

			menuLinkDivs[ i ].addEventListener( "click", function clickMenuLink( e ) {

				var linkDivs = document.getElementsByClassName( linkClass );
				var linkDivsLength = linkDivs.length;

				// remove selected-button to links
				for ( var c = 0; c < linkDivsLength; c++ ) {
					linkDivs[ c ].className = linkClass + " button";
				}

				// add selected-button to clicked link
				this.className = linkClass + " button selected-button";

				var id = e.target.id;

				// hide all tabs
				tabList.forEach( function( tab ) {
					tab.style.display = "none";
				} );

				// show clicked tab
				tabListMap[ id ].style.display = "block";

			} );

		}

	}

	var tabs = getTabList( 
		{ "link" : "showInfo", "content" : "info" },
		{ "link" : "showGettingStarted", "content" : "getting-started" },
		{ "link" : "showDocs", "content" : "docs" },
		{ "link" : "showExamples", "content" : "examples" }
	);
	initMenuLinks( "menuLink", tabs.list, tabs.map );

	tabs = getTabList( 
		{ "link" : "showDocsConfig", "content" : "docs-config" },
		{ "link" : "showDocsCharacter", "content" : "docs-character" },
		{ "link" : "showDocsSay", "content" : "docs-say" },
		{ "link" : "showDocsMenu", "content" : "docs-menu" },
		{ "link" : "showDocsCondition", "content" : "docs-condition" },
		{ "link" : "showDocsLoop", "content" : "docs-loop" },
		{ "link" : "showDocsScene", "content" : "docs-scene" },
		{ "link" : "showDocsSceneText", "content" : "docs-scene-text" },
		{ "link" : "showDocsSceneObject", "content" : "docs-scene-object" }
	);
	initMenuLinks( "docsLink", tabs.list, tabs.map );

}

function initGettingStarted() {

	var vn2 = new VisualNovel( "getting-started-vn", 800, 600, "../../img/persona/" );

	vn2.init();
	vn2.setNovelTitle( "Visual Novel JS", "getting started", 300, 100 );
	vn2.setStartScreenBgColor( "black" );
	vn2.setStartScreenMenuPos( 400, 400 );
	vn2.setBgColor( "black" );
	vn2.setDialogBgColor( "white" );
	vn2.setDialogTextColor( "black" );

	vn2.say( "Me", "Hello World" );
	vn2.say( "World", "Hi Me");
	
	vn2.reset();

}