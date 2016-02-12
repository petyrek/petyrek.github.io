(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CFG;

window.CFG = CFG = {
  platformSpeed: 320,
  gravity: 2000,
  jumpVelocity: 250,
  maxJumpTime: 30,
  shieldDuration: 300,
  playerPositionX: .1,
  shieldCost: 10,
  platformGeneration: [
    {
      platformSpawnTimeMin: 40,
      platformSpawnTimeMax: 78,
      platformSpawnChance: 8
    }, {
      platformSpawnTimeMin: 90,
      platformSpawnTimeMax: 130,
      platformSpawnChance: 2
    }
  ],
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
  var States, admobid, game;

  require('./config/config.coffee');

  States = {
    Boot: require('./states/boot.coffee'),
    Loader: require('./states/loader.coffee'),
    Game: require('./states/game.coffee'),
    End: require('./states/end.coffee')
  };

  window.game = game = new Phaser.Game(800, 450, Phaser.CANVAS, '');

  game.state.add('Boot', States.Boot);

  game.state.add('Loader', States.Loader);

  game.state.add('Game', States.Game);

  game.state.add('End', States.End);

  window.admobid = admobid = {
    interstitial: 'none'
  };

  if (/(android)/i.test(navigator.userAgent)) {
    admobid.interstitial = 'android';
  } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid.interstitial = 'ca-app-pub-4498572025163243/2931820618';
  } else {
    admobid.interstitial = 'default';
  }

}).call(this);

},{"./config/config.coffee":1,"./states/boot.coffee":7,"./states/end.coffee":8,"./states/game.coffee":9,"./states/loader.coffee":10}],3:[function(require,module,exports){
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
    if (!this.game.tutorial) {
      player.animations.play('right');
    }
    if (platform["class"].type.name === "spiked" && !this.game.player.shield.alive) {
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
    var right;
    right = this.game.platforms.getRightmostPlatform();
    return this.game.rnd.integerInRange(this.game.height * .225, this.game.height * .625);
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
    this.platformGenerationInterval = 0;
    this.timeSinceLastGeneration = 0;
  }

  Platforms.prototype.update = function() {
    var i, item, len, ref;
    ref = this.platforms;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      item.update();
    }
    if (!this.game.tutorial) {
      return this.generatePlatforms();
    }
  };

  Platforms.prototype.generatePlatforms = function() {
    this.timeSinceLastGeneration += 1;
    if (this.timeSinceLastGeneration > this.platformGenerationInterval) {
      this.timeSinceLastGeneration = 0;
      this.platformGenerationInterval = this.generatePlatformDistance();
      return this.requestPlatform();
    }
  };

  Platforms.prototype.initPlatforms = function() {
    this.requestPlatform(0, 250, CFG.platformTypes.normal, false, true);
    this.requestPlatform(130, 250, CFG.platformTypes.normal, false, true);
    this.requestPlatform(260, 250, CFG.platformTypes.spiked, false, true);
    return this.requestPlatform(390, 250, CFG.platformTypes.normal, false, true);
  };

  Platforms.prototype.requestPlatform = function(x, y, type, userInput, noStars) {
    var leftmost;
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

  Platforms.prototype.generatePlatformDistance = function() {
    var i, item, j, len, len1, random, ref, ref1, sum, tmp;
    sum = 0;
    ref = CFG.platformGeneration;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      sum += item.platformSpawnChance;
    }
    random = this.game.rnd.integerInRange(1, sum);
    tmp = 0;
    ref1 = CFG.platformGeneration;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      item = ref1[j];
      tmp += item.platformSpawnChance;
      if (tmp >= random) {
        return this.game.rnd.integerInRange(item.platformSpawnTimeMin, item.platformSpawnTimeMax);
      }
    }
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
    this.sprite.animations.add('right', [0, 1, 2, 3, 4], 10, true);
    this.shield = this.game.add.sprite(0, 0, 'shield');
    this.shield.anchor.setTo(.5, .5);
    this.shield.kill();
    this.shieldDuration = 0;
    this.jumpSound = this.game.add.audio('jump', .5);
    this.jumping = false;
    this.jumpTime = 0;
    this.game.player = this;
  }

  Player.prototype.update = function() {
    this.sprite.body.x = this.game.width * CFG.playerPositionX;
    this.shield.x = this.sprite.body.x + this.sprite.body.halfWidth;
    this.shield.y = this.sprite.body.y + this.sprite.body.halfHeight;
    if (this.shield.alive) {
      this.shieldDuration += 1;
    }
    if (this.shieldDuration > CFG.shieldDuration) {
      this.deactivateShield();
    }
    if (this.jumping) {
      this.sprite.animations.stop('right');
      this.sprite.animations.frame = 1;
      this.sprite.body.velocity.y = -CFG.jumpVelocity - this.jumpTime;
      this.jumpTime += 1;
      if (this.jumpTime > CFG.maxJumpTime) {
        this.stop();
      }
    }
    if (this.sprite.body.y > this.game.height) {
      return this.state.end();
    }
  };

  Player.prototype.jump = function() {
    if (!this.game.tutorial && this.sprite.body.touching.down) {
      if (this.game.soundEnabled) {
        this.jumpSound.play();
      }
      return this.jumping = true;
    }
  };

  Player.prototype.stop = function() {
    this.jumping = false;
    return this.jumpTime = 0;
  };

  Player.prototype.activateShield = function() {
    this.shield.reset();
    this.shield.alpha = 0;
    return this.game.add.tween(this.shield).to({
      alpha: 1
    }, 1000, "Linear", true);
  };

  Player.prototype.deactivateShield = function() {
    this.shield.kill();
    return this.shieldDuration = 0;
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
    this.relY = this.platform.sprite.body.halfHeight;
    this.sprite = this.game.add.sprite(this.platform.sprite.body.x + this.relX, this.platform.sprite.body.y - this.relY, 'star');
    this.sprite.anchor.setTo(.5, .5);
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
  init: function() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.maxWidth = 800;
    this.game.scale.maxHeight = 450;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    return this.game.scale.forceLandscape = true;
  },
  preload: function() {
    return this.game.load.image('logo', 'assets/images/logo.png');
  },
  create: function() {
    return this.game.state.start('Loader');
  }
};



},{}],8:[function(require,module,exports){
module.exports = {
  init: function() {
    if (this.game.soundEnabled) {
      this.game.music.stop();
    }
    if (typeof AdMob !== "undefined" && AdMob !== null) {
      return AdMob.showInterstitial();
    }
  },
  preload: function() {
    this.handleScores();
    return this.saveStars();
  },
  create: function() {
    var bg, score;
    bg = this.game.add.sprite(0, 0, 'endscreen');
    return score = this.game.add.bitmapText(this.game.world.width / 2, this.game.world.height * .42, 'cimbrian', '' + parseInt(this.game.score), 65);
  },
  update: function() {
    return this.game.input.onTap.add((function(_this) {
      return function() {
        return _this.game.state.start('Game');
      };
    })(this));
  },
  handleScores: function() {
    var scores;
    scores = window.localStorage.getItem('scores') || [];
    if (scores.length) {
      scores = JSON.parse(scores);

      /*index = 0
      for score, index in scores
        t = @game.add.bitmapText @game.world.width / 2, @game.world.height * (3.5 + ((index + 1) * .7)) / 10, 'cimbrian',(index + 1) + '. ' + score, 20
        t.anchor.setTo .5, .5
       */
    }
    scores.push(parseInt(this.game.score));
    scores.sort(function(a, b) {
      return b - a;
    });
    scores = scores.slice(0, 3);
    return localStorage.setItem('scores', JSON.stringify(scores));
  },
  saveStars: function() {
    return localStorage.setItem('stars', this.game.starCount);
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
    this.game.starCount = 0;
    this.game.soundEnabled = window.localStorage.getItem('soundEnabled') === 'true';
    return this.game.starCount = parseInt(window.localStorage.getItem('stars') || 0);
  },
  preload: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, this.game.width, this.game.height);
    this.game.time.advancedTiming = true;
    if (typeof AdMob !== "undefined" && AdMob !== null) {
      return AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: false
      });
    }
  },
  create: function() {
    this.bg = this.game.add.tileSprite(0, 0, 800, 450, 'bg');
    this.game.music = this.game.add.audio('music', .2, true);
    if (this.game.soundEnabled) {
      this.game.music.play();
    }
    new Player(this);
    new Platforms(this);
    return new UI(this);
  },
  update: function() {
    if (!this.game.tutorial) {
      this.game.score += .1;
      this.bg.tilePosition.x -= 1;
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
  init: function() {
    this.logo = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "logo");
    this.logo.anchor.setTo(.5, .5);
    return this.logo.alpha = 0;
  },
  preload: function() {
    this.game.load.setPreloadSprite(this.logo, 0);
    this.game.load.image('bg', 'assets/images/bg.jpg');
    this.game.load.image('endscreen', 'assets/images/endscreen.jpg');
    this.game.load.image('platform', 'assets/images/platform.png');
    this.game.load.image('spikes', 'assets/images/spikes.png');
    this.game.load.image('star', 'assets/images/star.png');
    this.game.load.image('shield', 'assets/images/shield.png');
    this.game.load.image('frame', 'assets/images/frame.png');
    this.game.load.image('platform-btn', 'assets/images/platform-btn.png');
    this.game.load.image('shield-btn', 'assets/images/shield-btn.png');
    this.game.load.image('pause-btn', 'assets/images/pause-btn.png');
    this.game.load.image('tutorial-overlay', 'assets/images/tutorial-overlay.png');
    this.game.load.image('pause-overlay', 'assets/images/pause-overlay.png');
    this.game.load.spritesheet('dude', 'assets/images/dude.png', 36, 64);
    this.game.load.spritesheet('sound-btn', 'assets/images/sound-btn.png', 60, 55);
    this.game.load.bitmapFont('cimbrian', 'assets/fonts/cimbrian.png', 'assets/fonts/cimbrian.fnt');
    this.game.load.audio('music', ['assets/sounds/music.aac', 'assets/sounds/music.ogg']);
    return this.game.load.audio('jump', ['assets/sounds/jump.aac', 'assets/sounds/jump.ogg']);
  },
  create: function() {
    return this.game.add.tween(this.logo).to({
      alpha: 1
    }, 1, "Linear", true).onComplete.add(function() {
      return this.game.state.start('Game');
    }, this);
  }
};



},{}],11:[function(require,module,exports){
var UI;

module.exports = UI = (function() {
  function UI(state) {
    this.state = state;
    this.game = this.state.game;
    this.frame = this.game.add.sprite(0, this.game.height, 'frame');
    this.frame.anchor.setTo(0, 1);
    this.fps = this.game.add.bitmapText(this.game.width, 0, 'cimbrian', '0 fps', 20);
    this.fps.anchor.setTo(1, 0);
    this.scoreText = this.game.add.bitmapText(this.game.width * .915, this.game.height - this.frame.height * .75, 'cimbrian', '', 26);
    this.scoreText.anchor.setTo(1, 0);
    this.draggedPlatform = this.game.add.sprite(this.game.width, this.game.height, 'platform');
    this.draggedPlatform.kill();
    this.firstDrag = true;
    this.shieldBtn = this.game.add.sprite(this.game.width * .05, this.game.height * 0.975, 'shield-btn');
    this.shieldBtn.anchor.setTo(0, 1);
    this.starCountText = this.game.add.bitmapText(this.game.width * 0.25, this.game.height * .9, 'cimbrian', '0/10', 25);
    this.starCountText.anchor.setTo(1, 0);
    this.starCountIcon = this.game.add.sprite(this.starCountText.x + 5, this.game.height * .9, 'star');
    this.platformDragBtn = this.game.add.sprite(this.game.width / 2, this.game.height * .83, 'platform-btn');
    this.platformDragBtn.anchor.setTo(.5, 0);
    this.platformDragBtnPointer = null;
    this.playerJumpPointer = null;
    this.soundBtn = this.game.add.sprite(this.game.world.width * .925, this.game.world.height * .975, 'sound-btn');
    this.soundBtn.anchor.setTo(1, 1);
    this.soundBtn.frame = this.game.soundEnabled ? 0 : 1;
    this.pauseBtn = this.game.add.sprite(10, 10, 'pause-btn');
    this.tutorialOverlay = this.game.add.sprite(0, 0, 'tutorial-overlay');
    this.game.input.onUp.add(this.onInputUp, this);
    this.game.input.onDown.add(this.onInputDown, this);
    this.game.ui = this;
  }

  UI.prototype.update = function() {
    this.fps.setText(this.game.time.fps + ' fps');
    this.scoreText.setText('Score: ' + parseInt(this.game.score));
    this.starCountText.setText(this.game.starCount + '/' + CFG.shieldCost);
    if (this.draggedPlatform.alive) {
      return this.draggedPlatform.position.setTo(this.platformDragBtnPointer.x, this.platformDragBtnPointer.y);
    }
  };

  UI.prototype.onInputDown = function(pointer) {
    if (this.game.paused) {
      this.game.paused = false;
      this.overlay.destroy();
      this.resumeText.destroy();
      return this.pauseText.destroy();
    } else if (this.isInputOver(this.platformDragBtn)) {
      this.draggedPlatform.reset(this.game.input.x, this.game.input.y);
      return this.platformDragBtnPointer = pointer;
    } else if (this.isInputOver(this.shieldBtn)) {
      if (this.game.starCount > CFG.shieldCost) {
        this.game.starCount -= CFG.shieldCost;
        return this.game.player.activateShield();
      }
    } else if (this.isInputOver(this.soundBtn)) {
      return this.toggleSound();
    } else if (this.isInputOver(this.pauseBtn)) {
      this.game.paused = true;
      this.overlay = this.game.add.sprite(0, 0, 'pause-overlay');
      this.pauseText = this.game.add.bitmapText(this.game.width / 2, this.game.height * .4, 'cimbrian', 'Game paused', 25);
      this.pauseText.anchor.setTo(.5, .5);
      this.resumeText = this.game.add.bitmapText(this.game.width / 2, this.game.height * .5, 'cimbrian', 'tap to resume...', 20);
      return this.resumeText.anchor.setTo(.5, .5);
    } else {
      this.playerJumpPointer = pointer;
      return this.game.player.jump();
    }
  };

  UI.prototype.onInputUp = function(pointer) {
    if (pointer === this.platformDragBtnPointer) {
      if (this.draggedPlatform.alive && this.game.input.y < this.game.ui.frame.position.y - this.game.ui.frame.height) {
        this.game.platforms.requestPlatform(this.game.input.x, this.game.input.y, CFG.platformTypes.normal, true, true);
        if (this.firstDrag) {
          this.onFirstDrag();
        }
      }
      this.draggedPlatform.kill();
    }
    if (pointer === this.playerJumpPointer) {
      return this.game.player.stop();
    }
  };

  UI.prototype.onFirstDrag = function() {
    this.firstDrag = false;
    this.game.tutorial = false;
    this.tutorialOverlay.destroy();
    this.game.platforms.setPlatformsSpeed();
    return this.game.player.sprite.animations.play('right');
  };

  UI.prototype.isInputOver = function(sprite) {
    var x, y;
    x = this.game.input.x + sprite.anchor.x * sprite.width;
    y = this.game.input.y + sprite.anchor.y * sprite.height;
    return sprite.x < x && sprite.x + sprite.width > x && sprite.y < y && sprite.y + sprite.height > y;
  };

  UI.prototype.toggleSound = function() {
    if (this.game.soundEnabled) {
      this.game.music.stop();
      this.soundBtn.frame = 1;
      this.game.soundEnabled = false;
    } else {
      this.game.music.play();
      this.soundBtn.frame = 0;
      this.game.soundEnabled = true;
    }
    return window.localStorage.setItem('soundEnabled', this.game.soundEnabled);
  };

  return UI;

})();



},{}]},{},[2])