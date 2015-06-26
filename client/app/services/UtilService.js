
app.service("UtilService", ["$window",
  function($window) {

      var util = this;
    
      var setTimeout = $window.setTimeout;
      var clearTimeout = $window.clearTimeout;
    
      util.toArray = function(a) {
          return a.forEach ? a : [a]
      };
      util.list = function(a, b) {
          var length = a.length;

          util.toArray(b).forEach(function(b) {
              a.push(b);
          });
          return a.length - length
      };
      util.unlist = function(a, b) {
          var c = a.indexOf(b);
          return~ c && a.splice(c, 1), a.length
      };
      util.move = function(a, b, c) {
          return a.splice(c, 0, a.splice(b, 1)[0]), a
      };
      util.pad = function(a, b) {
          return Array(a + 1).join(b || " ")
      };
      util.buildUrl = function(url, params) {
          if (!params) return url;
          var f = [];
          angular.forEach(params, function(c, e) { 
              c = util.toJson(c);
              f.push(encodeURIComponent(e) + "=" + encodeURIComponent(c));
          })
          return url + (-1 == url.indexOf("?") ? "?" : "&") + f.join("&")
      };
      util.element = function(b) {
          return angular.isString(b) && (b = $window.document.getElementById(b)), angular.element(b)
      };
      util.randomHex = function(a) {
          for (var b = ""; a > 0;) b += Math.floor(Math.random() * Math.pow(10, 16)).toString(16).substr(0, 8 > a ? a : 8), a -= 8;
              return b
      };
      util.generateId = function() {
          return Math.floor(Date.now() / 1e3).toString(16) + util.randomHex(16)
      };
      util.throttle = function(a, b) {
          var c = null;
          return function() {
              clearTimeout(c), c = setTimeout(function() {
                  a.apply(this, arguments), c = null
              }, b)
          }
      };
      util.keys = Object.keys;
      util.toJson = $window.JSON.stringify;
      ["copy", "extend", "forEach", "identity", "fromJson", "isObject", "isString", "isArray", "lowercase", "noop"].forEach(function(b) {
          util[b] = angular[b]
      });
  }
]);
