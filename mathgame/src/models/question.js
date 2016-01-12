function Question(ctx) {
  this.image = document.getElementById("bubble");

  this.x = getRandomInt(0, ctx.canvas.width - this.image.width);
  this.y = 0 - this.image.height
  this.velocity = 2;
  this.generateQuestionText();
}

Question.prototype.update = function() {
  this.y += this.velocity;
};

Question.prototype.draw = function(ctx) {
  ctx.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
  ctx.fillStyle = "#000";
  ctx.fillText(this.text, this.x - ctx.measureText(this.text).width / 2.0, this.y);
};

Question.prototype.generateQuestionText = function() {
  const operation = getRandomInt(0, 4);

  if (operation == 0) { // plus
    let first = getRandomInt(1, 50);
    let second = getRandomInt(1, 50);

    this.text = first + "+" + second;
    this.value = first + second;
    return;
  }

  if (operation == 1) { // minus
    let first = getRandomInt(1, 50);
    let second = getRandomInt(1, 50);
    if (first < second) {
      second = [first, first = second][0];
    }

    this.text = first + "-" + second;
    this.value = first - second;
    return;
  }
  if (operation == 2) { // multiply
    let first = getRandomInt(1, 10);
    let second = getRandomInt(1, 10);

    this.text = first + "*" + second;
    this.value = first * second;
    return;
  }
  if (operation == 3) { // divide
    let first = getRandomInt(1, 10);
    let second = getRandomInt(1, 10);

    this.text = (first * second) + "/" + second;
    this.value = first;
    return;
  }
}
