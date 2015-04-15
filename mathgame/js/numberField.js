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
    var off = ctx.lineWidth;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#171717";
    ctx.fillRect(this.x + off / 2, this.y + off / 2, this.width - off, this.height - off);
    ctx.fillText(this.text, this.x + this.width / 2.0 - ctx.measureText(this.text).width / 2.0 , this.y + this.height / 2.0);
}

NumberField.prototype.numberPressed = function(i, questions, score)
{ 
    if(i == 11){ // delete character has been pressed
        this.text = this.text.substring(0, this.text.length - 1); 
    }
    else if (this.text === "0"){ // 0 is in the number field and number is pressed
        if(i < 10){
            this.text = i + "";
        }
    }
    else if( this.text.length < 10 ){
        if( i == 10){
            this.text += 0; // zero is pressed
        }
        else{
            this.text += i; // number is pressed
        }
    }
    this.checkAnswers(questions, score);
}

NumberField.prototype.checkAnswer = function(q)
{
    var value = parseInt(this.text);
    var that = this;
    if(value == q.value){ // if the numField matches an answer to the question
        this.text = "";  
        return true;
    }
    return false;
}

NumberField.prototype.checkAnswers = function(questions, score)
{
    var value = parseInt(this.text);
    var that = this;
    questions.forEach(function(q, index, object){
        if(value == q.value){ // if the numField matches an answer to the question
            object.splice(index, 1); // remove the item from the collection
            that.text = "";
            score.increaseScore();
            return;
        }
    });
}