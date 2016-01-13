function Game() {
  window.Resources = new Resources();
  window.Input = new Input();

  this.initCanvas();
};

Game.prototype.initCanvas = function() {
  let canvas = document.getElementById("game");
  canvas.width = 450;
  canvas.height = 800;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  this.ctx = canvas.getContext("2d");
  this.ctx.font = "30px messy_fika";

  this.width = canvas.width;
  this.height = canvas.height;
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
