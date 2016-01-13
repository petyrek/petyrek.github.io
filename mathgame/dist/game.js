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

  if (!this.mobileCheck()) {
    canvas.className += canvas.className + ' desktop';
  }

  this.ctx = canvas.getContext("2d");
  this.ctx.font = "40px messy_fika";

  this.width = canvas.width;
  this.height = canvas.height;
  this.state = new MenuState(this);
};
Game.prototype.mobileCheck = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
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
    _this2.touchX = e.touches[0].pageX;
    _this2.touchY = e.touches[0].pageY;
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
    var rect = canvas.getBoundingClientRect();

    var scaleX = 1,
        scaleY = 1;
    if (window.innerWidth < canvas.width) {
      scaleX = canvas.width / window.innerWidth;
    }
    if (canvas.width < canvas.clientWidth) {
      scaleX = canvas.width / canvas.clientWidth;
    }

    if (window.innerHeight < canvas.height) {
      scaleY = canvas.height / window.innerHeight;
    }
    if (canvas.height < canvas.clientHeight) {
      scaleY = canvas.height / canvas.clientHeight;
    }

    var x = (this.touchX - rect.left) * scaleX;
    var y = (this.touchY - rect.top) * scaleY;
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
  this.loadImage('back-arrow-btn', 'assets/back-arrow-btn.png');
  this.loadSound('check', 'assets/check.m4a');
  this.loadSound('error', 'assets/error.m4a');
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
      Resources.playSound('error');
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

  this.backButton = new Button(5, 40, "", "back-arrow-btn", function () {
    game.state = new MenuState(game);
  }, "", 0, 0);
};

GameState.prototype.draw = function () {
  this.ctx.drawImage(this.bg, 0, 0);

  this.questions.draw(this.ctx);
  this.lifes.draw(this.ctx);
  this.score.draw(this.ctx);
  this.backButton.draw(this.ctx);
  this.numberField.draw(this.ctx);
  this.keyboard.draw(this.ctx);
};

GameState.prototype.update = function () {
  this.questions.update();
  this.keyboard.update();
  this.backButton.update();

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
  var _this8 = this;

  var value = parseInt(this.text.getText());
  this.state.questions.questions.forEach(function (q) {
    if (q.value == value) {
      _this8.text.setText('');
      _this8.state.score.increaseScore();
      var index = _this8.state.questions.questions.indexOf(q);
      _this8.state.questions.questions.splice(index, 1);
      Resources.playSound('check');
      return;
    }
  });
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
