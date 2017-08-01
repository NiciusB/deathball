import Player from 'objects/Player'

class PlayerManager extends Phaser.Group {
  constructor(state) {
    super(state.game)
    this.player_n = 0
    this.players = []

    this.game.input.gamepad.start()
    this.game.input.gamepad.addCallbacks(this, {
      onConnect: function (padIndex) {
        this.players[padIndex] = new Player(padIndex + 1, this, this.game, this.game.input.gamepad._gamepads[padIndex], state)
        this.add(this.players[padIndex])
      },
      onDisconnect: function (padIndex) {
        if (this.players[padIndex]) {
          this.players[padIndex].destroy()
          this.players.splice(padIndex, 1)
        }
      }
    })
  }
}

export default PlayerManager
