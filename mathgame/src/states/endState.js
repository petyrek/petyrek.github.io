function EndState(game, points, difficulty) {
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

  this.scores = localStorage.getItem('score' + difficulty) || [];
  if(this.scores.length > 0){
    this.scores = JSON.parse(this.scores);
    this.highscores = [new Text("HIGHSCORES", this.game.width / 2, this.game.height * .35, '#000', 0.5, 0.5)];
    for(let i = 0; i < this.scores.length; i++){
      this.highscores.push(new Text(i+1 + ': ' + this.scores[i], this.game.width / 2, this.game.height * (0.40 + (i / 20)), '#000', 0.5, 0.5));
    }
  }

  if(points > 0){
    this.scores.push(points);
    this.scores.sort((a, b) => b - a);
    this.scores = this.scores.slice(0, 5);
    localStorage.setItem('score'+ difficulty, JSON.stringify(this.scores));
  }
};

EndState.prototype.draw = function() {
  this.ctx.drawImage(this.bg, 0, 0);
  this.scoreText.draw(this.ctx);
  this.backButton.draw(this.ctx);
  if(this.highscores){
    for(let t of this.highscores){
      t.draw(this.ctx);
    }
  }
};

EndState.prototype.update = function() {
  this.backButton.update();
};
