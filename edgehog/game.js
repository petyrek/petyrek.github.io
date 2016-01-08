(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CFG;

window.CFG = CFG = {
  platformSpeed: 270,
  gravity: 1350,
  jumpVelocity: 600,
  playerPositionX: .1,
  platformTypes: {
    normal: {
      name: "normal",
      chance: 7,
      starChance: 30
    },
    spiked: {
      name: "spiked",
      chance: 1
    }
  }
};



},{}],2:[function(require,module,exports){
(function() {
  var States, game;

  require('./config/config.coffee');

  States = {
    Boot: require('./states/boot.coffee'),
    Menu: require('./states/menu.coffee'),
    Game: require('./states/game.coffee'),
    End: require('./states/end.coffee')
  };

  window.game = game = new Phaser.Game(800, 450, Phaser.CANVAS, '');

  game.state.add('Boot', States.Boot);

  game.state.add('Menu', States.Menu);

  game.state.add('Game', States.Game);

  game.state.add('End', States.End);

  game.state.start('Boot');

}).call(this);

},{"./config/config.coffee":1,"./states/boot.coffee":7,"./states/end.coffee":8,"./states/game.coffee":9,"./states/menu.coffee":10}],3:[function(require,module,exports){
var Platform, Star;

Star = require('../models/star.coffee');

module.exports = Platform = (function() {
  function Platform(state, x, y, type, noStars) {
    this.state = state;
    this.type = type;
    this.game = this.state.game;
    if (x == null) {
      x = this.game.width;
    }
    if (y == null) {
      y = this.getRandomY();
    }
    if (this.type == null) {
      this.type = this.getRandomType();
    }
    this.sprite = this.game.add.sprite(x, y, 'platform');
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;
    this.sprite.body.checkCollision = {
      any: true,
      none: false,
      top: true,
      down: false,
      left: false,
      right: false
    };
    this.sprite.body.velocity.setTo((this.game.tutorial ? 0 : -CFG.platformSpeed), 0);
    this.sprite["class"] = this;
    this.spikes = this.game.add.sprite(x, y, 'spikes');
    this.spikes.anchor.setTo(0, 1);
    this.spikes.alpha = this.type.name === "spiked" ? 1 : 0;
    this.star = new Star(this.state, this, noStars);
    this.game.platforms.platforms.push(this);
  }

  Platform.prototype.update = function() {
    this.game.physics.arcade.collide(this.game.player.sprite, this.sprite, this.platformCollision, null, this);
    this.star.update();
    this.spikes.x = this.sprite.body.x;
    return this.spikes.y = this.sprite.body.y;
  };

  Platform.prototype.platformCollision = function(player, platform) {
    if (platform["class"].type.name === "spiked") {
      return this.state.end();
    }
  };

  Platform.prototype.reset = function(x, y, type, noStars, userInput) {
    this.type = type;
    if (x == null) {
      x = this.game.width;
    }
    if (y == null) {
      y = this.getRandomY();
    }
    if (this.type == null) {
      this.type = this.getRandomType();
    }
    this.spikes.alpha = this.type.name === "spiked" ? 1 : 0;
    if (userInput) {
      this.sprite.position.setTo(x, y);
    } else {
      this.sprite.body.position.setTo(x, y);
    }
    this.star.resetStar(noStars);
    return this;
  };

  Platform.prototype.getRandomY = function() {
    var right, rnd;
    right = this.game.platforms.getRightmostPlatform();
    rnd = this.game.rnd.integerInRange(100, this.game.height - 150);
    if (rnd > right.y) {
      return this.game.rnd.integerInRange(right.y, right.y + 120);
    } else {
      return rnd;
    }
  };

  Platform.prototype.getRandomType = function() {
    var key, random, right, sum, tmp;
    right = this.game.platforms.getRightmostPlatform();
    if (right.type.name === "spiked") {
      return CFG.platformTypes.normal;
    }
    sum = 0;
    for (key in CFG.platformTypes) {
      sum += CFG.platformTypes[key].chance;
    }
    random = this.game.rnd.integerInRange(1, sum);
    tmp = 0;
    for (key in CFG.platformTypes) {
      tmp += CFG.platformTypes[key].chance;
      if (tmp >= random) {
        return CFG.platformTypes[key];
      }
    }
  };

  return Platform;

})();



},{"../models/star.coffee":6}],4:[function(require,module,exports){
var Platform, Platforms;

Platform = require('../models/platform.coffee');

module.exports = Platforms = (function() {
  function Platforms(state) {
    this.state = state;
    this.game = this.state.game;
    this.platforms = [];
    this.game.platforms = this;
    this.initPlatforms();
  }

  Platforms.prototype.update = function() {
    var i, item, len, ref;
    ref = this.platforms;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      item.update();
    }
    return this.generatePlatforms();
  };

  Platforms.prototype.generatePlatforms = function() {
    var rightmost;
    rightmost = this.getRightmostPlatform();
    if (rightmost.sprite.x < this.game.width * .7) {
      return this.requestPlatform();
    }
  };

  Platforms.prototype.initPlatforms = function() {
    this.requestPlatform(0, 250, CFG.platformTypes.normal, false, true);
    this.requestPlatform(150, 250, CFG.platformTypes.normal, false, true);
    this.requestPlatform(300, 250, CFG.platformTypes.spiked, false, true);
    return this.requestPlatform(450, 250, CFG.platformTypes.normal, false, true);
  };

  Platforms.prototype.requestPlatform = function(x, y, type, userInput, noStars) {
    var i, item, leftmost, len, ref;
    if (userInput) {
      ref = this.platforms;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (Phaser.Rectangle.intersects(item.sprite, new Phaser.Rectangle(x, y, item.sprite.width, item.sprite.height))) {
          return;
        }
      }
    }
    leftmost = this.getFirstAvailablePlatform();
    if (leftmost) {
      return leftmost.reset(x, y, type, noStars, userInput);
    } else {
      return new Platform(this.state, x, y, type, noStars);
    }
  };

  Platforms.prototype.getRightmostPlatform = function() {
    var i, item, len, ref, rightmost;
    rightmost = this.platforms[0];
    ref = this.platforms;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item.sprite.body.x > rightmost.sprite.body.x) {
        rightmost = item;
      }
    }
    return rightmost;
  };

  Platforms.prototype.getFirstAvailablePlatform = function() {
    var i, item, len, ref;
    ref = this.platforms;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item.sprite.body.x + item.sprite.body.width < 0) {
        return item;
      }
    }
  };

  Platforms.prototype.setPlatformsSpeed = function() {
    var i, item, len, ref, results;
    ref = this.platforms;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results.push(item.sprite.body.velocity.setTo(-CFG.platformSpeed, 0));
    }
    return results;
  };

  return Platforms;

})();



},{"../models/platform.coffee":3}],5:[function(require,module,exports){
var Player;

module.exports = Player = (function() {
  function Player(state) {
    this.state = state;
    this.game = this.state.game;
    this.sprite = this.game.add.sprite(0, this.game.height * .4, 'dude');
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.y = CFG.gravity;
    this.sprite.animations.add('right', [0, 1, 2], 10, true);
    this.sprite.scale.setTo(.5, .5);
    this.game.player = this;
  }

  Player.prototype.update = function() {
    this.game.player.sprite.body.x = this.game.width * CFG.playerPositionX;
    if (this.game.player.sprite.body.y > this.game.height) {
      return this.state.end();
    }
  };

  Player.prototype.jump = function() {
    if (!this.game.tutorial && (this.game.player.sprite.body.blocked.down || this.game.player.sprite.body.wasTouching.down)) {
      return this.game.player.sprite.body.velocity.y = -CFG.jumpVelocity;
    }
  };

  return Player;

})();



},{}],6:[function(require,module,exports){
var Star;

module.exports = Star = (function() {
  function Star(state, platform, noStars) {
    var spawns;
    this.state = state;
    this.platform = platform;
    this.game = this.state.game;
    this.relX = this.platform.sprite.body.halfWidth;
    this.relY = this.platform.sprite.body.height;
    this.sprite = this.game.add.sprite(this.platform.sprite.body.x + this.relX, this.platform.sprite.body.y - this.relY, 'star');
    this.sprite.anchor.setTo(.5, 1);
    spawns = !noStars && this.platform.type.starChance && this.game.rnd.integerInRange(0, 100) <= this.platform.type.starChance;
    this.sprite.alpha = spawns ? 1 : 0;
    this.alive = spawns ? true : false;
  }

  Star.prototype.update = function() {
    var playerBounds, starBounds;
    starBounds = this.sprite.getBounds();
    playerBounds = this.game.player.sprite.getBounds();
    if (this.alive && Phaser.Rectangle.intersects(starBounds, playerBounds)) {
      this.sprite.alpha = 0;
      this.alive = false;
      this.game.starCount += 1;
    }
    return this.sprite.position.setTo(this.platform.sprite.body.x + this.relX, this.platform.sprite.body.y - this.relY);
  };

  Star.prototype.resetStar = function(noStar) {
    if (!noStar && this.platform.type.starChance && this.game.rnd.integerInRange(0, 100) <= this.platform.type.starChance) {
      this.sprite.alpha = 1;
      return this.alive = true;
    }
  };

  return Star;

})();



},{}],7:[function(require,module,exports){
module.exports = {
  preload: function() {
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('platform', 'assets/platform.png');
    this.game.load.image('spikes', 'assets/spikes.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.image('frame', 'assets/frame.png');
    this.game.load.image('platform-btn', 'assets/platform-btn.png');
    this.game.load.image('pause-btn', 'assets/pause-btn.png');
    this.game.load.image('pause-overlay', 'assets/pause-overlay.png');
    return this.game.load.spritesheet('dude', 'assets/dude.png', 73, 133);
  },
  init: function() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.maxWidth = 800;
    this.game.scale.maxHeight = 450;
    this.game.scale.pageAlignHorizontally = true;
    return this.game.scale.pageAlignVertically = true;
  },
  render: function() {
    return this.game.state.start('Game');
  }
};



},{}],8:[function(require,module,exports){
module.exports = {
  create: function() {
    var restart, score;
    score = this.game.add.text(this.game.world.width / 2, this.game.world.height * .5, 'Your score: ' + parseInt(this.game.score), {
      font: '24px sans-serif',
      fill: '#FFF'
    });
    restart = this.game.add.text(this.game.world.width / 2, this.game.world.height * .6, 'tap to restart...', {
      font: '16px sans-serif',
      fill: '#FFF'
    });
    score.anchor.setTo(0.5, 0.5);
    return restart.anchor.setTo(0.5, 0.5);
  },
  update: function() {
    return this.game.input.onTap.add((function(_this) {
      return function() {
        return _this.game.state.start('Game');
      };
    })(this));
  }
};



},{}],9:[function(require,module,exports){
var Platforms, Player, UI;

Platforms = require('../models/platforms.coffee');

Player = require('../models/player.coffee');

UI = require('../ui/ui.coffee');

module.exports = {
  init: function() {
    this.game.tutorial = true;
    this.game.score = 0;
    return this.game.starCount = 0;
  },
  preload: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, this.game.width, this.game.height);
    return this.game.time.advancedTiming = true;
  },
  create: function() {
    this.game.add.sprite(0, 0, 'sky');
    new Player(this);
    new Platforms(this);
    return new UI(this);
  },
  update: function() {
    if (!this.game.tutorial) {
      this.game.score += .1;
    }
    this.game.platforms.update();
    this.game.ui.update();
    return this.game.player.update();
  },
  end: function() {
    return this.game.state.start('End');
  }
};



},{"../models/platforms.coffee":4,"../models/player.coffee":5,"../ui/ui.coffee":11}],10:[function(require,module,exports){
module.exports = {
  preload: function() {}
};



},{}],11:[function(require,module,exports){
var UI;

module.exports = UI = (function() {
  function UI(state) {
    this.state = state;
    this.game = this.state.game;
    this.frame = this.game.add.sprite(0, this.game.height - this.game.cache.getImage('frame').height, 'frame');
    this.fps = this.game.add.text(this.game.width, this.game.height, '0 FPS', {
      font: '14px sans-serif',
      fill: '#FFF'
    });
    this.fps.anchor.setTo(1, 1);
    this.tutorialText = this.game.add.text(this.game.width / 2, this.game.height - this.frame.height, 'Begin by dragging a platform on the playground...', {
      font: '16px sans-serif',
      fill: '#FFF'
    });
    this.tutorialText.anchor.setTo(.5, 1);
    this.starsText = this.game.add.text(this.game.width / 2, 0, '', {
      font: '16px sans-serif',
      fill: '#FFF'
    });
    this.starsText.anchor.setTo(0.5, 0);
    this.scoreText = this.game.add.text(this.game.width, 0, '', {
      font: '16px sans-serif',
      fill: '#FFF'
    });
    this.scoreText.anchor.setTo(1, 0);
    this.draggedPlatform = this.game.add.sprite(this.game.width, this.game.height, 'platform');
    this.draggedPlatform.kill();
    this.firstDrag = true;
    this.platformDragBtn = this.game.add.button(this.game.width / 2, this.frame.position.y, 'platform-btn');
    this.platformDragBtn.anchor.setTo(.5, 0);
    this.pauseBtn = this.game.add.sprite(10, 10, 'pause-btn');
    this.game.input.onUp.add(this.onInputUp, this);
    this.game.input.onDown.add(this.onInputDown, this);
    this.game.ui = this;
  }

  UI.prototype.update = function() {
    this.fps.setText(this.game.time.fps + ' FPS');
    this.scoreText.setText('Score: ' + parseInt(this.game.score));
    this.starsText.setText('Stars: ' + this.game.starCount);
    if (this.dragging) {
      return this.draggedPlatform.position.setTo(this.game.input.x, this.game.input.y);
    }
  };

  UI.prototype.onInputDown = function() {
    if (this.game.paused) {
      this.game.paused = false;
      this.overlay.destroy();
      this.resumeText.destroy();
      return this.pauseText.destroy();
    } else if (this.isInputOver(this.platformDragBtn)) {
      this.dragging = true;
      return this.draggedPlatform.reset(this.game.input.x, this.game.input.y);
    } else if (this.isInputOver(this.pauseBtn)) {
      this.game.paused = true;
      this.overlay = this.game.add.sprite(0, 0, 'pause-overlay');
      this.pauseText = this.game.add.text(this.game.width / 2, this.game.height * .4, 'Game paused', {
        font: '25px sans-serif',
        fill: '#FFF'
      });
      this.pauseText.anchor.setTo(.5, .5);
      this.resumeText = this.game.add.text(this.game.width / 2, this.game.height * .5, 'tap to resume...', {
        font: '16px sans-serif',
        fill: '#FFF'
      });
      return this.resumeText.anchor.setTo(.5, .5);
    } else {
      return this.game.player.jump();
    }
  };

  UI.prototype.onInputUp = function() {
    var success;
    if (this.draggedPlatform.alive && this.game.input.y < this.game.ui.frame.position.y - this.draggedPlatform.height) {
      success = this.game.platforms.requestPlatform(this.game.input.x, this.game.input.y, CFG.platformTypes.normal, true, true);
      if (success && this.firstDrag) {
        this.onFirstDrag();
      }
    }
    return this.draggedPlatform.kill();
  };

  UI.prototype.onFirstDrag = function() {
    this.firstDrag = false;
    this.game.tutorial = false;
    this.tutorialText.destroy();
    this.game.platforms.setPlatformsSpeed();
    return this.game.player.sprite.animations.play('right');
  };

  UI.prototype.isInputOver = function(sprite) {
    var x, y;
    x = this.game.input.x + sprite.anchor.x * sprite.width;
    y = this.game.input.y + sprite.anchor.y * sprite.height;
    return sprite.x < x && sprite.x + sprite.width > x && sprite.y < y && sprite.y + sprite.height > y;
  };

  return UI;

})();



},{}]},{},[2])