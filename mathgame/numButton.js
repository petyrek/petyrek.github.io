function NumButton() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.text = "";
    this.value = 0;
    this.active = false;
}
 
NumButton.prototype.draw = function(ctx)
{
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillText(this.text, this.x + this.width / 2.0 - ctx.measureText(this.text).width / 2.0 , this.y + this.height / 2.0 + 5);
};

NumButton.prototype.contains = function(x, y)
{
    return ( x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height );
}

NumButton.prototype.activate = function()
{
    this.active = true;
    // TODO : highlight it
}

NumButton.prototype.deactivate = function()
{
    this.active = false;
    // TODO : un-highlight it
}

function generateNumButtons(ctx)
{
    var btns = [];
    for(var i = 0; i < 11; i++){
        var tmp = new NumButton();
        tmp.width = ctx.canvas.width / 11;
        tmp.height = ctx.canvas.height / 11;
        tmp.x = i * ctx.canvas.width / 11;
        tmp.y = ctx.canvas.height - tmp.height;
        tmp.text = i + "";
        tmp.value = i;
        if( i == 10){
            tmp.text = "del";
        }

        btns.push(tmp);
    }

    return btns;
}