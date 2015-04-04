function Question() {
    this.x = 0;
    this.y = 0;
    this.velocity = 0;
    this.width = 100;
    this.height = 40;
    this.text = "";
    this.value = 0;
}
 
Question.prototype.update = function()
{
    this.y += this.velocity;
};
 
Question.prototype.draw = function(ctx)
{
    drawEllipseByCenter(ctx, this.x, this.y, this.width, this.height);
    ctx.fillText(this.text, this.x - ctx.measureText(this.text).width / 2.0 , this.y + 5);
};

function generateQuestion(ctx, questions)
{
    var that = this;
    var tmp = new Question();
    tmp.x = Math.random() * (ctx.canvas.width - tmp.width) + tmp.width / 2;
    tmp.y = 0 - tmp.height;
    tmp.velocity = 2;
    generateQuestionText(tmp);
    questions.push(tmp);
    console.log("questions", questions);

    setTimeout(function(){
        generateQuestion(ctx, questions);
    }, 3000);
}

function generateQuestionText(q)
{
    var operation = getRandomInt(0, 4);
    
    if( operation == 0){ // plus
        var first = getRandomInt(1,50);
        var second = getRandomInt(1,50);

        q.text = first + "+" + second;
        q.value = first + second;
    }
    else if( operation == 1){ // minus
        var first = getRandomInt(1,50);
        var second = getRandomInt(1,50);
        if( first < second){
            second = [first, first = second][0];
        }

        q.text = first + "-" + second;
        q.value = first - second;
    }
    else if( operation == 2){ // multiply
        var first = getRandomInt(1,10);
        var second = getRandomInt(1,10);

        q.text = first + "*" + second;
        q.value = first * second;
    }
    else if( operation == 3){ // divide
        var first = getRandomInt(1,10);
        var second = getRandomInt(1,10);

        q.text = (first * second) + "/" + second;
        q.value = first;
    }
}