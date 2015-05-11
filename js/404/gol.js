(function (p5) {
  'use strict';
  var sketch = function (p) {
    var cellArray;
    var cellSize = 10;
    var numx, numy;

    function restart() {
      p.background(255);
      cellArray = [];
      for (var i = 0; i < numx; i++) {
        cellArray[i] = [];
      }
      for (var x = 0; x < numx; x++) {
        for (var y = 0; y < numy; y++) {
          var newCell = new Cell(x, y);
          cellArray[x][y] = newCell;
        }
      }

      for (var x = 0; x < numx; x++) {
        for (var y = 0; y < numy; y++) {
          var above = y - 1;
          var below = y + 1;
          var left = x - 1;
          var right = x + 1;

          if (above < 0) {
            above = numy - 1;
          }
          if (below == numy) {
            below = 0;
          }
          if (left < 0) {
            left = numx - 1;
          }
          if (right == numx) {
            right = 0;
          }

          cellArray[x][y].addNeighbour(cellArray[left][above]);
          cellArray[x][y].addNeighbour(cellArray[left][y]);
          cellArray[x][y].addNeighbour(cellArray[left][below]);
          cellArray[x][y].addNeighbour(cellArray[x][below]);
          cellArray[x][y].addNeighbour(cellArray[right][below]);
          cellArray[x][y].addNeighbour(cellArray[right][y]);
          cellArray[x][y].addNeighbour(cellArray[right][above]);
          cellArray[x][y].addNeighbour(cellArray[x][above]);
        }
      }
    }
    p.setup = function () {

      p.createCanvas(window.innerWidth, window.innerHeight);
      numx = Math.floor(p.width / cellSize);
      numy = Math.floor(p.height / cellSize);
      console.log(numx);
      restart();
      p.noStroke();
      p.frameRate(10);
    }

    p.draw = function () {
      // background(200);
      for (var x = 0; x < numx; x++) {
        for (var y = 0; y < numy; y++) {
          cellArray[x][y].calcNextState();
        }
      }

      p.translate(_cellSize / 2, cellSize / 2);

      for (var x = 0; x < numx; x++) {
        for (var y = 0; y < numy; y++) {
          cellArray[x][y].drawMe();
        }
      }

    }

    p.mousePressed = function () {
      restart();
    }

    var Cell = function (ex, why) {
      this.vector;
      this.state;
      this.nextState;
      this.neighbors = [];
      this.count;
      this.col;

      this.vector = p.createVector(ex * cellSize, why * cellSize);

      this.nextState = p.random(2) > 1 ? true : false;
      this.state = this.nextState;
      this.neighbors = new Cell();
      this.count = 0;
      this.col = p.color(p.random(255), p.random(255), p.random(255));
    }

    Cell.prototype.addNeighbour = function (cell) {
      this.neighbors = append(neighbors, cell);
    }

    Cell.prototype.calcNextState = function () {
      var liveCount = 0;
      for (var i = 0; i < this.neighbors.length; i++) {
        if (this.neighbors[i].state) {
          liveCount++;
        }
      }

      if (this.state) {
        if ((liveCount == 2) || (liveCount == 3)) {
          this.nextState = true;
        } else {
          this.nextState = false;
        }
      } else {
        if (liveCount == 3) {
          this.nextState = true;
        } else {
          this.nextState = false;
        }
      }

      if (this.count > 5) {
        this.count = 5;
      }
    }

    Cell.prototype.drawMe = function () {
      this.state = this.nextState;

      var size = count / 20.0;
      if (this.state) {
        p.fill(this.col);
        p.ellipse(x, y, 100 * size, 100 * size);
        this.count++;
      } else {
        this.count = 0;
      }
    };
  }
  new p5(sketch);
}(p5));