function Resources() {
  this.memory = [];

  this.loadImage('bubble', 'assets/bubble.png');
  this.loadImage('menu-btn', 'assets/menu-btn.png');
  this.loadImage('menu-bg', 'assets/menu-bg.png');
  this.loadImage('keyboard-btn', 'assets/keyboard-btn.png');
  this.loadImage('keyboard-btn-del', 'assets/keyboard-btn-del.png');
  this.loadImage('numberfield', 'assets/numberfield.png');
  this.loadImage('game-bg', 'assets/game-bg.png');
  this.loadImage('lifes', 'assets/lifes.png');
  this.loadImage('sound', 'assets/sound.png');
  this.loadImage('sound-off', 'assets/sound-off.png');
  this.loadSound('cheer', 'assets/cheer.mp3');
}

Resources.prototype.loadImage = function(key, src){
  let el = document.createElement("img");
  el.setAttribute('src', src);
  this.memory[key] = el;
}

Resources.prototype.getImage = function(key){
  return this.memory[key];
}

Resources.prototype.loadSound = function(key, src){
  this.memory[key] = new Audio(src);
}

Resources.prototype.playSound = function(key){
  if(game.soundEnabled){
    this.memory[key].play();
  }
}
