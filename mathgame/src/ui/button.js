function Button(x, y, text, image, onclick, fontColor, anchorX = 0, anchorY = 0) {
  this.x = x;
  this.y = y;
  this.image = Resources.getImage(image);
  this.text = new Text(text, x + this.image.width / 2 - this.image.width * anchorX, y + this.image.height / 2 - this.image.height * anchorY + 5, fontColor, 0.5, 0.5);

  this.anchor = {
    x: anchorX,
    y: anchorY
  };

  this.value = 0;
  this.onclick = onclick;
}


Button.prototype.draw = function(ctx) {
  ctx.drawImage(this.image, this.x - this.image.width * this.anchor.x, this.y - this.image.height * this.anchor.y);
  this.text.draw(ctx);
}

Button.prototype.update = function(){
  if(Input.isMouseDown(this)){
    this.onclick();
  }
}

Button.prototype.contains = function(x, y) {
  return x >= this.x - this.image.width * this.anchor.x &&
   x <= this.x + this.image.width - this.image.width * this.anchor.x &&
   y >= this.y - this.image.height * this.anchor.y &&
   y <= this.y + this.image.height - this.image.height * this.anchor.y;
}
