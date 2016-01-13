"use strict";

function Game() {
  window.Resources = new Resources();
  window.Input = new Input();

  this.initCanvas();
};

Game.prototype.initCanvas = function () {
  var canvas = document.getElementById("game");
  var x = 450;
  var y = 800;
  var ratio = x / y;

  if (window.innerWidth < x) {
    x = window.innerWidth;
  }
  if (window.innerHeight < y) {
    y = window.innerHeight;
  }
  if (x / y > ratio) {
    x = y * ratio;
  }
  if (x / y < ratio) {
    y = x / ratio;
  }

  canvas.width = x;
  canvas.height = y;
  this.width = canvas.width;
  this.height = canvas.height;

  this.ctx = canvas.getContext("2d");
  this.ctx.font = "30px messy_fika";
  this.state = new MenuState(this);
};

Game.prototype.draw = function () {
  this.state.draw();
};

Game.prototype.update = function () {
  this.state.update();
};

Game.prototype.run = function () {
  var _this = this;

  window.requestAnimationFrame(function () {
    return _this.run();
  });
  this.update();
  this.draw();
};

function Input() {
  var _this2 = this;

  this.mouseDown = false;
  this.mouseEvent = null;
  this.mouseEventFired = false;

  document.body.onmousedown = function (e) {
    _this2.mouseDown = true;
    _this2.mouseEvent = e;
  };
  document.body.onmouseup = function () {
    _this2.mouseDown = false;
    _this2.mouseEventFired = false;
  };
}

Input.prototype.isMouseDown = function (button) {
  if (!this.mouseEventFired && this.mouseDown) {
    var canvas = document.getElementById("game");
    var x = Input.mouseEvent.pageX - canvas.offsetLeft;
    var y = Input.mouseEvent.pageY - canvas.offsetTop;
    if (button.contains(x, y)) {
      this.mouseEventFired = true;
      return true;
    }
  } else {
    return false;
  }
};

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Resources() {
  this.memory = [];

  this.loadImage('bubble', 'assets/bubble.png');
  this.loadImage('menu-btn', 'assets/menu-btn.png');
  this.loadImage('menu-bg', 'assets/menu-bg.png');
  this.loadImage('keyboard-btn', 'assets/keyboard-btn.png');
  this.loadImage('keyboard-btn-del', 'assets/keyboard-btn-del.png');
  this.loadImage('numberfield', 'assets/numberfield.png');
  this.loadImage('game-bg', 'assets/game-bg.png');
  this.loadImage('lifes', 'assets/lifes.png');
  this.loadImage('sound', 'assets/sound.png');
  this.loadImage('sound-off', 'assets/sound-off.png');
}

Resources.prototype.loadImage = function (key, src) {
  var el = document.createElement("img");
  el.setAttribute('src', src);
  this.memory[key] = el;
};

Resources.prototype.getImage = function (key) {
  return this.memory[key];
};

function Question(state) {
  this.state = state;
  this.image = Resources.getImage('bubble');

  this.x = getRandomInt(0, state.game.width - this.image.width);
  this.y = 0 - this.image.height;
  this.velocity = 2;
  this.generateQuestionText();
}

Question.prototype.update = function () {
  this.y += this.velocity;
};

Question.prototype.draw = function (ctx) {
  ctx.drawImage(this.image, this.x, this.y);
  ctx.fillStyle = "#fff";
  ctx.font = "30px sans-serif";
  ctx.fillText(this.text, this.x + this.image.width / 2 - ctx.measureText(this.text).width / 2.0, this.y + this.image.height / 2 + 22 / 2);
  ctx.font = "30px messy_fika";
};

Question.prototype.generateQuestionText = function () {
  var operation = getRandomInt(0, 4);

  if (operation == 0) {
    // plus
    var first = getRandomInt(1, 50);
    var second = getRandomInt(1, 50);

    this.text = first + " + " + second;
    this.value = first + second;
    return;
  }

  if (operation == 1) {
    // minus
    var first = getRandomInt(1, 50);
    var second = getRandomInt(1, 50);
    if (first < second) {
      second = [first, first = second][0];
    }

    this.text = first + " - " + second;
    this.value = first - second;
    return;
  }
  if (operation == 2) {
    // multiply
    var first = getRandomInt(1, 10);
    var second = getRandomInt(1, 10);

    this.text = first + " × " + second;
    this.value = first * second;
    return;
  }
  if (operation == 3) {
    // divide
    var first = getRandomInt(1, 10);
    var second = getRandomInt(1, 10);

    this.text = first * second + " ÷ " + second;
    this.value = first;
    return;
  }
};

function Questions(state) {
  this.state = state;
  this.ctx = state.ctx;

  this.questions = [];
  this.generateQuestions();
}

Questions.prototype.generateQuestions = function () {
  this.questions.push(new Question(this.state));

  (function (that) {
    var time = 3000,
        delta = 100,
        tid;
    tid = setInterval(function () {
      if (window.blurred) {
        return;
      }
      time -= delta;
      if (time <= 0) {
        clearInterval(tid);
        that.generateQuestions();
      }
    }, delta);
  })(this);
};

Questions.prototype.draw = function () {
  var _this3 = this;

  this.questions.forEach(function (q) {
    q.draw(_this3.ctx);
  });
};

Questions.prototype.update = function () {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = this.questions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var q = _step.value;

      q.update();

      if (q.y > this.state.game.height - 90) {
        var index = this.questions.indexOf(q);
        this.questions.splice(index, 1);
        this.state.lifes.loseLife();
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

function EndState(game, points) {
  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('game-bg');

  this.scoreText = new Text("YOUR SCORE: " + points, this.game.width / 2, this.game.height * .2, '#000', 0.5, 0.5);

  this.backButton = new Button(game.width / 2, game.height * .8, "BACK", "menu-btn", function () {
    game.state = new MenuState(game);
  }, "#0a7bff", .5, .5);
};

EndState.prototype.draw = function () {
  this.ctx.drawImage(this.bg, 0, 0);
  this.scoreText.draw(this.ctx);
  this.backButton.draw(this.ctx);
};

EndState.prototype.update = function () {
  this.backButton.update();
};

function GameState(game, difficulty) {
  this.game = game;
  this.ctx = game.ctx;

  this.difficulty = difficulty;
  this.bg = Resources.getImage('game-bg');

  this.lifes = new Lifes(3, this.ctx);
  this.score = new Score();

  this.keyboard = new Keyboard(this);
  this.numberField = new NumberField(this);
  this.questions = new Questions(this);
};

GameState.prototype.draw = function () {
  this.ctx.drawImage(this.bg, 0, 0);

  this.questions.draw(this.ctx);
  this.lifes.draw(this.ctx);
  this.score.draw(this.ctx);
  this.numberField.draw(this.ctx);
  this.keyboard.draw(this.ctx);
};

GameState.prototype.update = function () {
  this.questions.update();
  this.keyboard.update();

  if (this.lifes.lifes < 1) {
    this.game.state = new EndState(this.game, this.score.points);
  }
};

function MenuState(game) {
  var _this4 = this;

  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('menu-bg');

  this.startButtonEasy = new Button(game.width / 2, game.height * .4, "EASY", 'menu-btn', function () {
    console.log('ahoj');
    game.state = new GameState(game, 0);
  }, "#0a7bff", .5, .5);
  this.startButtonNormal = new Button(game.width / 2, game.height * .5, "NORMAL", 'menu-btn', function () {
    game.state = new GameState(game, 1);
  }, "#0a7bff", .5, .5);

  this.soundButton = new Button(game.width / 2, game.height * .8, "", 'sound', function () {
    console.log('sup');
    _this4.toggleSound();
  }, "#fff", .5, .5);
};

MenuState.prototype.draw = function () {
  this.ctx.drawImage(this.bg, 0, 0);
  this.startButtonEasy.draw(this.ctx);
  this.startButtonNormal.draw(this.ctx);
  this.soundButton.draw(this.ctx);
};

MenuState.prototype.update = function () {
  this.startButtonEasy.update();
  this.startButtonNormal.update();
  this.soundButton.update();
};

MenuState.prototype.toggleSound = function () {
  console.log('ahoj');
  this.soundButton.image = Resources.getImage('sound-off');
};

function Button(x, y, text, image, onclick, fontColor) {
  var anchorX = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
  var anchorY = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];

  this.x = x;
  this.y = y;
  this.image = Resources.getImage(image);
  this.text = new Text(text, x + this.image.width / 2 - this.image.width * anchorX, y + this.image.height / 2 - this.image.height * anchorY, fontColor, 0.5, 0.5);

  this.anchor = {
    x: anchorX,
    y: anchorY
  };

  this.value = 0;
  this.onclick = onclick;
}

Button.prototype.draw = function (ctx) {
  ctx.drawImage(this.image, this.x - this.image.width * this.anchor.x, this.y - this.image.height * this.anchor.y);
  this.text.draw(ctx);
};

Button.prototype.update = function () {
  if (Input.isMouseDown(this)) {
    this.onclick();
  }
};

Button.prototype.contains = function (x, y) {
  return x >= this.x - this.image.width * this.anchor.x && x <= this.x + this.image.width - this.image.width * this.anchor.x && y >= this.y - this.image.height * this.anchor.y && y <= this.y + this.image.height - this.image.height * this.anchor.y;
};

function Keyboard(state) {
  var _this5 = this;

  this.state = state;
  this.ctx = state.ctx;
  this.btns = [];

  var _loop = function _loop(i) {

    var btn = new Button(i === 10 ? _this5.ctx.canvas.width * 0.7 : i * _this5.ctx.canvas.width / 10, i === 10 ? _this5.ctx.canvas.height - 45 : _this5.ctx.canvas.height, i === 10 ? "DELETE" : i + "", i === 10 ? 'keyboard-btn-del' : 'keyboard-btn', function () {
      _this5.state.numberField.numberPressed(i);
    }, '#0a7bff', 0, 1);
    _this5.btns.push(btn);
  };

  for (var i = 0; i < 11; i++) {
    _loop(i);
  }
}

Keyboard.prototype.update = function (context) {
  this.btns.forEach(function (b) {
    b.update();
  });
};
Keyboard.prototype.draw = function (context) {
  var _this6 = this;

  this.btns.forEach(function (b) {
    b.draw(_this6.ctx);
  });
};

function Lifes(lifes, ctx) {
  this.lifes = lifes;
  this.text = new Text("LIFES: " + this.lifes, ctx.canvas.width - 30, 0, "#000", 1, 1);
  this.img = Resources.getImage('lifes');
}

Lifes.prototype.draw = function (ctx) {
  this.text.draw(ctx);
  ctx.drawImage(this.img, ctx.canvas.width - this.img.width - 5, 1);
};

Lifes.prototype.loseLife = function () {
  this.lifes -= 1;
  this.text.setText("LIFES: " + this.lifes);
};

function NumberField(state) {
  this.state = state;
  this.ctx = state.ctx;

  this.img = Resources.getImage('numberfield');

  this.x = 0;
  this.y = this.ctx.canvas.height - 90;
  this.width = this.ctx.canvas.width * 0.7;
  this.height = 45;
  this.text = new Text('0', this.width / 2, this.y + this.height / 2, "#000", 0.5, 0.5);
}

NumberField.prototype.draw = function (ctx) {
  ctx.strokeRect(this.x, this.y, this.width, this.height);
  ctx.drawImage(this.img, 0, this.y);
  this.text.draw(ctx);
};

NumberField.prototype.numberPressed = function (i) {
  if (i == 10) {
    // delete character has been pressed
    this.text.setText(this.text.getText().substring(0, this.text.getText().length - 1));
  } else if (this.text.getText() === "0") {
    // 0 is in the number field and number is pressed
    if (i < 10) {
      this.text.setText(i + "");
    }
  } else if (this.text.getText().length < 10) {
    this.text.setText(this.text.getText() + i); // number is pressed
  }
  this.checkAnswers();
};

NumberField.prototype.checkAnswers = function () {
  var value = parseInt(this.text.getText());
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = this.state.questions.questions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var q = _step2.value;

      if (q.value == value) {
        this.text.setText('');
        this.state.score.increaseScore();
        var index = this.state.questions.questions.indexOf(q);
        this.state.questions.questions.splice(index, 1);
        return;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
};

function Score() {
  this.points = 0;
  this.text = new Text('SCORE: ' + this.points, 0, 0, "#000", 0, 1);
}

Score.prototype.increaseScore = function () {
  this.points += 10;
  this.text.setText('SCORE: ' + this.points);
};

Score.prototype.draw = function (ctx) {
  this.text.draw(ctx);
};

function Text(text, x, y, color) {
  var anchorX = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
  var anchorY = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

  this.text = text;
  this.x = x;
  this.y = y;
  this.color = color;
  this.anchor = {
    x: anchorX,
    y: anchorY
  };
}

Text.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.fillText(this.text, this.x - ctx.measureText(this.text).width * this.anchor.x, this.y + 20 * this.anchor.y);
};

Text.prototype.setText = function (text) {
  this.text = text;
};

Text.prototype.getText = function (text) {
  return this.text;
};
//# sourceMappingURL=game.js.map
