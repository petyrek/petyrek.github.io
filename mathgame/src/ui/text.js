function Text(text, x, y, color, anchorX = 0, anchorY = 0) {
  this.text = text;
  this.x = x;
  this.y = y;
  this.color = color;
  this.anchor = {
    x: anchorX,
    y: anchorY
  };
}

Text.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.fillText(this.text, this.x - ctx.measureText(this.text).width * this.anchor.x, this.y + 20 * this.anchor.y);
}

Text.prototype.setText = function(text) {
  this.text = text;
}

Text.prototype.getText = function(text) {
  return this.text;
}
