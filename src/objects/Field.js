class Field extends Phaser.Group {
  constructor(game) {
    super(game)
    var spacing = new Phaser.Sprite(game, game.world.width / 2, game.world.height / 2, getFieldTexture(game))
    spacing.anchor.setTo(0.5, 0.5)
    this.add(spacing)
  }
}

function getFieldTexture(game) {
  let bmd = game.add.bitmapData(720, 10)
  bmd.ctx.beginPath()
  bmd.ctx.rect(0, 0, 720, 10)
  bmd.ctx.fillStyle = '#000'
  bmd.ctx.fill()
  return bmd
}

export default Field