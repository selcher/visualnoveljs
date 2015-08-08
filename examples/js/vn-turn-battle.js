function TurnBattle( playerStatus, enemyStatus ) {

	// turn based battle

	// Player
	function Player( status ) {

		if ( this instanceof Player ) {
			this.name = status.name;
			this.level = status.level;
			this.class = status.class;
			this.hp = status.hp;
			this.mp = status.mp;
			this.atk = status.atk;
			this.def = status.def;
			this.image = status.image;
			this.imageStyle = status.imageStyle;

			return this;
		} else {
			return new Player( status );
		}
	}

	Player.prototype.isAlive = function isAlive() {
		return this.hp > 0;
	};

	Player.prototype.attack = function attack( enemy ) {
		var damage = this.atk > enemy.def ? this.atk - enemy.def : 0;
		enemy.hp -= damage;
	};

	Player.prototype.turn = function turn( enemy ) {
		// show actions menu
	};
	

	// Enemy extends player
	function Enemy( status ) {

		if ( this instanceof Enemy ) {
			Player.call( this, status );

			return this;
		} else {
			return new Enemy( status );
		}
	}

	Enemy.prototype = Object.create( Player.prototype );
	Enemy.prototype.constructor = Enemy;

	Enemy.prototype.turn = function turn( player ) {
		// var damage = player.def < this.atk ? this.atk - player.def : 0;
		// player.hp -= damage;
		this.attack( player );
	};





	function TurnBattle( turn, player, enemy ) {
		
		this.turn = turn;
		this.end = false;

		this.player = player;
		this.enemy = enemy;

	}

	TurnBattle.prototype.next = function next() {

		console.log( 'turn: ' + this.turn );

		if ( this.turn === 'player' ) {
			this.player.turn( this.enemy );
		} else if ( this.turn === 'enemy' ) {
			this.enemy.turn( this.player );
		}

		this.updateScreen();

		if ( !this.player.isAlive() || !this.enemy.isAlive() ) {

			console.log( 'battle: end' );

			var battleEnd = document.createEvent( 'Event' );
			battleEnd.initEvent( 'end', true, true );
			battleEnd.winner = this.player.isAlive() ? 'player' : 'enemy';
			document.dispatchEvent( battleEnd );

		} else {

			if ( this.turn === 'player' ) {

			} else if ( this.turn === 'enemy' ) {
				// setTimeout( function() {
				this.turn = 'player';
				this.next();
				// }.bind( this ), 1000 );
			}

		}
	};

	TurnBattle.prototype.updateScreen = function updateScreen() {

		console.log( 'update screen' );

		var self = this;
		var displayPlayerActionMenu = this.turn === 'player' ? '' :
			'display:none;';
		var screen = '<div class="player-status">' +
			'name: ' + this.player.name + '<br/>' +
			'hp: ' + this.player.hp + '<br/>' +
			'mp: ' + this.player.mp +
			'</div>' +
			'<div class="enemy-status">' +
			'name: ' + this.enemy.name + '<br/>' +
			'hp: ' + this.enemy.hp + '<br/>' +
			'mp: ' + this.enemy.mp +
			'</div>' +
			'<div id="player-action" style="' + displayPlayerActionMenu + '">' +
			'<input id="player-action-attack" type="button" value="Attack" /><br/>' +
			'<input id="player-action-defend" type="button" value="Defend" />' +
			'</div>' +
			'<div style="clear:both;">' +
			'<img src="' + this.player.image + '" style="' + this.player.imageStyle + '" />' +
			'<img src="' + this.enemy.image + '" style="' + this.enemy.imageStyle + '" />' +
			'</div>';

		document.getElementById( 'tbb' ).innerHTML = screen;
		document.getElementById( 'player-action-attack' ).onclick = function onPlayerAttack() {

			console.log( 'click: attack' );
			self.player.attack( self.enemy );

			self.turn = 'enemy';
			self.next();
			
		};
	};





	// Init battle
	var player = new Player( playerStatus );
	var enemy = new Enemy( enemyStatus );
	var battle = new TurnBattle( 'player', player, enemy );

	battle.updateScreen();

}