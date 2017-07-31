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
      rot = new Phaser.Point(Math.sin(launcher.body.rotation), -Math.cos(launcher.body.rotation))
      pos = new Phaser.Point(launcher.body.x + rot.x * launcher.height/2 * 1.5, launcher.body.y + rot.y * launcher.width/2 * 1.5)
    }
    this.ball = new Ball(this.game, pos)
    this.game.add.existing(this.ball)
    if (launcher) {
      this.ball.body.velocity.x = launcher.launchForce * rot.x
      this.ball.body.velocity.y = launcher.launchForce * rot.y
    }
    this.ballOwner = false
  }
}

export default BallManager
