function Keyboard(state) {
  this.state = state;
  this.ctx = state.ctx;
  this.btns = [];

  for (let i = 1; i < 9; i++) {
    let btn = new Button(
      (i - 1) * this.ctx.canvas.width / 8,
      this.ctx.canvas.height - 56,
      i + "",
      'keyboard-btn',
      () => {
        this.state.numberField.numberPressed(i);
      },
      '#0a7bff',
      0,
      1
    );
    this.btns.push(btn);
  }
  this.btns.push(new Button(
    this.ctx.canvas.width / 8 * 6,
    this.ctx.canvas.height,
    "9",
    'keyboard-btn',
    () => {
      this.state.numberField.numberPressed(9);
    },
    '#0a7bff',
    0,
    1
  ));
  this.btns.push(new Button(
    this.ctx.canvas.width / 8 * 7,
    this.ctx.canvas.height,
    "0",
    'keyboard-btn',
    () => {
      this.state.numberField.numberPressed(0);
    },
    '#0a7bff',
    0,
    1
  ));
  this.btns.push(new Button(
    this.ctx.canvas.width / 8 * 4,
    this.ctx.canvas.height,
    "DELETE",
    'keyboard-btn-del',
    () => {
      this.state.numberField.numberPressed(10);
    },
    '#0a7bff',
    0,
    1
  ));
}


Keyboard.prototype.update = function(context){
  this.btns.forEach((b) => {
    b.update();
  });
}
Keyboard.prototype.draw = function(context){
  this.btns.forEach((b) => {
    b.draw(this.ctx);
  });
}
