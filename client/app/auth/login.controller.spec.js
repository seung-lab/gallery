'use strict';

describe('Controller: loginController', function() {

	beforeEach(module('cellPane'));

  var loginController,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/sets')
      .respond(200);

    scope = $rootScope.$new();
    loginController = $controller('LoginController', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
  });

});