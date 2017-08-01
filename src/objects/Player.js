import PlayerSprite from 'objects/PlayerSprite'
class Player extends Phaser.Group {

  constructor(playerID, playerManager, game, gamepad, state) {
    super(state.game)

    // PlayerSprite
    this.player = new PlayerSprite(playerID, this, state, gamepad)
    this.add(this.player)

    // Arrow
    this.arrow = new Phaser.Sprite(game, 0, 0, 'arrow')
    this.arrow.anchor.setTo(0.5, 0.5)
    this.arrow.y = -35
    this.player.addChild(this.arrow)

    // Emitter
    this.emitter = new Phaser.Particles.Arcade.Emitter(game, 0, 0)
    this.emitter.makeParticles('smoke')
    this.emitter.setAlpha(1, 0, 350)
    this.emitter.setScale(0.4, 0.2, 0.4, 0.2, 350)
    this.emitter.start(false, 350, 25)
    this.player.addChild(this.emitter)
  }
  postUpdate() {
    super.postUpdate()
    // Arrow
    if (this.player.hasBall) {
      this.arrow.loadTexture('arrowActive')
    } else {
      this.arrow.loadTexture('arrow')
    }
  }
}

export default Player
