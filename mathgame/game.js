function Game() {
    
    // setup canvas
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "#f00";
    this.context.font = "20px Calibri";
    this.context.strokeStyle = "#0f0";
    this.context.lineWidth = 5;

    this.state = new MenuState(this)
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
    game.update();
    game.draw();
    setTimeout(Run, 1000/60);
}
Run();