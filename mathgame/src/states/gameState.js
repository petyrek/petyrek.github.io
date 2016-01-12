function GameState(game) {
  this.game = game;
  this.ctx = game.ctx;

  this.lifes = new Lifes(3);
  this.score = new Score();

  this.keyboard = new Keyboard(this);
  this.numberField = new NumberField(this);
  this.questions = new Questions(this);
};

GameState.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.game.width, this.game.height);

  this.questions.draw(this.ctx);
  this.lifes.draw(this.ctx);
  this.score.draw(this.ctx);
  this.keyboard.draw(this.ctx);
  this.numberField.draw(this.ctx);
};

GameState.prototype.update = function() {
  this.questions.update();
};
