function Button(x, y, width, height, text, onclick, anchorX = 0, anchorY = 0) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = new Text(text, x + width / 2 - width * anchorX, y + height / 2 - height * anchorY, "#fff", "16px sans-serif", 0.5, 0.5);

  this.anchor = {
    x: anchorX,
    y: anchorY
  };

  this.active = false;
  this.value = 0;
  this.onclick = onclick;
  this.keyCode;
  this.altKeyCode;

  window.addEventListener("mousedown", () => {
    this.onMouseDown(event);
  }, false);

  window.addEventListener("mouseup", () => {
    this.onMouseUp(event);
  }, false);

  window.addEventListener("keydown", () => {
    if (event.keyIdentifier === 'U+0008' || event.keyIdentifier === 'Backspace' || event.keyCode === '8') {
      event.preventDefault();
    }
    this.onKeyDown(event);

  }, false);

  window.addEventListener("keyup", () => {
    this.onKeyUp(event);
    if (event.keyIdentifier === 'U+0008' || event.keyIdentifier === 'Backspace' || event.keyCode === '8') {
      event.preventDefault();
    }

  }, false);
}


Button.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(this.x - this.width * this.anchor.x, this.y - this.height * this.anchor.y, this.width, this.height);

  if (this.active){
    let off = ctx.lineWidth;
    ctx.fillStyle = "#333";
    ctx.fillRect(this.x - this.width * this.anchor.x + off / 2, this.y - this.height * this.anchor.y + off / 2, this.width - off, this.height - off);
  }
  this.text.draw(ctx);
}

Button.prototype.onMouseDown = function(event) {
  let canvas = document.getElementById("game");
  let x = event.pageX - canvas.offsetLeft;
  let y = event.pageY - canvas.offsetTop;
  if (this.contains(x, y)) {
    this.active = true;
  }
}
Button.prototype.onMouseUp = function(event) {
  this.active = false;
  let canvas = document.getElementById("game");
  let x = event.pageX - canvas.offsetLeft;
  let y = event.pageY - canvas.offsetTop;
  if (this.contains(x, y)) {
    this.onclick();
  }
}
Button.prototype.onKeyDown = function(event) {
  if (event.keyCode === this.keyCode || event.keyCode === this.altKeyCode) {
    this.active = true;
  }
}
Button.prototype.onKeyUp = function(event) {
  if (event.keyCode === this.keyCode || event.keyCode === this.altKeyCode) {
    this.active = false;
    this.onclick();
  }
}
Button.prototype.contains = function(x, y) {
  return x >= this.x - this.width * this.anchor.x &&
   x <= this.x + this.width - this.width * this.anchor.x &&
   y >= this.y - this.height * this.anchor.y &&
   y <= this.y + this.height - this.height * this.anchor.y;
}
