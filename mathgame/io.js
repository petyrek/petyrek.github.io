function onMouseDown(e, buttons, questions, numberField, score){
    for(var i = 0; i < buttons.length; i++){
        if( buttons[i].contains(e.pageX, e.pageY) ){
            buttons[i].activate();
            numberField.numberPressed(i, questions, score);
        }
    }
}

function onMouseUp(buttons){
    // de-activate all the buttons
    buttons.forEach(function(b){
        b.deactivate();
    });
}