function EndState(game, points) {
    var that = this;
    this.game = game;
    this.text = "You faking lost m8";
    this.scoreText = "Your score: " + points;
    this.context = game.context;
    
    this.backButton = new Button(100,100,100,100,"Back", function(){
        game.state = new MenuState(game);
    });
};

EndState.prototype.draw = function()
{  
	this.context.fillText(this.scoreText, this.game.width / 2.0 - this.context.measureText(this.scoreText).width / 2.0 , this.game.height / 2.0 - 50);
	this.context.fillText(this.text, this.game.width / 2.0 - this.context.measureText(this.text).width / 2.0 , this.game.height / 2.0 + 5);
    this.backButton.draw(this.context);
};
 
EndState.prototype.update = function() 
{
};