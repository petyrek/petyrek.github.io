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
    this.touchX = e.x;
    this.touchY = e.y;
  }
  document.body.onmouseup = () => {
    this.mouseDown = false;
    this.mouseEventFired = false;
  }
}

Input.prototype.isMouseDown = function(button){
  if (!this.mouseEventFired && this.mouseDown){
    let canvas = document.getElementById("game");
    let x = (this.touchX - canvas.offsetLeft) * canvas.width / window.innerWidth;
    let y = (this.touchY - canvas.offsetTop) * canvas.height / window.innerHeight;

    if(button.contains(x, y)){
      this.mouseEventFired = true;
      return true;
    }
  }
  else{
    return false;
  }
}
