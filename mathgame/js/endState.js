function EndState(game, points) {
    var that = this;
    this.game = game;
    this.text = "You faking lost m8";
    this.scoreText = "Your score: " + points;
    this.context = game.context;
    
    this.context.font = game.height / 20 + "px serif";
    this.context.strokeStyle = "#ddd";
    this.context.lineWidth = game.height / 400;

    this.backButton = new Button(
        game.width/5, 
        game.height/1.25,
        game.width - game.width / 2.5,
        game.height/10,
        "BACK", 
        function(){
            game.state = new MenuState(game);
        }
    );
};

EndState.prototype.draw = function()
{  
	this.context.fillStyle = "#fff";
    this.context.fillText(this.scoreText, this.game.width / 2.0 - this.context.measureText(this.scoreText).width / 2.0 , this.game.height / 2);
	this.context.fillText(this.text, this.game.width / 2.0 - this.context.measureText(this.text).width / 2.0 , this.game.height / 3);
    this.context.fillStyle = "#2AFFE8";
    this.backButton.draw(this.context);
};
 
EndState.prototype.update = function() 
{
};