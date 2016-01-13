function Input() {
  this.mouseDown = false;
  this.mouseEvent = null;
  this.mouseEventFired = false;

  document.body.onmousedown = (e) => {
    this.mouseDown = true;
    this.mouseEvent = e;
  }
  document.body.onmouseup = () => {
    this.mouseDown = false;
    this.mouseEventFired = false;
  }
}

Input.prototype.isMouseDown = function(button){
  if (!this.mouseEventFired && this.mouseDown){
    let canvas = document.getElementById("game");
    let x = Input.mouseEvent.pageX - canvas.offsetLeft;
    let y = Input.mouseEvent.pageY - canvas.offsetTop;
    if(button.contains(x, y)){
      this.mouseEventFired = true;
      return true;
    }
  }
  else{
    return false;
  }
}
