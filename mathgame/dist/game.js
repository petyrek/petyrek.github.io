"use strict";

function Game() {
  window.Resources = new Resources();
  window.Input = new Input();

  this.initCanvas();
};

Game.prototype.initCanvas = function () {
  var canvas = document.getElementById("game");
  canvas.width = 450;
  canvas.height = 800;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  this.ctx = canvas.getContext("2d");
  this.ctx.font = "40px messy_fika";

  this.width = canvas.width;
  this.height = canvas.height;
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
  this.touchX = null;
  this.touchY = null;
  this.mouseEventFired = false;

  document.body.ontouchstart = function (e) {
    _this2.mouseDown = true;
    _this2.touchX = e.touches[0].screenX;
    _this2.touchY = e.touches[0].screenY;
  };
  document.body.ontouchend = function (e) {
    _this2.mouseDown = false;
    _this2.mouseEventFired = false;
  };
  document.body.onmousedown = function (e) {
    _this2.mouseDown = true;
    _this2.touchX = e.pageX;
    _this2.touchY = e.pageY;
  };
  document.body.onmouseup = function () {
    _this2.mouseDown = false;
    _this2.mouseEventFired = false;
  };
}

Input.prototype.isMouseDown = function (button) {
  if (!this.mouseEventFired && this.mouseDown) {
    var canvas = document.getElementById("game");
    var x = (this.touchX - canvas.offsetLeft) * canvas.width / window.innerWidth;
    var y = (this.touchY - canvas.offsetTop) * canvas.height / window.innerHeight;

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
  this.loadSound('cheer', 'assets/cheer.ogg');
}

Resources.prototype.loadImage = function (key, src) {
  var el = document.createElement("img");
  el.setAttribute('src', src);
  this.memory[key] = el;
};

Resources.prototype.getImage = function (key) {
  return this.memory[key];
};

Resources.prototype.loadSound = function (key, src) {
  this.memory[key] = new Audio(src);
};

Resources.prototype.playSound = function (key) {
  if (game.soundEnabled) {
    this.memory[key].play();
  }
};

function Question(state, difficulty) {
  this.state = state;
  this.image = Resources.getImage('bubble');

  this.x = getRandomInt(0, state.game.width - this.image.width);
  this.y = 0 - this.image.height;
  this.velocity = 2;
  this.generateQuestionText(difficulty);
}

Question.prototype.update = function () {
  this.y += this.velocity;
};

Question.prototype.draw = function (ctx) {
  ctx.drawImage(this.image, this.x, this.y);
  ctx.fillStyle = "#fff";
  ctx.font = "30px sans-serif";
  ctx.fillText(this.text, this.x + this.image.width / 2 - ctx.measureText(this.text).width / 2.0, this.y + this.image.height / 2 + 22 / 2);
  ctx.font = "40px messy_fika";
};

Question.prototype.generateQuestionText = function (difficulty) {
  var operation = getRandomInt(0, difficulty == 0 ? 1 : 4); // only addition for toddlers

  if (operation == 0) {
    // plus
    var highestNumber = 120;
    if (difficulty == 0) {
      highestNumber = 4;
    }
    if (difficulty == 1) {
      highestNumber = 15;
    }
    if (difficulty == 2) {
      highestNumber = 50;
    }
    var first = getRandomInt(1, highestNumber);
    var second = getRandomInt(1, highestNumber);

    this.text = first + " + " + second;
    this.value = first + second;
    return;
  }

  if (operation == 1) {
    // minus
    var highestNumber = 120;
    if (difficulty == 1) {
      highestNumber = 10;
    }
    if (difficulty == 2) {
      highestNumber = 50;
    }

    var first = getRandomInt(1, highestNumber);
    var second = getRandomInt(1, highestNumber);
    if (first < second) {
      second = [first, first = second][0];
    }

    this.text = first + " - " + second;
    this.value = first - second;
    return;
  }
  if (operation == 2) {
    // multiply
    var highestNumber = 20;
    if (difficulty == 1) {
      highestNumber = 5;
    }
    if (difficulty == 2) {
      highestNumber = 10;
    }

    var first = getRandomInt(1, highestNumber);
    var second = getRandomInt(1, highestNumber);

    this.text = first + " × " + second;
    this.value = first * second;
    return;
  }
  if (operation == 3) {
    // divide
    var highestNumber = 20;
    if (difficulty == 1) {
      highestNumber = 5;
    }
    if (difficulty == 2) {
      highestNumber = 10;
    }

    var first = getRandomInt(1, highestNumber);
    var second = getRandomInt(1, highestNumber);

    this.text = first * second + " / " + second;
    this.value = first;
    return;
  }
};

function Questions(state, difficulty) {
  this.state = state;
  this.ctx = state.ctx;

  this.difficulty = difficulty;
  this.questions = [];
  this.generateQuestions();
}

Questions.prototype.generateQuestions = function () {
  this.questions.push(new Question(this.state, this.difficulty));

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
  var _this4 = this;

  this.questions.forEach(function (q) {
    q.update();
    if (q.y > _this4.state.game.height - 90) {
      var index = _this4.questions.indexOf(q);
      _this4.questions.splice(index, 1);
      _this4.state.lifes.loseLife();
    }
  });
};

function EndState(game, points, difficulty) {
  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('game-bg');

  this.scoreText = new Text("YOUR SCORE: " + points, this.game.width / 2, this.game.height * .2, '#000', 0.5, 0.5);

  this.backButton = new Button(game.width / 2, game.height * .8, "BACK", "menu-btn", function () {
    game.state = new MenuState(game);
  }, "#0a7bff", .5, .5);

  this.scores = localStorage.getItem('score' + difficulty) || [];
  if (this.scores.length > 0) {
    this.scores = JSON.parse(this.scores);
    this.highscores = [new Text("HIGHSCORES", this.game.width / 2, this.game.height * .35, '#000', 0.5, 0.5)];
    for (var i = 0; i < this.scores.length; i++) {
      this.highscores.push(new Text(i + 1 + ': ' + this.scores[i], this.game.width / 2, this.game.height * (0.40 + i / 20), '#000', 0.5, 0.5));
    }
  }

  if (points > 0) {
    this.scores.push(points);
    this.scores.sort(function (a, b) {
      return b - a;
    });
    this.scores = this.scores.slice(0, 5);
    localStorage.setItem('score' + difficulty, JSON.stringify(this.scores));
  }
};

EndState.prototype.draw = function () {
  this.ctx.drawImage(this.bg, 0, 0);
  this.scoreText.draw(this.ctx);
  this.backButton.draw(this.ctx);
  if (this.highscores) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.highscores[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var t = _step.value;

        t.draw(this.ctx);
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
  }
};

EndState.prototype.update = function () {
  this.backButton.update();
};

function GameState(game, difficulty) {
  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('game-bg');

  this.difficulty = difficulty;
  this.lifes = new Lifes(3, this.ctx);
  this.score = new Score();

  this.keyboard = new Keyboard(this);
  this.numberField = new NumberField(this);
  this.questions = new Questions(this, difficulty);
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
    this.game.state = new EndState(this.game, this.score.points, this.difficulty);
  }
};

function MenuState(game) {
  var _this5 = this;

  this.game = game;
  this.ctx = game.ctx;

  this.bg = Resources.getImage('menu-bg');

  this.game.soundEnabled = localStorage.getItem('soundEnabled') != 'false';

  this.startButton0 = new Button(this.ctx.canvas.width / 2, this.ctx.canvas.height * .4, "TODDLER", 'menu-btn', function () {
    game.state = new GameState(game, 0);
  }, "#0a7bff", .5, .5);
  this.startButton1 = new Button(this.ctx.canvas.width / 2, this.ctx.canvas.height * .5, "KID", 'menu-btn', function () {
    game.state = new GameState(game, 1);
  }, "#0a7bff", .5, .5);
  this.startButton2 = new Button(this.ctx.canvas.width / 2, this.ctx.canvas.height * .6, "ADULT", 'menu-btn', function () {
    game.state = new GameState(game, 2);
  }, "#0a7bff", .5, .5);
  this.startButton3 = new Button(this.ctx.canvas.width / 2, this.ctx.canvas.height * .7, "EXPERT", 'menu-btn', function () {
    game.state = new GameState(game, 3);
  }, "#0a7bff", .5, .5);
  this.soundButton = new Button(this.ctx.canvas.width / 2, this.ctx.canvas.height * .9, "", this.game.soundEnabled ? 'sound' : 'sound-off', function () {
    console.log('sup');
    _this5.toggleSound();
  }, "#fff", .5, .5);
};

MenuState.prototype.draw = function () {
  this.ctx.drawImage(this.bg, 0, 0);
  this.startButton0.draw(this.ctx);
  this.startButton1.draw(this.ctx);
  this.startButton2.draw(this.ctx);
  this.startButton3.draw(this.ctx);
  this.soundButton.draw(this.ctx);
};

MenuState.prototype.update = function () {
  this.startButton0.update();
  this.startButton1.update();
  this.startButton2.update();
  this.startButton3.update();
  this.soundButton.update();
};

MenuState.prototype.toggleSound = function () {
  if (this.game.soundEnabled) {
    this.soundButton.image = Resources.getImage('sound-off');
    this.game.soundEnabled = false;
  } else {
    this.soundButton.image = Resources.getImage('sound');
    this.game.soundEnabled = true;
  }
  localStorage.setItem('soundEnabled', this.game.soundEnabled);
};

function Button(x, y, text, image, onclick, fontColor) {
  var anchorX = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
  var anchorY = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];

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
  var _this6 = this;

  this.state = state;
  this.ctx = state.ctx;
  this.btns = [];

  var _loop = function _loop(i) {
    var btn = new Button((i - 1) * _this6.ctx.canvas.width / 8, _this6.ctx.canvas.height - 56, i + "", 'keyboard-btn', function () {
      _this6.state.numberField.numberPressed(i);
    }, '#0a7bff', 0, 1);
    _this6.btns.push(btn);
  };

  for (var i = 1; i < 9; i++) {
    _loop(i);
  }
  this.btns.push(new Button(this.ctx.canvas.width / 8 * 6, this.ctx.canvas.height, "9", 'keyboard-btn', function () {
    _this6.state.numberField.numberPressed(9);
  }, '#0a7bff', 0, 1));
  this.btns.push(new Button(this.ctx.canvas.width / 8 * 7, this.ctx.canvas.height, "0", 'keyboard-btn', function () {
    _this6.state.numberField.numberPressed(0);
  }, '#0a7bff', 0, 1));
  this.btns.push(new Button(this.ctx.canvas.width / 8 * 4, this.ctx.canvas.height, "DEL", 'keyboard-btn-del', function () {
    _this6.state.numberField.numberPressed(10);
  }, '#0a7bff', 0, 1));
}

Keyboard.prototype.update = function (context) {
  this.btns.forEach(function (b) {
    b.update();
  });
};
Keyboard.prototype.draw = function (context) {
  var _this7 = this;

  this.btns.forEach(function (b) {
    b.draw(_this7.ctx);
  });
};

function Lifes(lifes, ctx) {
  this.lifes = lifes;
  this.text = new Text("LIFES: " + this.lifes, ctx.canvas.width - 30, 10, "#000", 1, 1);
  this.img = Resources.getImage('lifes');
}

Lifes.prototype.draw = function (ctx) {
  this.text.draw(ctx);
  ctx.drawImage(this.img, ctx.canvas.width - this.img.width - 5, 8);
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
  this.y = this.ctx.canvas.height - 56;
  this.text = new Text('0', this.img.width / 2, this.y + this.img.height / 2 + 5, "#000", 0.5, 0.5);
}

NumberField.prototype.draw = function (ctx) {
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
  } else if (this.text.getText().length < 6) {
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
        Resources.playSound('cheer');
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
  this.text = new Text('SCORE: ' + this.points, 0, 10, "#000", 0, 1);
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
