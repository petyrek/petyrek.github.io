function Game() {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "#fff";
    this.context.font = "20px Calibri";
    this.context.strokeStyle = "#fff";
    this.context.lineWidth = 5;
    this.keys = new KeyListener();
    
    this.questions = [];
    this.generateQuestion(this.questions);


    var that = this;
    setInterval(function(){
        //that.generateQuestion(that.questions)
    }, 3000);
}

Game.prototype.draw = function()
{
    var ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);
    this.questions.forEach(function(q){
        q.draw(ctx);
    });
};
 
Game.prototype.update = function() 
{
    var that = this;
    this.questions.forEach(function(q, index, object){
        if(q.y - q.height / 2 > that.height){
            object.splice(index, 1); // remove the item from the collection
        }
        q.update(that.context);
    });

    if (this.keys.isPressed(83)) { // DOWN
    } else if (this.keys.isPressed(87)) { // UP
    }
};

Game.prototype.generateQuestion = function(questions)
{
    var tmp = new Question();
    tmp.x = Math.random() * (this.width - this.width / 2) + this.width / 2;
    tmp.y = 0 - tmp.height;
    tmp.velocity = 1;
    questions.push(tmp);
    console.log("questions", questions);
}

function Question() {
    this.x = 0;
    this.y = 0;
    this.velocity = 0;
    this.width = 100;
    this.height = 40;
    this.text = "5+4";
    this.value = 9;
}
 
Question.prototype.update = function()
{
    this.y += this.velocity;
};
 
Question.prototype.draw = function(p)
{
    drawEllipseByCenter(p, this.x, this.y, this.width, this.height);
    p.fillText(this.text, this.x - p.measureText(this.text).width / 2.0 , this.y + 5);
};


// KEY LISTENER
function KeyListener() {
    this.pressedKeys = [];
 
    this.keydown = function(e) {
        this.pressedKeys[e.keyCode] = true;
    };
 
    this.keyup = function(e) {
        this.pressedKeys[e.keyCode] = false;
    };
 
    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
}
 
KeyListener.prototype.isPressed = function(key)
{
    return this.pressedKeys[key] ? true : false;
};
 
KeyListener.prototype.addKeyPressListener = function(keyCode, callback)
{
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == keyCode)
            callback(e);
    });
};

function drawEllipseByCenter(ctx, cx, cy, w, h) {
  drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.stroke();
}



var game = new Game();
function Run() {
    game.update();
    game.draw();
    setTimeout(Run, 1000/60);
}

Run();