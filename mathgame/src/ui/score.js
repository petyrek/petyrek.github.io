function Score() {
  this.points = 0;
  this.text = new Text('SCORE: ' + this.points, 0, 0, "#000", 0, 1);
}

Score.prototype.increaseScore = function() {
  this.points += 10;
  this.text.setText('SCORE: ' + this.points);
}

Score.prototype.draw = function(ctx) {
  this.text.draw(ctx);
}
