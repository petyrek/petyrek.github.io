function MenuState(game) {
  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('menu-bg');

  this.game.soundEnabled = localStorage.getItem('soundEnabled') != 'false'

  this.startButton0 = new Button(
    this.ctx.canvas.width / 2,
    this.ctx.canvas.height * .4,
    "TODDLER",
    'menu-btn',
    () => {
      game.state = new GameState(game, 0);
    },
    "#0a7bff",
    .5,
    .5
  );
  this.startButton1 = new Button(
    this.ctx.canvas.width / 2,
    this.ctx.canvas.height * .5,
    "KID",
    'menu-btn',
    () => {
      game.state = new GameState(game, 1);
    },
    "#0a7bff",
    .5,
    .5
  );
  this.startButton2 = new Button(
    this.ctx.canvas.width / 2,
    this.ctx.canvas.height * .6,
    "ADULT",
    'menu-btn',
    () => {
      game.state = new GameState(game, 2);
    },
    "#0a7bff",
    .5,
    .5
  );
  this.startButton3 = new Button(
    this.ctx.canvas.width / 2,
    this.ctx.canvas.height * .7,
    "EXPERT",
    'menu-btn',
    () => {
      game.state = new GameState(game, 3);
    },
    "#0a7bff",
    .5,
    .5
  );
  this.soundButton = new Button(
    this.ctx.canvas.width / 2,
    this.ctx.canvas.height * .9,
    "",
    this.game.soundEnabled? 'sound' : 'sound-off',
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
  this.startButton0.draw(this.ctx);
  this.startButton1.draw(this.ctx);
  this.startButton2.draw(this.ctx);
  this.startButton3.draw(this.ctx);
  this.soundButton.draw(this.ctx);
};

MenuState.prototype.update = function() {
  this.startButton0.update();
  this.startButton1.update();
  this.startButton2.update();
  this.startButton3.update();
  this.soundButton.update();
};

MenuState.prototype.toggleSound = function() {
  if(this.game.soundEnabled){
    this.soundButton.image = Resources.getImage('sound-off');
    this.game.soundEnabled = false;
  }
  else{
    this.soundButton.image = Resources.getImage('sound');
    this.game.soundEnabled = true;
  }
  localStorage.setItem('soundEnabled', this.game.soundEnabled);
}
