'use strict';

(function (app) {

app.factory("NotifierFactory", function() {
    var callback;
    var b = {
      name: "",
      icon: "info",
      delay: 5e3
    };
    var c = [],

    keys = Object.keys;

    return {
      setCallback: function(b) {
        
        callback = b;
        return this;

      },
      notify: function(e) {

        keys(b).forEach(function(a) {
          e[a] || (e[a] = b[a])
        });

        c.push(e); 
        
        if (callback) {
          callback(e);
        }

        return this;
      },
      get: function() {
        return c
      }
    }
});

})(app);