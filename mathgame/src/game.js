function Game() {
  window.Resources = new Resources();
  window.Input = new Input();

  this.initCanvas();
};

Game.prototype.initCanvas = function() {
  let canvas = document.getElementById("game");
  let x = 450;
  let y = 800;
  const ratio = x / y;

  if(window.innerWidth < x){
    x = window.innerWidth;
  }
  if(window.innerHeight < y){
    y = window.innerHeight;
  }
  if(x / y > ratio){
    x = y * ratio;
  }
  if(x / y < ratio){
    y = x / ratio;
  }

  canvas.width = x;
  canvas.height = y;
  this.width = canvas.width;
  this.height = canvas.height;

  this.ctx = canvas.getContext("2d");
  this.ctx.font = "30px messy_fika";
  this.state = new MenuState(this);
}

Game.prototype.draw = function() {
  this.state.draw();
};

Game.prototype.update = function() {
  this.state.update();
};

Game.prototype.run = function() {
  window.requestAnimationFrame(() => this.run());
  this.update();
  this.draw();
}
