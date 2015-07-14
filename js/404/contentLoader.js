(function () {
  'use strict';
  var content, scripts,index;
  scripts = [ "gol.js", "circle.js", "humnoise.js" ];
  
  index = Math.floor(Math.random() * scripts.length);

  content = document.createElement('script');
  content.type = 'text/javascript';
  content.async = true;
  content.src = '/js/404/' + scripts[index];
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(content);
}());