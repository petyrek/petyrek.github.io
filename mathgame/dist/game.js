"use strict";

function Game() {
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

function Question(ctx) {
  this.image = document.getElementById("bubble");

  this.x = getRandomInt(0, ctx.canvas.width - this.image.width);
  this.y = 0 - this.image.height;
  this.velocity = 2;
  this.generateQuestionText();
}

Question.prototype.update = function () {
  this.y += this.velocity;
};

Question.prototype.draw = function (ctx) {
  ctx.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
  ctx.fillStyle = "#000";
  ctx.fillText(this.text, this.x - ctx.measureText(this.text).width / 2.0, this.y);
};

Question.prototype.generateQuestionText = function () {
  var operation = getRandomInt(0, 4);

  if (operation == 0) {
    // plus
    var first = getRandomInt(1, 50);
    var second = getRandomInt(1, 50);

    this.text = first + "+" + second;
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

    this.text = first + "-" + second;
    this.value = first - second;
    return;
  }
  if (operation == 2) {
    // multiply
    var first = getRandomInt(1, 10);
    var second = getRandomInt(1, 10);

    this.text = first + "*" + second;
    this.value = first * second;
    return;
  }
  if (operation == 3) {
    // divide
    var first = getRandomInt(1, 10);
    var second = getRandomInt(1, 10);

    this.text = first * second + "/" + second;
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
  this.questions.push(new Question(this.ctx));

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
  var _this2 = this;

  this.questions.forEach(function (q) {
    q.draw(_this2.ctx);
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

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function EndState(game, points) {
  this.game = game;

  this.scoreText = "Your score: " + points;
  this.context = game.context;

  this.context.font = game.height / 20 + "px serif";
  this.context.strokeStyle = "#ddd";
  this.context.lineWidth = game.height / 400;

  this.backButton = new Button(game.width / 5, game.height / 1.25, game.width - game.width / 2.5, game.height / 10, "BACK", function () {
    game.state = new MenuState(game);
  });
};

EndState.prototype.draw = function () {
  this.context.fillStyle = "#fff";
  this.context.fillText(this.scoreText, this.game.width / 2.0 - this.context.measureText(this.scoreText).width / 2.0, this.game.height / 2);
  this.backButton.draw(this.context);
};

EndState.prototype.update = function () {};

function GameState(game) {
  this.game = game;
  this.ctx = game.ctx;

  this.lifes = new Lifes(3);
  this.score = new Score();

  this.keyboard = new Keyboard(this);
  this.numberField = new NumberField(this);
  this.questions = new Questions(this);
};

GameState.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.game.width, this.game.height);

  this.questions.draw(this.ctx);
  this.lifes.draw(this.ctx);
  this.score.draw(this.ctx);
  this.keyboard.draw(this.ctx);
  this.numberField.draw(this.ctx);
};

GameState.prototype.update = function () {
  this.questions.update();
};

function MenuState(game) {
  this.game = game;
  this.ctx = game.ctx;

  this.startButton = new Button(game.width / 2, game.height * .2, 150, 60, "NORMAL", function () {
    game.state = new GameState(game);
  }, .5, .5);
};

MenuState.prototype.draw = function () {
  this.startButton.draw(this.ctx);
};

MenuState.prototype.update = function () {};

function Button(x, y, width, height, text, onclick) {
  var _this3 = this;

  var anchorX = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
  var anchorY = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];

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

  window.addEventListener("mousedown", function () {
    _this3.onMouseDown(event);
  }, false);

  window.addEventListener("mouseup", function () {
    _this3.onMouseUp(event);
  }, false);

  window.addEventListener("keydown", function () {
    if (event.keyIdentifier === 'U+0008' || event.keyIdentifier === 'Backspace' || event.keyCode === '8') {
      event.preventDefault();
    }
    _this3.onKeyDown(event);
  }, false);

  window.addEventListener("keyup", function () {
    _this3.onKeyUp(event);
    if (event.keyIdentifier === 'U+0008' || event.keyIdentifier === 'Backspace' || event.keyCode === '8') {
      event.preventDefault();
    }
  }, false);
}

Button.prototype.draw = function (ctx) {
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(this.x - this.width * this.anchor.x, this.y - this.height * this.anchor.y, this.width, this.height);

  if (this.active) {
    var off = ctx.lineWidth;
    ctx.fillStyle = "#333";
    ctx.fillRect(this.x - this.width * this.anchor.x + off / 2, this.y - this.height * this.anchor.y + off / 2, this.width - off, this.height - off);
  }
  this.text.draw(ctx);
};

Button.prototype.onMouseDown = function (event) {
  var canvas = document.getElementById("game");
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  if (this.contains(x, y)) {
    this.active = true;
  }
};
Button.prototype.onMouseUp = function (event) {
  this.active = false;
  var canvas = document.getElementById("game");
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  if (this.contains(x, y)) {
    this.onclick();
  }
};
Button.prototype.onKeyDown = function (event) {
  if (event.keyCode === this.keyCode || event.keyCode === this.altKeyCode) {
    this.active = true;
  }
};
Button.prototype.onKeyUp = function (event) {
  if (event.keyCode === this.keyCode || event.keyCode === this.altKeyCode) {
    this.active = false;
    this.onclick();
  }
};
Button.prototype.contains = function (x, y) {
  return x >= this.x - this.width * this.anchor.x && x <= this.x + this.width - this.width * this.anchor.x && y >= this.y - this.height * this.anchor.y && y <= this.y + this.height - this.height * this.anchor.y;
};

function Keyboard(state) {
  var _this4 = this;

  this.state = state;
  this.ctx = state.ctx;
  this.btns = [];

  var _loop = function _loop(i) {
    var btn = new Button(i * _this4.ctx.canvas.width / 11, _this4.ctx.canvas.height - 50, _this4.ctx.canvas.width / 11, 50, i + "", function () {
      _this4.state.numberField.numberPressed(i);
    });

    btn.keyCode = i + 96;
    btn.altKeyCode = i + 48;

    if (i == 10) {
      btn.text.text = "del";
      btn.keyCode = 8;
      btn.altKeyCode = null;
    }

    _this4.btns.push(btn);
  };

  for (var i = 0; i < 11; i++) {
    _loop(i);
  }
}

Keyboard.prototype.draw = function (context) {
  var _this5 = this;

  this.btns.forEach(function (b) {
    b.draw(_this5.ctx);
  });
};

function Lifes(lifes) {
  this.x = 0;
  this.y = 0;
  this.lifes = lifes;
}

Lifes.prototype.draw = function (ctx) {
  ctx.font = ctx.canvas.height / 30 + "px calibri";
  ctx.fillStyle = "#fff";
  ctx.fillText("Lifes: " + this.lifes, ctx.canvas.width - ctx.measureText("Lifes:  " + this.lifes).width, ctx.canvas.height / 50);
};

function NumberField(state) {
  this.state = state;
  this.ctx = state.ctx;

  this.x = 0;
  this.y = this.ctx.canvas.height - 100;
  this.width = this.ctx.canvas.width;
  this.height = 50;
  this.text = new Text('0', this.width / 2, this.y + this.height / 2, "#fff", "16px sans-serif", 0.5, 0.5);
}

NumberField.prototype.draw = function (ctx) {
  ctx.strokeRect(this.x, this.y, this.width, this.height);
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
  this.x = 0;
  this.y = 0;
  this.points = 0;
}

Score.prototype.increaseScore = function () {
  this.points += 30;
};

Score.prototype.draw = function (ctx) {
  ctx.font = ctx.canvas.height / 30 + "px calibri";
  ctx.fillText("Score: " + this.points, ctx.canvas.width / 100, ctx.canvas.height / 50);
};

function Text(text, x, y) {
  var color = arguments.length <= 3 || arguments[3] === undefined ? "#fff" : arguments[3];
  var font = arguments.length <= 4 || arguments[4] === undefined ? "16px sans-serif" : arguments[4];
  var anchorX = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
  var anchorY = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

  this.text = text;
  this.x = x;
  this.y = y;
  this.color = color;
  this.font = font;
  this.anchor = {
    x: anchorX,
    y: anchorY
  };
}

Text.prototype.draw = function (ctx) {
  ctx.font = this.font;
  ctx.fillStyle = this.color;
  ctx.fillText(this.text, this.x - ctx.measureText(this.text).width * this.anchor.x, this.y + parseInt(this.font) * this.anchor.y);
};

Text.prototype.setText = function (text) {
  this.text = text;
};

Text.prototype.getText = function (text) {
  return this.text;
};
//# sourceMappingURL=game.js.map
