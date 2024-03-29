'use strict';

// include axes for debugging
app.controller('BrowseCtrl', function ($scope, cellSetsService) {
  $scope.sets = [];

  (function refreshTypes () {
  	cellSetsService.query(function (types) {
  		types.forEach(function (type) {
  			cellSetsService.preview(type.type).$promise
          .catch(function (err) {
            if (err.status === 404) {
              return { url: '' };
            }

            throw err;
          })
  				.then(function (resp) {

	  				$scope.sets.push({
	  					type: type.type,
              classical_type: type.classical_type,
              classical_type_html: `(${cellSetsService.classicalTypeToHtml(type.classical_type)})`,
              securely_known: type.securely_known,
              count: type.count,
	  					img_url: resp.url,
	  				});
	  			});
  		})
  	});
  })();

  $scope.$watch(function () {
    return $scope.sets.map( (st) => st.type ).sort().join('$');
  }, function () {
    $scope.sets.sort( (a,b) => a.type.localeCompare(b.type) );
  });


  $scope.chooseType = function (type) {
   	let cell_ids = $scope.$parent.cellIdsForType(type);
   	$scope.$parent.goToCellIds(cell_ids);
    $scope.$parent.fullscreen = false;
  };


});