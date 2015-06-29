'use strict';

( function () {
  
app.factory("TouchFactory", ["$window", "$timeout",
  function($window, $timeout) {
    function c(a) {
      
      s && (a = a.touches[0] || a.changedTouches[0]);
      return {
        x: a.pageX,
        y: a.pageY
      }
    }

    function d(a) {
      var b = c(a);
      return b.dx = b.x - p.x, b.dy = b.y - p.y, b
    }

    function e(a, b) {
      return sqrt(pow(b.x - a.x, 2) + pow(b.y - a.y, 2))
    }

    function processHold(a) {
      p = c(a), n = a.target, q = $timeout(function() {
        i("hold", p, a), o = !0
      }, 1e3)
    }

    function processMove(a) {
      (o ? i("drag", d(a), a) : $timeout.cancel(q))
    }

    function processRelease(a) {
      ($timeout.cancel(q), o ? i("release", d(a), a) : e(c(a), p) < 10 && i("tap", a), n =  o = !1)
    }

    function i(a, b, c) {
      for (var d, e, f = n; f && f != $window.document && (d = f.parentNode, e = u.indexOf(f), -1 == e || !v[e][a] || !1 !== v[e][a](c, b));) f = d
    }
  
    var touch = {};
    
    var hold, move, release, n, o, p, q, s = "ontouchstart" in $window,
    u = [],
    v = [],
    pow = Math.pow,
    sqrt = Math.sqrt;
    
    s ? (hold = "touchstart", move = "touchmove", release = "touchend") : (hold = "mousedown", move = "mousemove", release = "mouseup");

    $window.document.addEventListener(hold, processHold, true);
    $window.document.addEventListener(move, processMove, true);
    $window.document.addEventListener(release, processRelease, true);
    ["tap", "hold", "drag", "release"].forEach(function(event) {
      touch[event] = function(b, c) {
        b.length && (b = b[0]);
        var d = u.indexOf(b); - 1 == d && (d = u.push(b) - 1, v[d] = {}), v[d][event] = c
      }
    });

    return  touch;
  }
]);

})();