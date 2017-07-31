import Ball from 'objects/Ball'

class BallManager {
  constructor(game) {
    this.game = game
    this.ball = new Ball(this.game)
    this.ballOwner = false
    this.addBall()
  }

  removeBall(owner = false) {
    this.ball.destroy()
    this.ballOwner = owner
  }

  addBall(launcher = false) {
    let pos
    let rot
    if (launcher) {
      rot = new Phaser.Point(Math.sin(launcher.body.rotation / 180 * Math.PI), -Math.cos(launcher.body.rotation / 180 * Math.PI))
      pos = new Phaser.Point(launcher.body.center.x + rot.x * launcher.body.halfHeight * 1.5, launcher.body.center.y + rot.y * launcher.body.halfWidth * 1.5)
    }
    this.ball = new Ball(this.game, pos)
    this.game.add.existing(this.ball)
    if (launcher) {
      this.ball.body.velocity.setTo(
        launcher.launchForce * rot.x,
        launcher.launchForce * rot.y
      )
    }
    this.ballOwner = false
  }
}

export default BallManager
