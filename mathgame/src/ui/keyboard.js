function Keyboard(state) {
  this.state = state;
  this.ctx = state.ctx;
  this.btns = [];

  for (let i = 0; i < 11; i++) {

    let btn = new Button(
      (i === 10)? this.ctx.canvas.width * 0.7 : (i) * this.ctx.canvas.width / 10,
      (i === 10)? this.ctx.canvas.height - 45 : this.ctx.canvas.height,
      (i === 10)? "DELETE" : i + "",
      (i === 10)? 'keyboard-btn-del' : 'keyboard-btn',
      () => {
        this.state.numberField.numberPressed(i);
      },
      '#0a7bff',
      0,
      1
    );
    this.btns.push(btn);
  }
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
