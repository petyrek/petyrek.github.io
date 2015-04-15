function MenuState(game) {
    var that = this;
    this.game = game;
    this.context = game.context;
    
    this.context.font = game.height / 20 + "px serif";
    this.context.lineWidth = game.height / 400;

    this.startButton = new Button(
    	game.width/5, 
    	game.height/5,
    	game.width - game.width / 2.5,
    	game.height/10,
    	"PLAY", 
    	function(){
	        game.state = new GameState(game);
	    }
	);
};

MenuState.prototype.draw = function()
{  
    this.startButton.draw(this.context);
};
 
MenuState.prototype.update = function() 
{
};