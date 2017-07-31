import PlayerManager from 'objects/PlayerManager'
import BallManager from 'objects/BallManager'
import Field from 'objects/Field'

class GameState extends Phaser.State {

	create() {		
		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.game.stage.backgroundColor = "#4488AA"
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		this.ballManager = new BallManager(this.game)
		this.playerManager = new PlayerManager(this.game, this.ballManager)
		this.field = new Field(this.game, this.playerManager)

	}

}

export default GameState
