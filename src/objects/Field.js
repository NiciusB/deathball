class Field extends Phaser.Group {
  constructor(game) {
    super(game)
    var background = new Phaser.Sprite(game, 0, 0, 'background')
    this.add(background)
  }
}

export default Field