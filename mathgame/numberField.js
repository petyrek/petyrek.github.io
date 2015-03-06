function NumberField(ctx) 
{
    this.x = 0;
    this.y = ctx.canvas.height / 11 * 9;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height / 11;
    this.text = "";
}
 
NumberField.prototype.draw = function(ctx)
{
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillText(this.text, this.x + this.width / 2.0 - ctx.measureText(this.text).width / 2.0 , this.y + this.height / 2.0 + 5);
}

NumberField.prototype.numberPressed = function(i, questions)
{ 
    if(i == 10){
        this.text = this.text.substring(0, this.text.length - 1);
    }
    else if (this.text === "0"){
        if(i < 9){
            this.text = (i + 1) + "";
        }
    }
    else if( this.text.length < 10 ){
        if( i == 9){
            this.text += 0;
        }
        else{
            this.text += (i + 1);
        }
    }
    this.checkAnswer(questions);
}

NumberField.prototype.checkAnswer = function(questions)
{
    var value = parseInt(this.text);
    var that = this;
    questions.forEach(function(q, index, object){
        if(value == q.value){ // if the numField matches an answer to the question
            object.splice(index, 1); // remove the item from the collection
            that.text = "";
            return;
        }
    });
}