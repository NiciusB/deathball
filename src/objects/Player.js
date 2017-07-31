class Player extends Phaser.Sprite {

  constructor(playerID, playerManager, game, gamepad, ballManager) {
    super(game, 0, 0, getPlayerTexture(game))
    this.anchor.setTo(0.5, 0.5)

    this.playerID = playerID
    this.gamepad = gamepad
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER).onDown.add(this.rightTriggerPressed, this)
    this.ballManager = ballManager

    this.health = 100
    this.speed = 900
    this.drift = 20
    this.rotationSpeed = 10
    this.launchForce = 2500
    this.recentlyDamaged = false
    
    playerManager.add(this)
    this.body.collideWorldBounds = true
    this.initializePosition()
    this.events.onKilled.add(this.onKilled, this)
    this.events.onRevived.add(this.onRevived, this)
  }

  update() {
    if (this.alive) {
      if (this.recentlyDamaged) this.visible = !this.visible
      else this.visible = true
      // Movement with left stick
      var leftStickX = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) || 0
      var leftStickY = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) || 0
      this.body.velocity.x = this.body.velocity.x * (this.drift - 1) / this.drift + this.speed * leftStickX / this.drift
      this.body.velocity.y = this.body.velocity.y * (this.drift - 1) / this.drift + this.speed * leftStickY / this.drift

      // Rotation with right stick
      var rightStickX = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) || 0
      var rightStickY = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) || 0
      if (rightStickX !== 0 || rightStickY !== 0) {
        var destinationAngle = (Math.atan2(rightStickX, -rightStickY) * (180 / Math.PI))
        if (destinationAngle - this.body.rotation > 180) destinationAngle -= 360
        if (destinationAngle - this.body.rotation < -180) destinationAngle += 360
        var realRotSpeed = (1 / (this.rotationSpeed / 100))
        this.body.rotation = Math.round(this.body.rotation * (realRotSpeed - 1) / realRotSpeed + destinationAngle / realRotSpeed)
      }

      // Collision with ball
      if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER, 250)) {
        this.game.physics.arcade.overlap(this, this.ballManager.ball, this.ballCatchedHandler, null, this)
      } else if (!this.recentlyDamaged) {
        this.game.physics.arcade.overlap(this, this.ballManager.ball, this.ballCollisionHandler, null, this)
      }
    }
  }

  rightTriggerPressed() {
    if (this.ballManager.ballOwner === this.playerID) {
      if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
        this.loadTexture(getPlayerTexture(this.game))
        this.ballManager.addBall(this)
      }
    }
  }

  initializePosition() {
    this.position.setTo(this.game.world.width / 2, this.playerID % 2 ? 100 : this.game.world.height - 100)
    this.body.velocity.setTo(0, 0)
    this.rotation = this.playerID % 2 ? Math.PI : 0
  }

  onRevived() {
    this.recentlyDamaged = false
  }
  
  onKilled() {
    this.initializePosition()
    setTimeout((player) => {
      player.revive(player.maxHealth)
    }, 1000, this)
  }

  damage(damage) {
    super.damage(damage)
    if (this.alive) {
      this.recentlyDamaged = true
      setTimeout((player) => {
        player.recentlyDamaged = false
      }, 850, this)
    }
  }

  ballCollisionHandler(player, ball) {
    player.damage(50)
    if (player.alive) {
      ball.body.velocity.multiply(0.2)
    }
  }

  ballCatchedHandler(player, ball) {
    this.ballManager.removeBall(this.playerID)
    this.loadTexture(getPlayerTextureWithBall(this.game))
  }

}

function getPlayerTexture(game) {
  let bmd = game.add.bitmapData(64, 64)
  bmd.ctx.beginPath()
  bmd.ctx.rect(0, 0, 64, 64)
  bmd.ctx.fillStyle = '#fff'
  bmd.ctx.fill()
  bmd.ctx.beginPath()
  bmd.ctx.rect(26, 0, 12, 12)
  bmd.ctx.fillStyle = '#f00'
  bmd.ctx.fill()
  return bmd
}
function getPlayerTextureWithBall(game) {
  let bmd = getPlayerTexture(game)
  var size = 16
  bmd.ctx.beginPath()
  bmd.ctx.arc(24 + size / 2, size / 2, size / 2, 0, 2 * Math.PI)
  bmd.ctx.fillStyle = '#0f0'
  bmd.ctx.fill()
  return bmd
}

export default Player
