'use strict';

//This factory is consume by the settings controller
( function() {
app.factory("SettingsFactory", function() {

  var instance = {
    settings: {
      toggleGround: false,
      toggleAxes:   false,
      toggleXZGrid: false,
      toggleXYGrid: false
    },
    set: function(property, value) {
      this.settings[property] = value;
    },
    toggle: function(property) {
      this.set(property, !this.settings[property])
    }
  };

  return instance;
});
})();