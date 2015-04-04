function Button(x, y, width, height, text, onclick) 
{
    var that = this;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.active = false;
    this.value = 0;
    this.onclick = onclick;
    this.keyCode;

    window.addEventListener("mousedown", function(event){
    	that.onMouseDown(event);
    }, false);

    window.addEventListener("mouseup", function(event){
    	that.onMouseUp(event);
    }, false);

    window.addEventListener("keydown", function(event){
    	that.onKeyDown(event);
    }, false);

        window.addEventListener("keyup", function(event){
    	that.onKeyUp(event);
    }, false);
}
 
Button.prototype.onMouseDown = function(event) 
{
	var canvas = document.getElementById("game");
	x = event.pageX - canvas.offsetLeft;
	y = event.pageY - canvas.offsetTop;
	if ( this.contains(x,y) ) {
		this.active = true;
	}
}
Button.prototype.onMouseUp = function(event) 
{
	this.active = false;
	var canvas = document.getElementById("game");
	x = event.pageX - canvas.offsetLeft;
	y = event.pageY - canvas.offsetTop;
	if ( this.contains(x,y) ) {
		this.onclick();
	}
}
Button.prototype.onKeyDown = function(event) 
{
	if(event.keyCode === this.keyCode){
		this.active = true;
		stopBackspaceKey();
	}
}
Button.prototype.onKeyUp = function(event) 
{
	if(event.keyCode === this.keyCode){
		this.active = false;
		this.onclick();
		stopBackspaceKey();
	}
}
Button.prototype.contains = function(x, y)
{
	return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
}

Button.prototype.draw = function(ctx)
{
	var t = this.text;
	if(this.active){ t = this.text + "!"}
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillText(t, this.x + this.width / 2.0 - ctx.measureText(this.text).width / 2.0 , this.y + this.height / 2.0 + 5);
}