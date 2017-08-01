import Ball from 'objects/Ball'

class BallManager extends Phaser.Group {
  constructor(state) {
    super(state.game)
    this.addBall()
  }

  addBall(launcher = false) {
    let pos
    let rot
    if (launcher) {
      rot = new Phaser.Point(Math.sin(launcher.body.rotation), -Math.cos(launcher.body.rotation))
      pos = new Phaser.Point(launcher.body.x + rot.x * launcher.height/2 * 1.5, launcher.body.y + rot.y * launcher.width/2 * 1.5)
    }
    this.ball = new Ball(this.game, pos)
    this.add(this.ball)
    if (launcher) {
      this.ball.body.velocity.x = launcher.launchForce * rot.x
      this.ball.body.velocity.y = launcher.launchForce * rot.y
    }
  }
}

export default BallManager
