'use strict';

// Used in components/settings.html
( function (app) {
app.controller("SettingsController", ["$scope", "SettingsFactory",
  function($scope, settings) {
    
      $scope.settings = settings.settings;
      $scope.toggle = function(property) {
          settings.toggle(property)
      };
      $scope.setFont = function(size) {
          settings.set("fontSize", size)
      }
  }
]);

})(app);