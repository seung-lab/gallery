'use strict';

//This factory is consume by the settings controller
( function() {
app.factory("SettingsFactory", function() {

  var instance = {
    settings: {
      toggleGround: true,
      toggleAxes: true,
      toggleXZGrid: true,
      toggleXYGrid: true
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