(function () {
  'use strict';
  var content, scripts;
  content = document.createElement('script');
  content.type = 'text/javascript';
  content.async = true;
  content.src = 'js/404/gol.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(content);
}());