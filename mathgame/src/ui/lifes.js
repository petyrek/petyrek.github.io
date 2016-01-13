function Lifes(lifes, ctx) {
  this.lifes = lifes;
  this.text = new Text("LIFES: " + this.lifes, ctx.canvas.width - 30, 10, "#000", 1, 1);
  this.img = Resources.getImage('lifes');
}

Lifes.prototype.draw = function(ctx) {
  this.text.draw(ctx);
  ctx.drawImage(this.img, ctx.canvas.width - this.img.width - 5, 8);
}

Lifes.prototype.loseLife = function(){
  this.lifes -= 1;
  this.text.setText("LIFES: " + this.lifes);
}
