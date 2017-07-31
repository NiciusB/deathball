import Player from 'objects/Player'

class PlayerManager extends Phaser.Group {
  constructor(game, ballManager) {
    super(game)
    this.enableBody = true
    this.physicsBodyType = Phaser.Physics.P2JS
    this.ballManager = ballManager
    this.player_n = 0

    this.game.input.gamepad.start()
    this.game.input.gamepad.addCallbacks(this, {
      onConnect: function (padIndex) {
        new Player(++this.player_n, this, this.game, this.game.input.gamepad._gamepads[padIndex], this.ballManager)
      }
    })
  }
}

export default PlayerManager
