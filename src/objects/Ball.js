class Ball extends Phaser.Sprite {
  constructor(game, pos = false) {
    if (!pos) pos = new Phaser.Point(game.world.centerX, game.world.centerY)
    super(game, pos.x, pos.y, getBallTexture(game))
    this.anchor.setTo(0.5, 0.5)

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.body.bounce.set(0.1)
  }
}

function getBallTexture(game) {
  var size = 16
  let bmd = game.add.bitmapData(size, size)
  bmd.ctx.beginPath()
  bmd.ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
  bmd.ctx.fillStyle = '#3f3'
  bmd.ctx.fill()
  return bmd
}

export default Ball