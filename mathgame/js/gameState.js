function GameState(game) {
    var that = this;
    this.game = game;
    this.context = game.context;

    this.lifes = new Lifes(3);
    this.score = new Score();

    // create the number buttons
    this.numButtons = this.generateNumButtons(this.context);

    // create number field
    this.numberField = new NumberField(this.context);

    // generate first question
    this.questions = [];
    generateQuestion(this.context, this.questions);
};

GameState.prototype.draw = function()
{  
    var that = this;
    // draw questions
    this.questions.forEach(function(q){
        q.draw(that.context);
    });

    this.lifes.draw(this.context);
    this.score.draw(this.context);
    
    this.numberField.draw(this.context);

    // draw ui buttons
    this.numButtons.forEach(function(b){
        b.draw(that.context);
    });
};
 
GameState.prototype.update = function() 
{
    var that = this;
    this.questions.forEach(function(q, index, object){
        if(q.y > that.game.height  * 10 / 11){ // question has fallen below the screen
            object.splice(index, 1); // remove the item from the collection
            that.lifes.lifes -= 1;
            if(that.lifes.lifes < 1){
                game.state = new EndState(game, that.score.points);
            }
        }
        if(that.numberField.checkAnswer(q)){ // question has been answered
            object.splice(index, 1);
            that.score.increaseScore();
        }
        q.update(that.context);
    });
};

GameState.prototype.generateNumButtons = function()
{
    var that = this;
    btns = [];
    for(var i = 1; i < 12; i++){
        var tmp = new Button();
        tmp.width = this.context.canvas.width / 11;
        tmp.height = this.context.canvas.height / 11;
        tmp.x = (i - 1)* this.context.canvas.width / 11;
        tmp.y = this.context.canvas.height - tmp.height;
        tmp.text = i + "";
        tmp.value = i;
        tmp.outlineColor = "#f00"
        tmp.onclick = function(){
            that.numberField.numberPressed( this.value, that.questions, that.score);
        }
        tmp.keyCode = i + 96;
        if( i == 10){ // zero comes after nine, it's better that way
            tmp.text = "0";
            tmp.value = 0;
            tmp.keyCode = 96;
        }
        if( i == 11){
            tmp.text = "del";
            tmp.keyCode = 8;
        }

        btns.push(tmp);
    }

    return btns;
}