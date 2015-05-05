
// When page is ready, initialize app
$( "document" ).ready(

	function() {

		initMenu();
		initDemo();
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
		{ "link" : "showDemo", "content" : "demo" },
		{ "link" : "showGettingStarted", "content" : "getting-started" },
		{ "link" : "showDocs", "content" : "docs" },
		{ "link" : "showReleases", "content" : "releases" }
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

function initDemo() {

	// define character
	var elizabeth = {
		name: "Elizabeth",
		width: 600,
		height: 600,
		image: "character/elizabeth1.png",
		pos: {
			x : 1.0,
			y : 0
		}
	};

	// Initialize and configure novel
	var vn = new VisualNovel( "demo", 800, 600, "img/persona/" );
	vn.init();
	vn.setNovelTitle( "Persona", "a visual novel" );
	vn.setNovelTitlePosition( 300, 0 );
	vn.setStartScreenBgImage( "bg/night.jpg", 800, 600 );
	vn.setStartScreenBgColor( "black" );
	vn.setStartScreenMenuBgColor( "rgba( 0, 0, 0, 0.9 )" );
	vn.setStartScreenMenuPos( 0, 350 );
	vn.setDialogBgColor( "rgba( 255, 255, 255, 0.8 )" );
	vn.setDialogTextColor( "black" );
	vn.setDialogBorderStyle( "", "lightblue", "10px 50px", 60 );

	// set mode to dialog ( novel mode not yet implemented )
	vn.setNovelMode( "dialog", 680, 130, 10, 420 );

	// set background image
	vn.setBgImage( "bg/hall.jpg", 1600, 1200 );

	vn.setBgSize( 1600, 1200 );
	vn.fadeBg( "in", 1000 );
		var textSetting = { x: 0.55, y: 0, z: 0.4, 
			width : 300, height : 50,
			color: "white", size : 30,
			bgColor : "transparent", bgImage : "",
			fade: 500 };

		vn.addTextToScene( "py",
			"Visual Novel JS<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;presents",
			textSetting, 500
		);
	vn.pause( 1000 );

	vn.setBgSize( 1200, 900, 2000, 5000 );

	vn.setBgPosition( -300, 0, 6000, 7000 );
		vn.fadeSceneText( "py", "out", 500 );
	vn.setBgPosition( -100, 0, 2000, 3000 );
		vn.removeSceneText( "py" );
		vn.addTextToScene( "py",
			"Persona<br/>&nbsp;a visual novel",
			textSetting, 500
		);
	vn.setBgPosition( -100, -100, 1500, 2500 );
	vn.setBgPosition( -400, -150, 2000, 3000 );
		vn.fadeSceneText( "py", "out", 500 );

	vn.setBgSize( 2000, 1500, 6000, 0 );
	vn.setBgPosition( -600, -300, 6000, 8000 );
		vn.removeSceneText( "py" );

	// display character
	vn.addCharacter( elizabeth, 1000, "fade" );

	vn.moveCharacter( elizabeth, 0.2, 0, 500 );
	vn.fadeCharacter( elizabeth, "in", 500 );
	vn.pause( 1000 );

	// add dialog text
	vn.say( "???", "Welcome!" );
	vn.say( "???", "Before we get started, let me introduce myself.", 1000 );
	vn.say( "???", "My name is Elizabeth." );
	vn.input( "name", "What's your name?" );
	vn.say( "Elizabeth", "Pleased to meet you, {name}", 1000 );

	vn.showSayDialog( false );

	vn.moveCharacter( elizabeth, 0.4, 0, 500 );

	// Show menu:
	// 1. What's a persona?
	// 2. Who are you?
	// 3. Skip

	function beforeArcanaInfo( arcana, imgPath ) {

		vn.moveCharacter( elizabeth, 1.0, 0, 500 );
		vn.fadeCharacter( elizabeth, "out", 500 );

		vn.pause( 500 );

		vn.addObjectToScene( arcana,
			{ width: 100, height: 200, path: imgPath },
			{ x: 0.5, y: 0, z: 0.15 }, 500, true, 500
		);
		vn.moveSceneObject( arcana, 0.5, 0.1, 0, 1000, 0 );

		vn.pause( 1000 );

		vn.moveSceneObject( arcana, 0.6, 0.1, 0, 500, 0 );
		vn.rotateSceneObject( arcana, "y", 1, 20, true );

		vn.pause( 500 );

	}

	function afterArcanaInfo( arcana ) {

		vn.showSayDialog( false );

		vn.resetSceneObject( arcana, "rotate" );
		vn.fadeSceneObject( arcana, "out", 500 );
		
		vn.pause( 500 );

		vn.removeSceneObject( arcana );

		vn.moveCharacter( elizabeth, 0.4, 0, 500 );
		vn.fadeCharacter( elizabeth, "in", 500 );
		
		vn.repeatEvent();

	}

	var ArcanaList = [
		{
			label : "Fool",
			action : function() {
				beforeArcanaInfo( "fool", "tarot/fool.png" );
				vn.say( "Elizabeth", "Portrayed as a jester laughing very close to a cliff, accompanied with a dog at his heels." );
				vn.say( "Elizabeth", "The Fool represents innocence, divine inspiration, madness, freedom, spontaneity, inexperience, chaos, and creativity." );
				afterArcanaInfo( "fool" );
			}
		},
		{
			label : "Magician",
			action : function() {
				beforeArcanaInfo( "magician", "tarot/magician.png" );
				vn.say( "Elizabeth", "The Magician Arcana is commonly associated with action, initiative, self-confidence, manipulation and power (more specifically, the power to harness one's talents)." );
				afterArcanaInfo( "magician" );
			}
		},
		{
			label : "Priestess",
			action : function() {
				beforeArcanaInfo( "priestess", "tarot/priestess.png" );
				vn.say( "Elizabeth", "Portrayed as an old woman with an open book, the Priestess Arcana is a symbol of hidden knowledge or other untapped power, wisdom, female mystery and patience." );
				vn.say( "Elizabeth", "Individuals associated with the Priestess Arcana are usually quiet, reserved, and very intelligent." );
				afterArcanaInfo( "priestess" );
			}
		},
		{
			label : "Empress",
			action : function() {
				beforeArcanaInfo( "empress", "tarot/empress.png" );
				vn.say( "Elizabeth", "The Empress represents mothers, prosperity, creativity, sexuality, abundance, fertility and comfort (most often in helping maintain peace around them like an ideal mother would.)" );
				afterArcanaInfo( "empress" );
			}
		},
		{
			label : "Emperor",
			action : function() {
				beforeArcanaInfo( "emperor", "tarot/emperor.png" );
				vn.say( "Elizabeth", "The Emperor symbolizes the desire to control one's surroundings, and its appearance could suggest that one is trying too hard to achieve this, possibly causing trouble for others; some elements in life are just not controllable." );
				afterArcanaInfo( "emperor" );
			}
		},
		{
			label : "Hierophant",
			action : function() {
				beforeArcanaInfo( "hierophant", "tarot/hierophant.png" );
				vn.say( "Elizabeth", "The Hierophant is a symbol of education, authority, conservatism, obedience to rules and relationship with the divine." );
				afterArcanaInfo( "hierophant" );
			}
		},
		{
			label : "Lovers",
			action : function() {
				beforeArcanaInfo( "lovers", "tarot/lovers.png" );
				vn.say( "Elizabeth", "The Lovers Arcana initially represented two paths life could lead to, and thus a symbol of standing at a crossroad and needing to make a decision." );
				vn.say( "Elizabeth", "Later, it is portrayed more of a symbol of love and romantic relationships, although it can also be a symbol of finding agreement with an ordinary friend or even two conflicting elements within." );
				afterArcanaInfo( "lovers" );
			}
		},
		{
			label : "Chariot",
			action : function() {
				beforeArcanaInfo( "chariot", "tarot/chariot.png" );
				vn.say( "Elizabeth", "Portrayed as a king leading a chariot made up of two differently colored horses (in some cases mythical creatures)." );
				vn.say( "Elizabeth", "The Chariot Arcana is a symbol of victory, conquest, self-assertion, control, war and command." );
				vn.say( "Elizabeth", "Characters who are of the Chariot Arcana are typically very driven individuals, who have a personal goal that they aim to achieve at any cost." );
				afterArcanaInfo( "chariot" );
			}
		},
		{
			label : "Justice",
			action : function() {
				beforeArcanaInfo( "justice", "tarot/justice.png" );
				vn.say( "Elizabeth", "Portrayed as a woman holding a sword and balance, the Justice Arcana symbolizes a strict allegory of justice, objectivity, rationality and analysis." );
				vn.say( "Elizabeth", "Characters of the Justice Arcana are concerned with matters of fairness, and otherwise are very stoic individuals." );
				afterArcanaInfo( "justice" );
			}
		},
		{
			label : "Hermit",
			action : function() {
				beforeArcanaInfo( "hermit", "tarot/hermit.png" );
				vn.say( "Elizabeth", "Portrayed as an old man in a dark place or cave, holding up a lantern" );
				vn.say( "Elizabeth", "The Hermit is associated with wisdom, introspection, solitude, retreat and philosophical searches." );
				vn.say( "Elizabeth", "Hermit individuals hide away from others or act in more supportive roles rather than putting themselves in the spotlight." );
				afterArcanaInfo( "hermit" );
			}
		},
		{
			label : "Fortune",
			action : function() {
				beforeArcanaInfo( "fortune", "tarot/fortune.png" );
				vn.say( "Elizabeth", "Portrayed as a wheel with different animals wearing wealthy and beggarly clothes up and down the wheel" );
				vn.say( "Elizabeth", "The Fortune Arcana symbolizes Fate and varying luck, fortunes and opportunities. What goes up will go down, what goes down will go up." );
				vn.say( "Elizabeth", "Bearers of the Fortune Arcana are usually individuals who are aware of their fates, and attempt to seize their own destiny in spite of their seemingly-locked fates." );
				afterArcanaInfo( "fortune" );
			}
		},
		{
			label : "Strength",
			action : function() {
				beforeArcanaInfo( "strength", "tarot/strength.png" );
				vn.say( "Elizabeth", "Portrayed as a young woman holding up a terrifying beast (more often a lion)" );
				vn.say( "Elizabeth", "The Strength Arcana symbolizes an imagery beyond the Beast And Beauty, and is associated with the morality about the stronger power of self-control, gentleness, courage and virtue over brute force." );
				vn.say( "Elizabeth", "Strength characters are not upset easily and have a strong heart" );
				afterArcanaInfo( "strength" );
			}
		},
		{
			label : "Hanged Man",
			action : function() {
				beforeArcanaInfo( "hangedman", "tarot/hangedman.png" );
				vn.say( "Elizabeth", "Portrayed as a man hanging upside-down from one leg with his other leg crossing it, forming a 4" );
				vn.say( "Elizabeth", "The Hanged Man Arcana is associated with self-sacrifice for the sake of enlightenment, the bindings that makes one free, paradoxes and hanging between heaven and earth." );
				vn.say( "Elizabeth", "Hanged Man characters are sometimes self-sacrificial, but are more often notable for being caught between two different extremes, parties or stages in life." );
				afterArcanaInfo( "hangedman" );
			}
		},
		{
			label : "Death",
			action : function() {
				beforeArcanaInfo( "death", "tarot/death.png" );
				vn.say( "Elizabeth", "Portrayed by the drawing of a skeleton wielding a scythe, which led people to call it Death" );
				vn.say( "Elizabeth", "The Death Arcana symbolizes the metamorphosis and deep change, regeneration and cycles" );
				afterArcanaInfo( "death" );
			}
		},
		{
			label : "Temperance",
			action : function() {
				beforeArcanaInfo( "temperance", "tarot/temperance.png" );
				vn.say( "Elizabeth", "Portrayed as a woman with angel wings mixing up the water of two cups, one blue, the other red" );
				vn.say( "Elizabeth", "The Temperance Arcana is a symbol of synthesis, prudence, harmony, and the merging of opposites." );
				vn.say( "Elizabeth", "Characters of the Temperance Arcana are often struggling to find a balance in their lives and in their hobbies." );
				afterArcanaInfo( "temperance" );
			}
		},
		{
			label : "Devil",
			action : function() {
				beforeArcanaInfo( "devil", "tarot/devil.png" );
				vn.say( "Elizabeth", "Portrayed as a hermaphrodite devil over two naked and chained figures" );
				vn.say( "Elizabeth", "The negative aspect of the Devil Arcana represents the urge to do selfish, impulsive, violent things and be slave to ones' own impulse and feelings." );
				vn.say( "Elizabeth", "The positive aspect, however, represents a healthy bond or commitment." );
				vn.say( "Elizabeth", "Characters associated with the Devil Arcana are often 'devilish' individuals; they can be greedy, proud, lusty, or otherwise of poor character." );
				afterArcanaInfo( "devil" );
			}
		},
		{
			label : "Tower",
			action : function() {
				beforeArcanaInfo( "tower", "tarot/tower.png" );
				vn.say( "Elizabeth", "Portrayed as a tower stricken by lightning, from which two small figures fall down; a straight Tower of Babel allegory about pride preceding the fall." );
				vn.say( "Elizabeth", "The Tower Arcana is commonly associated to overly arrogant, prejudiced and authoritarian organization, which walk to their own ironic demise." );
				vn.say( "Elizabeth", "Characters of the Tower Arcana can be arrogant, and typically find themselves in bad situations where they themselves have fallen from grace." );
				afterArcanaInfo( "tower" );
			}
		},
		{
			label : "Star",
			action : function() {
				beforeArcanaInfo( "star", "tarot/star.png" );
				vn.say( "Elizabeth", "The Star Arcana is also commonly associated with hope, self-confidence, faith, altruism, luck, generosity, peace and joy." );
				vn.say( "Elizabeth", "Characters of the Star Arcana embody their arcana's traits of hopefulness and joy." );
				afterArcanaInfo( "star" );
			}
		},
		{
			label : "Moon",
			action : function() {
				beforeArcanaInfo( "moon", "tarot/moon.png" );
				vn.say( "Elizabeth", "Portrayed as two dogs howling at the Moon around a pool with a lobster in it, with two towers in the background" );
				vn.say( "Elizabeth", "The Moon Arcana is associated with creativity, inspiration, dreams, madness, illusions, fear, fantasy, the subconscious and trickery." );
				vn.say( "Elizabeth", "It can also represent being attuned subconsciously to the world around, gaining the ability to sense things without being told about them or without anyone else knowing." );
				vn.say( "Elizabeth", "Characters who are of the Moon Arcana are often similarly psychically-attuned, but a more common trend is their projection of their own fears and faults onto others." );
				vn.say( "Elizabeth", "They often tend to have trouble accepting themselves for who they are and, because of that fear, try to correspond to an ideal person." );
				afterArcanaInfo( "moon" );
			}
		},
		{
			label : "Sun",
			action : function() {
				beforeArcanaInfo( "sun", "tarot/sun.png" );
				vn.say( "Elizabeth", "Portrayed as two children holding hands under a blazing sun" );
				vn.say( "Elizabeth", "The Sun symbolizes happiness, joy, energy, optimism, and accomplishment." );
				vn.say( "Elizabeth", "Characters of the Sun Arcana almost always (ironically) find themselves in terrible situations, the situation betrays the underlying optimism present in nearly all of them." );
				afterArcanaInfo( "sun" );
			}
		},
		{
			label : "Judgement",
			action : function() {
				beforeArcanaInfo( "judgement", "tarot/judgement.png" );
				vn.say( "Elizabeth", "The Judgment Arcana is associated with realizing one's calling, gaining a deep understanding of life, and a feeling of acceptance and absolution." );
				afterArcanaInfo( "judgement" );
			}
		},
		{
			label : "World",
			action : function() {
				beforeArcanaInfo( "world", "tarot/world.png" );
				vn.say( "Elizabeth", "Portrayed as a young woman (or hermaphrodite, depending on deck) surrounded by figures of an angel, a bull, an eagle, and a lion" );
				vn.say( "Elizabeth", "The World Arcana is a representation of the world's totality, the symbol of fulfillment, wholeness, and harmony." );
				afterArcanaInfo( "world" );
			}
		},
		{
			label : "Done",
			action : function() {
				vn.setNovelMode( "dialog", 280, 130, 50, 100 );
			}
		}
	];

	var learnAboutPersonaChoices = [
		{
			label : "What's a persona?",
			action : function() {

				vn.setNovelMode( "dialog", 280, 330, 10, 20 );
				vn.say( "Elizabeth", "A persona is the facet of our personality that surfaces as we react to external stimuli." );
				vn.say( "Elizabeth", "It is like a mask that we wear as we brave through many hardships." );
				vn.say( "Elizabeth", "In the Persona game, a persona is represented by one of many arcanas:" );
				vn.showSayDialog( false );
				vn.setNovelMode( "dialog", 280, 330, 10, 100 );

				// show menu of arcanas
				vn.choice(
					"learnAboutArcana",
					ArcanaList
				);
				vn.showSayDialog( false );

				vn.repeatEvent();
			}
		},
		{
			label : "Who are you?",
			action : function() {
				vn.setNovelMode( "dialog", 680, 130, 10, 420 );
				vn.addCondition( "askName", "=", "true",
					function success() {
						vn.say( "Elizabeth", "Did you already forget?" );
						vn.say( "Elizabeth", "My name is Elizabeth." );
					},
					function fail() {
						vn.say( "Elizabeth", "My name is Elizabeth" );
					}
				);
				vn.setValue( "askName", "true" );
				vn.showSayDialog( false );

				vn.repeatEvent();
			}
		},
		{
			label : "Exit",
			action : function() {
				vn.setNovelMode( "dialog", 680, 130, 10, 420 );
				vn.moveCharacter( elizabeth, 0.2, 0, 500 );
				vn.say( "Elizabeth", "I hope you enjoyed it.", 2000 );
			}
		}
	];

	// Show menu of choices:
	// 1. What's a persona
	// 2. Who are you?
	// 3. Exit
	vn.choice(
		"learnAboutPersona",
		learnAboutPersonaChoices,
		{ x : 0.1,  y : 0.3 },
		{ image : "character/el0_pe_000.png", width : 100, height : 100 }
	);

	vn.say( "Elizabeth", "See you again!", 2000 );
	vn.showSayDialog( false );

	// remove character
	vn.moveCharacter( elizabeth, 1.0, 0, 500 );
	vn.fadeCharacter( elizabeth, "out", 500 );

	// fade out bg
	vn.fadeBg( "out", 500 );
	vn.pause( 500 );
	vn.resetBg( "fade" );

	// Go back to start screen
	vn.reset();

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