function Score()
{
    this.x = 0;
    this.y = 0;
    this.score = 0;
}
 
Score.prototype.draw = function(ctx)
{
    ctx.fillText("Score: " + this.score, ctx.canvas.width / 100, ctx.canvas.height / 50);
}