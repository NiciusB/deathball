import PlayerManager from 'objects/PlayerManager'
import BallManager from 'objects/BallManager'
import Field from 'objects/Field'
import TrumpsWall from 'objects/TrumpsWall'

class GameState extends Phaser.State {

	create() {
		this.game.physics.startSystem(Phaser.Physics.P2JS)
		this.game.physics.p2.defaultRestitution = 0.75
		this.game.physics.p2.world.defaultContactMaterial.friction = 0
		this.game.physics.p2.setImpactEvents(true)
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		this.field = new Field(this.game)
		this.trumpsWall = new TrumpsWall(this.game)
		this.ballManager = new BallManager(this)
		this.playerManager = new PlayerManager(this)
	}
	preload() {
		this.game.load.image('background', 'assets/background.jpg')
		this.game.load.image('player1', 'assets/player1.jpg')
		this.game.load.image('player2', 'assets/player2.jpg')
		this.game.load.image('arrow', 'assets/arrow.png')
		this.game.load.image('arrowActive', 'assets/arrowActive.png')
		this.game.load.image('smoke', 'assets/smoke.png')
	}

}

export default GameState
