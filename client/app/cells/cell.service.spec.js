'use strict';

describe('Service: Cell', function() { 
	

	var Cell, $httpBackend;

  beforeEach(angular.mock.module('museum'));

  beforeEach(function () {
      
    angular.mock.inject(function ($injector) {

      $httpBackend = $injector.get('$httpBackend');
      Cell = $injector.get('Cell');

    });
  
  });

  describe('getCell', function () {

  	beforeEach(function(){

	    $httpBackend.expectGET('/api/cells/1652')
          .respond([{
          id: '1652'
      }]);

  	});

    it('should call getCell with id ', function () {
     			
      var result = Cell.query({id:'1652'});

      $httpBackend.flush();

      expect(result[0].id).toEqual('1652');
    
    });

  });

});