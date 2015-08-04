'use strict';

describe('Service: Cells', function() { 
	

	var Cells, $httpBackend;

  beforeEach(angular.mock.module('museum'));

  beforeEach(function () {
      
    angular.mock.inject(function ($injector) {

      $httpBackend = $injector.get('$httpBackend');
      Cells = $injector.get('Cells');

    });
  
  });

  describe('getCell', function () {

  });

});