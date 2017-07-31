class Field extends Phaser.Group {
  constructor(game, playerManager) {
    super(game)
    this.enableBody = true
    this.playerManager = playerManager
    var spacing = new Phaser.Sprite(game, game.world.width / 2, game.world.height / 2, getFieldTexture(game))
    spacing.anchor.setTo(0.5, 0.5)
    this.add(spacing)
    spacing.body.immovable = true
  }
  update() {
    this.game.physics.arcade.collide(this, this.playerManager)
  }
}

function getFieldTexture(game) {
  let bmd = game.add.bitmapData(720, 10)
  bmd.ctx.beginPath()
  bmd.ctx.rect(0, 0, 720, 10)
  bmd.ctx.fillStyle = '#f33'
  bmd.ctx.fill()
  return bmd
}

export default Field