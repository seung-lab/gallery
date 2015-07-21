'use strict';

(function (app) {

app.factory("NotifierFactory", function() {
    var callback;
    var b = {
      name: "",
      icon: "info",
      delay: 5e3
    };
    var messages = [],

    keys = Object.keys;

    return {
      setCallback: function(b) {
        
        callback = b;
        return this;

      },
      notify: function(message) {

        keys(b).forEach(function(a) {
          message[a] || (message[a] = b[a])
        });

        messages.push(message); 
        
        if (callback) {
          callback(message);
        }

        return this;
      },
      get: function() {
        return messages;
      }
    }
});

})(app);