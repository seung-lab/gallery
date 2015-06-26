app.directive("editor", ["$window", "UtilService", "ParseFactory",
  function(a, b, c) {
    var d = a.document,
    e = a.setTimeout,
    f = a.clearTimeout;
    return {
      restrict: "E",
      replace: !0,
      transclude: !0,
      scope: {
        mode: "&",
        placeholder: "@",
        model: "="
      },
      template: '<div class="editor"><div class="editor-inner"><div></div><span class="hide"></span><textarea class="input" placeholder="{{placeholder}}" ng-model="model" ng-transclude></textarea></div></div>',
      link: function(a, g) {
        g = g.children()[0];
        var h, i = g.children,
        j = i[0],
        k = b.element(i[1]),
        l = i[2],
        m = a.mode(),
        n = b.throttle,
        o = 0,
        p = function() {
          var a = l.selectionStart || 0;
          a != o && (k.attr("pad", l.value.substr(0, a)).removeClass("hide"), o = a)
        }, q = function() {
          var a = d.createElement("div");
          p(), c(l.value, m, function(b, c) {
            var e;
            c && "chords" != c ? (e = a.appendChild(d.createElement("span")), e.className = c) : e = a, e.appendChild(d.createTextNode(b))
          }), g.replaceChild(a, j), j = a
        };
        b.element(l).bind("input", n(q, 10)).bind("focus", function() {
          ! function a() {
            p(), f(h), h = e(a, 100)
          }()
        }).bind("blur", function() {
          f(h), k.addClass("hide"), o = null
        }), e(q, 50)
      }
    }
  }
]);