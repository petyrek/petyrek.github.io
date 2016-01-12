function Keyboard(state) {
  this.state = state;
  this.ctx = state.ctx;
  this.btns = [];

  for (let i = 0; i < 11; i++) {
    let btn = new Button(
      (i) * this.ctx.canvas.width / 11,
      this.ctx.canvas.height - 50,
      this.ctx.canvas.width / 11,
      50,
      i + "",
      () => {
        this.state.numberField.numberPressed(i);
      }
    );

    btn.keyCode = i + 96;
    btn.altKeyCode = i + 48;

    if (i == 10) {
      btn.text.text = "del";
      btn.keyCode = 8;
      btn.altKeyCode = null;
    }

    this.btns.push(btn);
  }
}

Keyboard.prototype.draw = function(context){
  this.btns.forEach((b) => {
    b.draw(this.ctx);
  });
}
