function Game() {
    // setup canvas
    var canvas = document.getElementById("game");
    var size = (window.innerHeight < window.innerWidth)? window.innerHeight : window.innerWidth;
    size *= 0.95;
    canvas.width = 450;
    canvas.height = 800;
    this.width = canvas.width;
    this.height = canvas.height;

    this.context = canvas.getContext("2d");
    this.context.lineWidth = this.height / 400;
    this.context.textBaseline = "middle";

    this.state = new MenuState(this);
};

Game.prototype.draw = function()
{
    var ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);

    this.state.draw();
};

Game.prototype.update = function()
{
    this.state.update();
};

var game = new Game();
function Run() {
  window.requestAnimationFrame(Run);
  game.update();
  game.draw();
}
