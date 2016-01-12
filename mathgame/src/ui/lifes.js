function Lifes(lifes) {
  this.x = 0;
  this.y = 0;
  this.lifes = lifes;
}

Lifes.prototype.draw = function(ctx) {
  ctx.font = ctx.canvas.height / 30 + "px calibri";
  ctx.fillStyle = "#fff";
  ctx.fillText("Lifes: " + this.lifes, ctx.canvas.width - ctx.measureText("Lifes:  " + this.lifes).width, ctx.canvas.height / 50);
}
