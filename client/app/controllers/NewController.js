'use strict';

( function (app) {

app.controller("NewController", ["$scope", "$rootScope", "transposer", "cellMode", "$routeParams", "UtilService", "LocaleFactory", "NotifierFactory",
  function($scope, $rootScope, transposer, cellMode, $routeParams, util, locale, notifier) {
      var i = $rootScope.cells,
      j = $routeParams.edit,
      k = locale._;
      $scope.cellMode = cellMode, $scope.langs = locale.langs, j && ($scope.cell = util.extend({}, i[$routeParams.cellId]), "clone" == j && delete $scope.cell._id, $scope.cell.tempo = $scope.cell.tempo - 0), $scope.savecell = function(a, b) {
          var d = "(" + transposer.getScale(a.key).join("|") + ")";
          return~ a.body.search("^(?:\\[[1-9BCPIO]\\]\\n(?:(?: *" + d + "[1-9adgijmsu,\\(\\)]*(?:\\/" + d + ")?)*\\n[^\\[\\n].+\\S(?:\\n|$))+)+$") ? (a._acl = {}, b && (a._acl = {
              gr: !1
          }), i.save(a)) : void notifier.notify({
              message: k.checkBody,
              icon: "alert"
          })
      }, $scope.keys = transposer.getAllKeys()
  }
]);
})(app);