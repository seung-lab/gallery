'use strict';

describe('Controller: LoginController', function() {

	beforeEach(angular.mock.module('museum'));

  var loginController;
  var $window;

  // Initialize the controller and a mock scope
  beforeEach(function () {
 
    angular.mock.inject(function ($injector) {

      $window = $injector.get('$window');
      //loginController = $injector.get('LoginController');

    });
  });


  describe('login', function () {

    beforeEach(function () {
      
      //loginController.loginOauth('eyewire');

    });

    it('should change window href', function () {


    });

  });


});
