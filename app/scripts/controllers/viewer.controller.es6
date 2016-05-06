'use strict';

// include axes for debugging
app.controller('ViewerCtrl', [
  '$scope', '$timeout', '$state', '$document', '$window', 'mesh', 'camera', 'cells',
  function ($scope, $timeout, $state, $document, $window, mesh, camera, cells) {
  
  let self = this;
  self.states = [];

  $scope.neurons = $state.params.neurons.split(/ ?, ?/).map(function (cid) {
    return parseInt(cid, 10);
  });

  mesh.display($scope.neurons, function () { 
    var bbox = mesh.getVisibleBBox();
    camera.lookBBoxFromSide(bbox);
  });

  // Quick Search

  cells.list()
    .then(function (cellinfos) {
      self.states = loadAllAutocompletes(cellinfos);
      return cellinfos;
    })

      /**
   * Populates the autocomplete list shown
   */
  $scope.querySearch = function (query) {
    query = query || "";
    query = query.toLowerCase();

    let results = query
      ? self.states.filter(function (state) {
          return state.value.toLowerCase().indexOf(query) > -1 || state.display.toLowerCase().indexOf(query) > -1;;
        })
      : self.states;

    return results || [];
  };

  $scope.goToResult = function (item) {
    $state.go('viewer', {
      neurons: item.value,
    });
  };

  $scope.keydown = function (evt) {
    if (evt.keyCode !== 13) { // enter key
      return;
    }
    if ($scope.selectedItem) {
      $scope.goToResult($scope.selectedItem);
    }
    
    let results = $scope.querySearch($scope.txt);
    if (results.length) {
      $scope.goToResult(results[0]);
    }
  };

  /*
   * Build `states` list of key/value pairs
   */
  function loadAllAutocompletes (cellinfos) {
    let cells = {};
    function addInfo (cell, attr) {
      if (cell[attr] === undefined) {
        return;
      }

      cells[cell[attr]] = cells[cell[attr]] || {
        display: cell[attr],
        value: [],
      };

      cells[cell[attr]].value.push(cell.id);
    }


    for (let cell of cellinfos) {
      addInfo(cell, 'id');
      addInfo(cell, 'name');
      addInfo(cell, 'description');
      addInfo(cell, 'type');
    }
   
    return Object.keys(cells).map(function (key) {
      let field = cells[key];
      field.value = field.value.join(",");
      return field;
    })
  }

    
  // Sidebar

  $scope.sidebar_open = false;

  $scope.toggle = function () {
    $scope.sidebar_open = !$scope.sidebar_open;
  };

  $scope.$watch( (scope) => scope.sidebar_open, function () {
    let sidebar = angular.element('#right-sidebar'),
        fab = angular.element('button.more-info');

    sidebar.removeClass('onscreen');
    fab.removeClass('sidebar-open');
    if ($scope.sidebar_open) {
      sidebar.addClass('onscreen');
      fab.addClass('sidebar-open');
    }
  });


  // Cameras

  $scope.cameras = [ "orthographic", "perspective" ];

  $scope.camClick = function (cam) {

    if (cam === "ortographic") {
      camera.useOrthographic();
    } 
    else {
      camera.usePerspective();
    }
  };

  $scope.views = [ "top", "side" ];

  $scope.viewClick = function (view) {

    var bbox = mesh.getVisibleBBox();

    if (view == "top") {
      camera.lookBBoxFromTop(bbox);
    }
    else if (view == "side") {
      camera.lookBBoxFromSide(bbox);
    } 
    else {
      camera.lookBBoxFromOblique(bbox);
    }
  };
}]);