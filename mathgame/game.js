function Game() {
    
    // setup canvas
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "#f00";
    this.context.font = "20px Calibri";
    this.context.strokeStyle = "#0f0";
    this.context.lineWidth = 5;

    this.numButtons = generateNumButtons(this.context);
    console.log("btns:", this.numButtons);

    // create number field
    this.numberField = new NumberField(this.context);

    // generate first question
    this.questions = [];
    generateQuestion(this.context, this.questions);

    // set question generation
    var that = this;
    setInterval(function(){
        generateQuestion(that.context, that.questions);
        that.numberField.checkAnswer(that.questions);
    }, 3000);

    // handle the mouseclick event
    canvas.onmousedown = function(e){
        onMouseDown(e, that.numButtons, that.questions, that.numberField);
    }
    canvas.onmouseup = function(e){
        onMouseUp(that.numButtons);
    }
}

Game.prototype.draw = function()
{
    var ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);
    
    this.numberField.draw(ctx);

    // draw ui buttons
    this.numButtons.forEach(function(b){
        b.draw(ctx);
    });

    // draw questions
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
};

var game = new Game();
function Run() {
    game.update();
    game.draw();
    setTimeout(Run, 1000/60);
}
Run();