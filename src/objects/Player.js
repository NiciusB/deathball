class Player extends Phaser.Sprite {

  constructor(playerID, playerManager, game, gamepad, ballManager) {
    super(game, 0, 0, getPlayerTexture(game))
    this.anchor.setTo(0.5, 0.5)

    this.playerID = playerID
    this.gamepad = gamepad
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER).onDown.add(this.rightTriggerPressed, this)
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(() => {
      window.document.location.reload()
    }, this)
    this.ballManager = ballManager

    this.health = 100
    this.speed = 900
    this.drift = 15
    this.rotationSpeed = 10
    this.launchForce = 2500
    this.recentlyDamaged = false

    playerManager.add(this)
    this.body.mass=200
    this.body.fixedRotation = true
    this.body.collideWorldBounds = true
    this.initializePosition()
    this.events.onKilled.add(this.onKilled, this)
    this.events.onRevived.add(this.onRevived, this)

    // Collision with ball
    this.body.onBeginContact.add(this.contactHandler, this)
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
        if (destinationAngle - this.body.angle > 180) destinationAngle -= 360
        if (destinationAngle - this.body.angle < -180) destinationAngle += 360
        var realRotSpeed = (1 / (this.rotationSpeed / 100))
        this.body.angle = this.body.angle * (realRotSpeed - 1) / realRotSpeed + destinationAngle / realRotSpeed
      }
      this.rotation = this.body.rotation

      // Field limits
      if (this.playerID % 2) {
        if (this.body.velocity.y > 0 && this.y > this.game.world.height / 2 - 10 - this.height / 2) this.body.velocity.y = 0
      } else {
        if (this.body.velocity.y < 0 && this.y < this.game.world.height / 2 + 10 + this.height / 2) this.body.velocity.y = 0
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
    this.body.angle = this.playerID % 2 ? 180 : 0
    this.body.reset(this.game.world.width / 2, this.playerID % 2 ? 100 : this.game.world.height - 100, true)
    this.body.setZeroVelocity()
  }

  setRecentlyDamaged(duration = 850) {
    this.recentlyDamaged = true
    setTimeout((player) => {
      player.recentlyDamaged = false
    }, duration, this)
  }

  onRevived() {
    this.recentlyDamaged = false
    this.setRecentlyDamaged(1500)
  }

  onKilled() {
    this.initializePosition()
    setTimeout((player) => {
      player.revive(player.maxHealth)
    }, 1000, this)
  }

  damage(damage) {
    super.damage(damage)
    this.setRecentlyDamaged()
  }
  contactHandler(element) {
    if (element && element.sprite === this.ballManager.ball) {
      if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER, 250)) {
        this.ballManager.removeBall(this.playerID)
        this.loadTexture(getPlayerTextureWithBall(this.game))
      } else if (!this.recentlyDamaged) {
        this.damage(50)
      }
    }
  }
}

function getPlayerTexture(game) {
  let bmd = game.add.bitmapData(64, 64)
  bmd.ctx.beginPath()
  bmd.ctx.rect(0, 0, 64, 64)
  bmd.ctx.fillStyle = '#BAFFC9'
  bmd.ctx.fill()
  bmd.ctx.beginPath()
  bmd.ctx.rect(26, 0, 12, 12)
  bmd.ctx.fillStyle = '#fff'
  bmd.ctx.fill()
  return bmd
}
function getPlayerTextureWithBall(game) {
  let bmd = getPlayerTexture(game)
  var size = 16
  bmd.ctx.beginPath()
  bmd.ctx.arc(24 + size / 2, size / 2, size / 2, 0, 2 * Math.PI)
  bmd.ctx.fillStyle = '#DD5E3E'
  bmd.ctx.fill()
  return bmd
}

export default Player
