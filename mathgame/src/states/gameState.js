function GameState(game, difficulty) {
  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('game-bg');

  this.difficulty = difficulty;
  this.lifes = new Lifes(3, this.ctx);
  this.score = new Score();

  this.keyboard = new Keyboard(this);
  this.numberField = new NumberField(this);
  this.questions = new Questions(this, difficulty);

  this.backButton = new Button(
    5,
    40,
    "",
    "back-arrow-btn",
    () => {
      game.state = new MenuState(game);
    },
    "",
    0,
    0
  );
};

GameState.prototype.draw = function() {
  this.ctx.drawImage(this.bg, 0, 0);

  this.questions.draw(this.ctx);
  this.lifes.draw(this.ctx);
  this.score.draw(this.ctx);
  this.backButton.draw(this.ctx);
  this.numberField.draw(this.ctx);
  this.keyboard.draw(this.ctx);

};

GameState.prototype.update = function() {
  this.questions.update();
  this.keyboard.update();
  this.backButton.update();

  if (this.lifes.lifes < 1){
    this.game.state = new EndState(this.game, this.score.points, this.difficulty);
  }
};
