function Question(state, difficulty) {
  this.state = state;
  this.image = Resources.getImage('bubble');

  this.x = getRandomInt(0, state.game.width - this.image.width);
  this.y = 0 - this.image.height
  this.velocity = 2;
  this.generateQuestionText(difficulty);
}

Question.prototype.update = function() {
  this.y += this.velocity;
};

Question.prototype.draw = function(ctx) {
  ctx.drawImage(this.image, this.x, this.y);
  ctx.fillStyle = "#fff";
  ctx.font = "30px sans-serif";
  ctx.fillText(this.text, this.x + this.image.width / 2 - ctx.measureText(this.text).width / 2.0, this.y + this.image.height / 2 + 22 / 2);
  ctx.font = "40px messy_fika";
};

Question.prototype.generateQuestionText = function(difficulty) {
  const operation = getRandomInt(0, difficulty == 0? 1 : 4); // only addition for toddlers

  if (operation == 0) { // plus
    let highestNumber = 120;
    if(difficulty == 0){
      highestNumber = 4;
    }
    if(difficulty == 1){
      highestNumber = 15;
    }
    if(difficulty == 2){
      highestNumber = 50;
    }
    let first = getRandomInt(1, highestNumber);
    let second = getRandomInt(1, highestNumber);

    this.text = first + " + " + second;
    this.value = first + second;
    return;
  }

  if (operation == 1) { // minus
    let highestNumber = 120;
    if(difficulty == 1){
      highestNumber = 10;
    }
    if(difficulty == 2){
      highestNumber = 50;
    }

    let first = getRandomInt(1, highestNumber);
    let second = getRandomInt(1, highestNumber);
    if (first < second) {
      second = [first, first = second][0];
    }

    this.text = first + " - " + second;
    this.value = first - second;
    return;
  }
  if (operation == 2) { // multiply
    let highestNumber = 20;
    if(difficulty == 1){
      highestNumber = 5;
    }
    if(difficulty == 2){
      highestNumber = 10;
    }

    let first = getRandomInt(1, highestNumber);
    let second = getRandomInt(1, highestNumber);

    this.text = first + " × " + second;
    this.value = first * second;
    return;
  }
  if (operation == 3) { // divide
    let highestNumber = 20;
    if(difficulty == 1){
      highestNumber = 5;
    }
    if(difficulty == 2){
      highestNumber = 10;
    }

    let first = getRandomInt(1, highestNumber);
    let second = getRandomInt(1, highestNumber);

    this.text = (first * second) + " / " + second;
    this.value = first;
    return;
  }
}
