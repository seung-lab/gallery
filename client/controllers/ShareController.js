( function() {
app.controller("ShareController", ["$scope", "$routeParams", "$rootScope", "MD5Factory", "UtilService",
  function($scope, $routeParams, $rootScope, md5, UtilService) {

      var sets = $rootScope.sets,
      setId = $routeParams.setId,
      j = $scope.e = sets.getWriters(setId).slice(0),
      k = $scope.c = sets.getReaders(setId).slice(0);
      $scope.owner = sets.getOwner(setId)
      $scope.md5 = md5;

      $scope.allowAccess = function(a, b) {
          "edit" == b ? UtilService.list(j, a) : UtilService.unilist(j, a)
          return UtilService.list(k, a) 
      }

      $scope.denyAccess = function(a) {
          UtilService.unilist(j, a), UtilService.unilist(k, a)
      }

      $scope.isOwner = function() {
          return sets.isOwner(sets[setId])
      }

      $scope.save = function() {
          return sets.setReaders(setId, k).setWriters(setId, j).save(sets[setId])
      }
  }
]);
})();