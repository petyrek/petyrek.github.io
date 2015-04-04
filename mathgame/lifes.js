function Lifes(lifes) 
{
    this.x = 0;
    this.y = 0;
    this.lifes = lifes;
}
 
Lifes.prototype.draw = function(ctx)
{
    ctx.fillText("Lifes: " + this.lifes, ctx.canvas.width - ctx.measureText("Lifes: 3 ").width, ctx.canvas.height / 50);
}