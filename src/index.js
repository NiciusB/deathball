import GameState from 'states/GameState'

class Game extends Phaser.Game {

	constructor() {
		super(720, 960, Phaser.AUTO, 'content', null, true)
		
		this.state.add('GameState', GameState, false)
		this.state.start('GameState')
	}

}

new Game()
