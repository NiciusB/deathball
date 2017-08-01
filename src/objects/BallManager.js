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
      pos = new Phaser.Point(launcher.body.x + rot.x * launcher.height / 2 * 1.5, launcher.body.y + rot.y * launcher.width / 2 * 1.5)
    }
    this.ball = new Ball(this.game, pos)
    this.add(this.ball)
    if (launcher) {
      this.ball.body.velocity.x = launcher.launchForce * rot.x
      this.ball.body.velocity.y = launcher.launchForce * rot.y
    }
  }

  attractTo(x, y) {
    const size = 200
    const attraction = 20
    var attractionArea = new Phaser.Ellipse(x - size / 2, y - size / 2, size, size)
    this.forEachAlive(function (ball) {
      if (attractionArea.contains(ball.x, ball.y)) {
        ball.body.x = (ball.body.x * (attraction - 1) / attraction) + (x / attraction)
        ball.body.y = (ball.body.y * (attraction - 1) / attraction) + (y / attraction)
      }
    }, this)
  }
}

export default BallManager
