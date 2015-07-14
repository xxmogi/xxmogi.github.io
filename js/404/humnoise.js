(function () {
  'use strict';

  var sketch = function (p) {
    var noise, noise2,fft, filter;
    var freq = 0;
    p.setup = function () {
      p.createCanvas(window.innerWidth, window.innerHeight);
      noise = new p5.Pulse();
      noise.amp(1.0);
      noise.freq(100);
      
      noise2 = new p5.Pulse();
      noise2.amp(1.0);
      noise2.freq(110);
      
      filter = new p5.BandPass();
      filter.freq(100);
      noise.disconnect();
      noise.connect(filter);
      noise2.disconnect();
      noise2.connect(filter);
      filter.res(10);
      
      noise.start();
      
      fft = new p5.FFT();
      //fft.setInput(noise);
    };

    p.draw = function () {
      var  wave, points, start, end;
      p.background(255);

      points = [];
      wave = fft.waveform(512);
      for (var i = 0; i < wave.length; i++) {
        var point = wave[i];
        var x = p.map(i, 0, wave.length, 0 , p.width);
        var y = p.map(point, 0,255, -40, 40) + p.height/ 2.0;
        points.push(p.createVector(x, y));
      }
      for (var i = 0; i < points.length - 1; i++) {
        start = points[i];
        end = points[i + 1];
        p.line(start.x, start.y, end.x, end.y);
      }

    };

    p.mousePressed = function () {
      console.log("press");
      if (noise) {
        noise.stop();
      } else {
        noise.start();
      }
    };
    
    p.windowResized = function () {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  };
  new p5(sketch);
}());