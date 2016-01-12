function MenuState(game) {
  this.game = game;
  this.ctx = game.ctx;

  this.startButton = new Button(
    game.width / 2,
    game.height * .2,
    150,
    60,
    "NORMAL",
    () => {
      game.state = new GameState(game);
    },
    .5,
    .5
  );
};

MenuState.prototype.draw = function() {
  this.startButton.draw(this.ctx);
};

MenuState.prototype.update = function() {};
