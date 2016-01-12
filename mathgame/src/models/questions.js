function Questions(state) {
  this.state = state;
  this.ctx = state.ctx;

  this.questions = []
  this.generateQuestions();
}

Questions.prototype.generateQuestions = function() {
  this.questions.push(new Question(this.ctx));

  (function(that) {
    var time = 3000,
      delta = 100,
      tid;
    tid = setInterval(function() {
      if (window.blurred) {
        return;
      }
      time -= delta;
      if (time <= 0) {
        clearInterval(tid);
        that.generateQuestions();
      }
    }, delta);
  })(this);
}

Questions.prototype.draw = function() {
  this.questions.forEach((q) => {
    q.draw(this.ctx);
  });
}


Questions.prototype.update = function() {
  for(let q of this.questions){
    q.update();
  }
}
