'use strict';

app.directive("spSortable", ["TouchFactory", "$timeout", "UtilService",
  function(a, b, c) {
    function d(a) {
      var b = 0;
      do b += a.prop("offsetTop") - a.prop("scrollTop"), a = c.element(a.prop("offsetParent")); while (void 0 !== a.prop("offsetTop"));
      return b
    }

    function e() {
      i && i.css("margin", ""), h + 1 < l.length && (i = l.eq(h + 1), i.css("marginTop", j - 1 + "px"))
    }
    var f, g, h, i, j, k, l, m, n, o, p = Math.min,
    q = Math.max;
    return function(r, s, t) {
      r.$watch(t.spSortable, function(u) {
        u || void 0 === u ? (a.hold(s, function(a, c) {
          a.preventDefault(), l = s.children();
          var i = l.eq(0);
          o = d(s), k = i.prop("offsetTop") - i.prop("scrollTop"), j = l[0].offsetHeight - 1, n = j * l.length, m = p(q(0, c.y - o - k), n), g = h = p(Math.floor(m / j), l.length - 1), f = l.eq(g), f.addClass("dragged").css("top", p(q(m + k - j / 2, 0), n - j / 2) + "px"), b(function() {
            s.addClass("sorting")
          }, 0, !1), e()
        }), a.drag(s, function(a, b) {
          a.preventDefault(), o = d(s);
          var c = p(q(0, b.y - o - k), n);
          if (f.css("top", p(q(c + k - j / 2, k), n - j / 2 - k) + "px"), h !== p(Math.floor(c / j), l.length - 1)) {
            var g = Math.round(c / j);
            g !== h && g !== h + 1 && (g > h ? (l.splice(g - 1, 0, l.splice(h, 1)[0]), h = g - 1) : (l.splice(g, 0, l.splice(h, 1)[0]), h = g), e())
          }
        }), a.release(s, function(a) {
          a.preventDefault(), s.removeClass("sorting"), i.css("margin", ""), f.removeClass("dragged").css("top", ""), r.$apply(t.onsort + "(" + g + "," + h + ")")
        })) : (a.hold(s, c.noop), a.drag(s, c.noop), a.release(s, c.noop))
})
}
}
]);