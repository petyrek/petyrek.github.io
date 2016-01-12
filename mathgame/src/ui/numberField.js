function NumberField(state) {
  this.state = state;
  this.ctx = state.ctx;

  this.x = 0;
  this.y = this.ctx.canvas.height - 100;
  this.width = this.ctx.canvas.width;
  this.height = 50;
  this.text = new Text('0', this.width / 2, this.y + this.height / 2, "#fff", "16px sans-serif", 0.5, 0.5);
}

NumberField.prototype.draw = function(ctx) {
  ctx.strokeRect(this.x, this.y, this.width, this.height);
  this.text.draw(ctx);
}

NumberField.prototype.numberPressed = function(i) {
  if (i == 10) { // delete character has been pressed
    this.text.setText(this.text.getText().substring(0, this.text.getText().length - 1));
  } else if (this.text.getText() === "0") { // 0 is in the number field and number is pressed
    if (i < 10) {
      this.text.setText(i + "");
    }
  } else if (this.text.getText().length < 10) {
    this.text.setText(this.text.getText() + i); // number is pressed
  }
  this.checkAnswers();
}

NumberField.prototype.checkAnswers = function() {
  let value = parseInt(this.text.getText());
  for (let q of this.state.questions.questions){
    if (q.value == value){
      this.text.setText('');
      this.state.score.increaseScore();
      let index = this.state.questions.questions.indexOf(q);
      this.state.questions.questions.splice(index, 1);
      return;
    }
  }
}
