class TrumpsWall extends Phaser.Sprite {
  constructor(game) {
    super(game, game.world.centerX, game.world.centerY, normalWall(game))
    this.anchor.setTo(0.5, 0.5)
    game.add.existing(this)
  }
}

function normalWall(game) {
  let bmd = game.add.bitmapData(game.world.width, 10)
  bmd.ctx.beginPath()
  bmd.ctx.rect(0, 0, game.world.width, 10)
  bmd.ctx.fillStyle = '#fff'
  bmd.ctx.fill()
  return bmd
}

export default TrumpsWall
