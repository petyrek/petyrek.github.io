function MenuState(game) {
    var that = this;
    this.game = game;
    this.context = game.context;
    
    this.startButton = new Button(100,100,100,100,"Play", function(){
        game.state = new GameState(game);
    });
};

MenuState.prototype.draw = function()
{  
    this.startButton.draw(this.context);
};
 
MenuState.prototype.update = function() 
{
};