(function (){
app.factory("NotifierFactory", function() {
    var a, b = {
      name: "",
      icon: "info",
      delay: 5e3
    }, c = [],
    d = Object.keys;
    return {
      setCallback: function(b) {
        return a = b, this
      },
      notify: function(e) {
        return d(b).forEach(function(a) {
          e[a] || (e[a] = b[a])
        }), c.push(e), a && a(e), this
      },
      get: function() {
        return c
      }
    }
});
})();