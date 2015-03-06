function onMouseDown(e, buttons, questions, numberField){
    for(var i = 0; i < buttons.length; i++){
        if( buttons[i].contains(e.pageX, e.pageY) ){
            buttons[i].activate();
            numberField.numberPressed(i, questions);
        }
    }
}

function onMouseUp(buttons){
    // de-activate all the buttons
    buttons.forEach(function(b){
        b.deactivate();
    });
}