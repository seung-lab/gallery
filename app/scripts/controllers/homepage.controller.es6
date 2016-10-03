'use strict';

app.controller('HomepageCtrl', function ($scope, $state, $timeout, cellService, searchService) {
	
  $scope.autocompleteLoaded = false;
  self.cellids_by_type = {};
  cellService.list()
    .then(function (cellinfos) {
      $scope.autocompleteLoaded = true;
      searchService.setDataset(cellinfos);
    });

  $scope.search = searchService.search;


  $scope.selectedItemChange = function (item) {
    // timeout fixes angular material bug where a mask is applied that
    // blocks the main area and doesn't get removed

    $timeout(function () {}, 0);
  };

  $scope.goToCellIds = function (cellids = []) {
    
    cellids = JSON.parse(JSON.stringify(cellids)).map(Number);
    cellids.sort();

    $state.go('viewer', {
      neurons: cellids.join(','),
    });
  };

  $scope.searchKeydown = function (evt) {
    evt.stopPropagation();

    if (evt.keyCode !== 13) { // enter key
      return;
    }

    $scope.gotoFirstAutocompleteResult();
    angular.element(evt.target).blur();
  };

  $scope.gotoFirstAutocompleteResult = function (force) {
    if ($scope.selectedItem) {
      $scope.goToCellIds([ ...$scope.selectedItem.value ]);
    }
    else if ($scope.searchText) {

      let cellids = searchService.firstResults($scope.searchText);

      if (cellids.length) {
        $scope.goToCellIds(cellids);
      }
    }
    else if (force) {
      $scope.goToCellIds();
    }
  };


});