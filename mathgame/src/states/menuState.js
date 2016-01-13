function MenuState(game) {
  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('menu-bg');

  this.startButtonEasy = new Button(
    game.width / 2,
    game.height * .4,
    "EASY",
    'menu-btn',
    () => {
      console.log('ahoj');
      game.state = new GameState(game, 0);
    },
    "#0a7bff",
    .5,
    .5
  );
  this.startButtonNormal = new Button(
    game.width / 2,
    game.height * .5,
    "NORMAL",
    'menu-btn',
    () => {
      game.state = new GameState(game, 1);
    },
    "#0a7bff",
    .5,
    .5
  );

  this.soundButton = new Button(
    game.width / 2,
    game.height * .8,
    "",
    'sound',
    () => {
      console.log('sup');
      this.toggleSound();
    },
    "#fff",
    .5,
    .5
  )
};

MenuState.prototype.draw = function() {
  this.ctx.drawImage(this.bg, 0, 0);
  this.startButtonEasy.draw(this.ctx);
  this.startButtonNormal.draw(this.ctx);
  this.soundButton.draw(this.ctx);
};

MenuState.prototype.update = function() {
  this.startButtonEasy.update();
  this.startButtonNormal.update();
  this.soundButton.update();
};

MenuState.prototype.toggleSound = function() {
  console.log('ahoj');
  this.soundButton.image = Resources.getImage('sound-off');
}
