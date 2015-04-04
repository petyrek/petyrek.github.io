function Score()
{
    this.x = 0;
    this.y = 0;
    this.points = 0;
}
 
Score.prototype.increaseScore = function(){
	this.points += 30;
}

Score.prototype.draw = function(ctx)
{
    ctx.fillText("Score: " + this.points, ctx.canvas.width / 100, ctx.canvas.height / 50);
}