import Player from 'objects/Player'

class PlayerManager extends Phaser.Group {
  constructor(state) {
    super(state.game)
    this.player_n = 0

    this.game.input.gamepad.start()
    this.game.input.gamepad.addCallbacks(this, {
      onConnect: function (padIndex) {
        new Player(++this.player_n, this, this.game, this.game.input.gamepad._gamepads[padIndex], state)
      }
    })
  }
}

export default PlayerManager
