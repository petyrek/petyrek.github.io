function Input() {
  this.mouseDown = false;
  this.mouseEvent = null;
  this.mouseEventFired = false;

  document.body.onclick = (e) => {
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
    let x = (this.mouseEvent.x - canvas.offsetLeft) * canvas.width / window.innerWidth;
    let y = (this.mouseEvent.y - canvas.offsetTop) * canvas.height / window.innerHeight;

    if(button.contains(x, y)){
      this.mouseEventFired = true;
      return true;
    }
  }
  else{
    return false;
  }
}
