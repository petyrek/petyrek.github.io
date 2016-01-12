function Score() {
  this.x = 0;
  this.y = 0;
  this.points = 0;
}

Score.prototype.increaseScore = function() {
  this.points += 30;
}

Score.prototype.draw = function(ctx) {
  ctx.font = ctx.canvas.height / 30 + "px calibri";
  ctx.fillText("Score: " + this.points, ctx.canvas.width / 100, ctx.canvas.height / 50);
}
