import PlayerManager from 'objects/PlayerManager'
import BallManager from 'objects/BallManager'
import Field from 'objects/Field'

class GameState extends Phaser.State {

	create() {
		this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.defaultRestitution = 0.35
    this.game.physics.p2.world.defaultContactMaterial.friction = 0
    this.game.physics.p2.setImpactEvents(true)
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		this.field = new Field(this.game)
		this.ballManager = new BallManager(this.game)
		this.playerManager = new PlayerManager(this.game, this.ballManager)
	}

}

export default GameState
