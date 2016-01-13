function EndState(game, points) {
  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('game-bg');

  this.scoreText = new Text("YOUR SCORE: " + points, this.game.width / 2, this.game.height * .2, '#000', 0.5, 0.5);

  this.backButton = new Button(
    game.width / 2,
    game.height * .8,
    "BACK",
    "menu-btn",
    () => {
      game.state = new MenuState(game);
    },
    "#0a7bff",
    .5,
    .5
  );
};

EndState.prototype.draw = function() {
  this.ctx.drawImage(this.bg, 0, 0);
  this.scoreText.draw(this.ctx);
  this.backButton.draw(this.ctx);
};

EndState.prototype.update = function() {
  this.backButton.update();
};
