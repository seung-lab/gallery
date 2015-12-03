'use strict';

( function(){
app.factory("ParseFactory", ["$window",
  function() {
    function a(a) {
      var b = this;
      b.pos = b.start = 0, b.string = a
    }
    return a.prototype = {
      eof: function() {
        return this.pos >= this.string.length
      },
      sof: function() {
        return !this.pos
      },
      eol: function() {
        return this.pos >= this.string.length || "\n" == this.string.charAt(this.pos)
      },
      sol: function() {
        return !this.pos || "\n" == this.string.charAt(this.pos - 1)
      },
      peek: function() {
        return this.string.charAt(this.pos) || null
      },
      next: function() {
        return this.pos < this.string.length && this.string.charAt(this.pos++)
      },
      eat: function(a) {
        var b, c = this.string.charAt(this.pos);
        return b = "string" == typeof a ? c == a : c && (a.test ? a.test(c) : a(c)), b ? (++this.pos, c) : void 0
      },
      eatWhile: function(a) {
        for (var b = this.pos; this.eat(a););
          return this.pos > b
      },
      eatSpace: function() {
        for (var a = this.pos;
          /[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;
          return this.pos > a
      },
      skip: function() {
        this.pos = this.string.length
      },
      skipTo: function(a) {
        var b = this.string.indexOf(a, this.pos);
        return~ b ? (this.pos = b, !0) : void 0
      },
      skipLine: function() {
        return this.skipTo("\n") && this.pos < this.string.length && ++this.pos
      },
      backUp: function(a) {
        this.pos -= a
      },
      column: function() {
        return this.start
      },
      match: function(a, b) {
        if ("string" != typeof a) {
          var c = this.string.slice(this.pos).match(a);
          return c && b !== !1 && (this.pos += c[0].length), c
        }
        return this.string.indexOf(a, this.pos) == this.pos ? (b !== !1 && (this.pos += a.length), !0) : void 0
      },
      current: function() {
        return this.string.slice(this.start, this.pos)
      }
    },
    function(b, c, d) {
      var e, f, g = c.startState() || !0;
      for (e = new a(b); !e.eof();) f = c.token(e, g), d(e.current(), f), e.start = e.pos
    }
  }
]);
})();