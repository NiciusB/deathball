class Player extends Phaser.Sprite {
  constructor(playerID, player, state, gamepad) {
    // Phaser Sprite
    super(player.game, 0, 0, 'player' + playerID)
    this.anchor.setTo(0.5, 0.5)

    // Props
    this.player = player
    this.state = state
    this.gamepad = gamepad
    this.playerID = playerID

    // Stats
    this.health = 100
    this.speed = 900
    this.drift = 15
    this.rotationSpeed = 10
    this.launchForce = 2500
    this.recentlyDamaged = false
    this.hasBall = false

    // Gamepad
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER).onDown.add(this.throwBall, this)
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(this.throwBall, this)
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(() => {
      this.game.physics.p2.paused = !this.game.physics.p2.paused
    }, this)
    this.gamepad.getButton(Phaser.Gamepad.XBOX360_BACK).onDown.add(() => {
      window.document.location.reload()
    }, this)

    // Physics
    this.game.physics.p2.enable(this)
    this.body.mass = 25
    this.body.fixedRotation = true
    this.body.collideWorldBounds = true
    this.initializePosition()
    this.events.onKilled.add(this.onKilled, this)
    this.events.onRevived.add(this.onRevived, this)

    // Collision with ball
    this.body.onBeginContact.add(this.contactHandler, this)
  }
  update() {
    super.update()
    if (this.alive) {
      // recentlyDamaged blink
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
      this.rotation = this.body.rotation // Sprite doesn't rotate automatically because of fixedRotation=true

      // Field limits
      if (this.playerID % 2) {
        if (this.body.velocity.y > 0 && this.y > this.game.world.height / 2 - 10 - this.height / 2) this.body.velocity.y = 0
      } else {
        if (this.body.velocity.y < 0 && this.y < this.game.world.height / 2 + 10 + this.height / 2) this.body.velocity.y = 0
      }
      // Ball atraction
      if (this.actionButtonPressed()) {
        this.state.ballManager.attractTo(this.x, this.y)
      }
    }
  }

  throwBall() {
    if (this.hasBall) {
      this.game.camera.shake(0.001, 100)
      this.state.ballManager.addBall(this)
      this.hasBall = false
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
    this.game.camera.shake(0.01, 500)
    this.initializePosition()
    setTimeout((player) => {
      player.revive(player.maxHealth)
    }, 1000, this)
  }

  damage(damage) {
    this.game.camera.shake(0.003, 200)
    super.damage(damage)
    this.setRecentlyDamaged()
  }

  actionButtonPressed() {
    return this.gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER, 350) ||
      this.gamepad.justPressed(Phaser.Gamepad.XBOX360_A, 350)
  }

  contactHandler(element) {
    if (element && element.sprite) {
      var sprite = element.sprite
      if (sprite.custom)
        switch (sprite.custom.type) {
          case 'Ball':
            if (this.actionButtonPressed()) {
              sprite.destroy()
              this.hasBall = true
            } else if (!this.recentlyDamaged) {
              this.damage(50)
            }
            break;
        }
    }
  }
}

export default Player
