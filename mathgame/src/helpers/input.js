function Input() {
  this.mouseDown = false;
  this.touchX = null;
  this.touchY = null;
  this.mouseEventFired = false;

  document.body.ontouchstart = (e) => {
    this.mouseDown = true;
    this.touchX = e.touches[0].screenX;
    this.touchY = e.touches[0].screenY;
  }
  document.body.ontouchend = (e) => {
    this.mouseDown = false;
    this.mouseEventFired = false;
  }
  document.body.onmousedown = (e) => {
    this.mouseDown = true;
    this.touchX = e.pageX;
    this.touchY = e.pageY;
  }
  document.body.onmouseup = () => {
    this.mouseDown = false;
    this.mouseEventFired = false;
  }
}

Input.prototype.isMouseDown = function(button){
  if (!this.mouseEventFired && this.mouseDown){
    let canvas = document.getElementById("game");
    let rect = canvas.getBoundingClientRect();

    let x = (this.touchX - rect.left) * ((window.innerWidth < canvas.width)? canvas.width / window.innerWidth : 1);
    let y = (this.touchY - rect.top) * ((window.innerHeight < canvas.height)? canvas.height / window.innerHeight : 1)

    if(button.contains(x, y)){
      this.mouseEventFired = true;
      return true;
    }
  }
  else{
    return false;
  }
}
