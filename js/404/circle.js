(function (p5) {
  'use strict';
  var sketch = function (p) {

    var system,
      mouseCount = 0,
      Circle,
      CircleSystem;

    Circle = function (pos) {
      var vx, vy;
      this.pos = pos.copy();
      vx = p.random() * 5.0 - 2.5;
      vy = p.random() * 5.0 - 2.5;
      this.vel = p.createVector(vx, vy);
      this.r = 200;
    };

    Circle.prototype.update = function () {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      
      this.pos.x = this.pos.x % p.width;
      if (this.pos.x < 0) {
        this.pos.x = p.width - this.pos.x;
      }
      this.pos.y = this.pos.y % p.height;
      if (this.pos.y < 0) {
        this.pos.y = p.height - this.pos.y;
      }
    };

    Circle.prototype.getPosition = function () {
      return this.pos;
    };

    CircleSystem = function () {
      var circle, i, vec;
      this.circles = [];
      for (i = 0; i < 30; i++) {
        vec = p.createVector(p.random() * p.width, p.random() * p.height);
        this.circles.push(new Circle(vec));
      }
    };

    CircleSystem.prototype.update = function () {
      var circle, i, j;
      for (i = 0; i < this.circles.length; i++) {
        circle = this.circles[i];
        circle.update();
      }
    };

    CircleSystem.prototype.draw = function () {
      var circle, pos, i;
      for (i = 0; i < this.circles.length; i++) {
        circle = this.circles[i];
        p.fill(255, 255, 255, 100);
        p.stroke(255);
        p.strokeWeight(5);
        p.ellipse(circle.pos.x, circle.pos.y, circle.r, circle.r);
      }
    };

    p.setup = function () {
      p.createCanvas(window.innerWidth, window.innerHeight);
      p.stroke(255);
      p.background(0);
      system = new CircleSystem();
    };

    p.draw = function () {
      p.background(0);
      system.update();
      system.draw();
      drawString();

    };


    p.windowResized = function () {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    function drawString() {
      var text, offset;
      p.fill(0);
      p.noStroke();
      p.textSize(60);
      text = "404";
      offset = p.textWidth(text);
      p.text(text, p.width / 2.0 - offset / 2.0, p.height / 2.0);
      text = "Not Found";
      offset = p.textWidth(text);
      p.text(text, p.width / 2.0 - offset / 2.0, p.height / 2.0 + 60);
    }
  }

  new p5(sketch);
}(p5));