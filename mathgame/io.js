function onMouseDown(e, buttons, questions, numberField, score){
    for(var i = 0; i < buttons.length; i++){
        if( buttons[i].contains(e.pageX, e.pageY) ){
            buttons[i].activate();
            numberField.numberPressed(i, questions, score);
        }
    }
}

function onKeyPress(e, questions, numberField, score){
    if(e.keyCode > 93 && e.keyCode < 106){ // numbers 0 - 9
        numberField.numberPressed( e.keyCode - 97, questions, score);
    }
    if(e.keyCode == 8){ // backspace
        numberField.numberPressed( 10, questions, score);
    }
}

function onMouseUp(buttons){
    // de-activate all the buttons
    buttons.forEach(function(b){
        b.deactivate();
    });
}