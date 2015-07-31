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

  describe('getCells', function () {

  	beforeEach(function(){

	    $httpBackend.expectGET('/api/cellss/1652')
          .respond([{
          id: '1652'
      }]);

  	});

    it('should call getCells with id ', function () {
     			
      var result = Cells.query({id:'1652'});

      $httpBackend.flush();

      expect(result[0].id).toEqual('1652');
    
    });

  });

});