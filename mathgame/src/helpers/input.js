function Input() {
  this.mouseDown = false;
  this.touchX = null;
  this.touchY = null;
  this.mouseEventFired = false;

  document.body.ontouchstart = (e) => {
    this.mouseDown = true;
    this.touchX = e.touches[0].pageX;
    this.touchY = e.touches[0].pageY;
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

    let scaleX = 1, scaleY = 1;
    if(window.innerWidth < canvas.width){
      scaleX = canvas.width / window.innerWidth;
    }
    if(canvas.width < canvas.clientWidth){
      scaleX = canvas.width / canvas.clientWidth;
    }

    if(window.innerHeight < canvas.height){
      scaleY = canvas.height / window.innerHeight;
    }
    if(canvas.height < canvas.clientHeight){
      scaleY = canvas.height / canvas.clientHeight;
    }

    let x = (this.touchX - rect.left) * scaleX;
    let y = (this.touchY - rect.top) * scaleY;
    if(button.contains(x, y)){
      this.mouseEventFired = true;
      return true;
    }
  }
  else{
    return false;
  }
}
