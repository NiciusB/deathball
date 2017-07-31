class Player extends Phaser.Sprite {

  constructor(playerID, playerManager, game, gamepad, state) {
    super(game, 0, 0, 'player' + playerID)

    this.anchor.setTo(0.5, 0.5)

    this.playerID = playerID
    this.gamepad = gamepad
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER).onDown.add(this.rightTriggerPressed, this)
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(() => {
      game.physics.p2.paused = !game.physics.p2.paused
    }, this)
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_BACK).onDown.add(() => {
      window.document.location.reload()
    }, this)
    this.ballManager = state.ballManager
    this.state = state

    this.health = 100
    this.speed = 900
    this.drift = 15
    this.rotationSpeed = 10
    this.launchForce = 2500
    this.recentlyDamaged = false

    this.game.physics.p2.enable(this)
    this.body.mass = 200
    this.body.fixedRotation = true
    this.body.collideWorldBounds = true
    this.initializePosition()
    this.events.onKilled.add(this.onKilled, this)
    this.events.onRevived.add(this.onRevived, this)

    // Emitter
    this.emitter = new Phaser.Particles.Arcade.Emitter(game, this.x, this.y)
    this.emitter.makeParticles('smoke')
    this.emitter.setAlpha(1, 0, 350)
    this.emitter.setScale(0.4, 0.2, 0.4, 0.2, 350)
    this.emitter.start(false, 350, 25)
    playerManager.add(this.emitter)

    // Add Player
    playerManager.add(this)

    // Arrow
    this.arrow = new Phaser.Sprite(game, 0, 0, 'arrow')
    this.arrow.anchor.setTo(0.5, 0.5)
    this.arrow.visible = false
    playerManager.add(this.arrow)

    // Collision with ball
    this.body.onBeginContact.add(this.contactHandler, this)
  }
  postUpdate() {
    super.postUpdate()
    // Arrow
    this.arrow.visible = this.visible
    if (this.arrow.visible) {
      if (this.hasBall()) {
        this.arrow.loadTexture('arrowActive')
      } else {
        this.arrow.loadTexture('arrow')
      }
      let rot = new Phaser.Point(Math.sin(this.body.rotation), -Math.cos(this.body.rotation))
      let pos = new Phaser.Point(this.body.x + rot.x * this.width / 2, this.body.y + rot.y * this.height / 2)
      this.arrow.rotation = this.body.rotation
      this.arrow.x = pos.x
      this.arrow.y = pos.y
    }

    // Emitter
    this.emitter.x = this.x
    this.emitter.y = this.y
  }
  update() {
    super.update()
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
    } else {
      this.arrow.visible = false
    }
  }

  hasBall() {
    return this.ballManager.ballOwner === this.playerID
  }

  rightTriggerPressed() {
    if (this.hasBall()) {
      if (this.gamepad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
        this.game.camera.shake(0.001, 100)
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
    this.emitter.revive()
    this.emitter.start(false, 350, 25)
    this.recentlyDamaged = false
    this.setRecentlyDamaged(1500)
  }

  onKilled() {
    this.game.camera.shake(0.01, 500)
    this.emitter.kill()
    this.initializePosition()
    setTimeout((player) => {
      player.revive(player.maxHealth)
    }, 1000, this)
  }

  damage(damage) {
    this.game.camera.shake(0.002, 300)
    super.damage(damage)
    this.setRecentlyDamaged()
  }
  contactHandler(element) {
    if (element && element.sprite === this.ballManager.ball) {
      if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER, 350)) {
        this.ballManager.removeBall(this.playerID)
      } else if (!this.recentlyDamaged) {
        this.damage(50)
      }
    }
  }
}

export default Player
