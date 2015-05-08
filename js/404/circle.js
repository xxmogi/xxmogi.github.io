(function (p5) {
  'use strict';
  var sketch = function (p) {

    var cs = [],
      mouseCount = 0,
      Circle;

    Circle = function (pos) {
      var vx, vy;
      this.pos = pos.copy();
      vx = p.randomGaussian(50, 15) - 50;
      vy = p.randomGaussian(10, 15) - 20;
      this.vel = p.createVector(vx, -Math.abs(vy));
    };

    Circle.prototype.isDead = function () {
      if (this.pos.x > 0 && this.pos.x < p.width && this.pos.y < p.height) {
        return false;
      } else {
        return true;
      }
    };

    Circle.prototype.update = function () {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.vel.y += 9.8 / 3.0;
    };

    Circle.prototype.draw = function () {
      p.ellipse(this.pos.x, this.pos.y, 20, 20);
    };


    p.setup = function () {
      p.createCanvas(window.innerWidth, window.innerHeight);
      p.noStroke();
    };

    p.draw = function () {
      p.background(0);
      cs.forEach(function (c, i) {
        p.fill(p.random(20, 150) + 100, 140 + p.random(0, 100), 140 + p.random(50, 100));
        c.draw();
        c.update();
      });

      cs = cs.filter(function (c) {
        return !c.isDead();
      });
    };

    p.mouseMoved = function () {
      mouseCount++;
      if (mouseCount > 10) {
        cs.push(new Circle(p.createVector(p.mouseX, p.mouseY)));
        mouseCount = 0;
      }
    };

    p.windowResized = function () {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  }
  
  new p5(sketch);
}(p5));