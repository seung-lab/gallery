// Used in partials/settings.html
( function (){
app.controller("SettingsController", ["$scope", "SettingsFactory",
  function($scope, settings) {
      window.settings = settings.settings;
      $scope.settings = settings.settings;
      $scope.toggle = function(property) {
          settings.toggle(property)
      };
      $scope.setFont = function(size) {
          settings.set("fontSize", size)
      }
  }
]);
})();