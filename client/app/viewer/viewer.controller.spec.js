'use strict';

describe('Controller: ViewerCtrl', function () {

  // load the controller's module
  beforeEach(module('museum'));

  var Viewer2Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Viewer2Ctrl = $controller('ViewerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
