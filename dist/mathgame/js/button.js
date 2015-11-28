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
    this.altKeyCode;
    this.outlineColor = "#fff";
    this.fontColor = "#fff";
    this.fillColor = "#171717";

    window.addEventListener("mousedown", function(event){
    	that.onMouseDown(event);
    }, false);

    window.addEventListener("mouseup", function(event){
    	that.onMouseUp(event);
    }, false);

    window.addEventListener("keydown", function(event){
    	if (event.keyIdentifier === 'U+0008' || event.keyIdentifier === 'Backspace' || event.keyCode === '8'){
            event.preventDefault();
	    }
    	that.onKeyDown(event);

    }, false);

    window.addEventListener("keyup", function(event){
       	that.onKeyUp(event);
        if (event.keyIdentifier === 'U+0008' || event.keyIdentifier === 'Backspace' || event.keyCode === '8'){
            event.preventDefault();
	    } 	
    	
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
	if(event.keyCode === this.keyCode || event.keyCode === this.altKeyCode){
		this.active = true;
		
	}
}
Button.prototype.onKeyUp = function(event) 
{
	if(event.keyCode === this.keyCode || event.keyCode === this.altKeyCode){
		this.active = false;
		this.onclick();
	}
}
Button.prototype.contains = function(x, y)
{
	return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
}

Button.prototype.draw = function(ctx)
{
	var t = this.text;
    var off = ctx.lineWidth;
    ctx.strokeStyle = this.outlineColor;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    ctx.fillStyle = (this.active)?  this.fontColor : this.fillColor;
    ctx.fillRect(this.x + off / 2, this.y + off / 2, this.width - off, this.height - off);
    ctx.fillStyle = (this.active)?  this.fillColor : this.fontColor;
    ctx.fillText(t, this.x + this.width / 2.0 - ctx.measureText(this.text).width / 2.0 , this.y + this.height / 2.0);
}