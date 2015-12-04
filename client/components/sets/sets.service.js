'use strict';
 
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /sets              ->  index
 * POST    /sets              ->  create
 * GET     /sets/:id          ->  show
 * PUT     /sets/:id          ->  update
 * DELETE  /sets/:id          ->  destroy
 */


app.service('sets', [ '$resource',
    function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

      var api = $resource('/api/sets/:id', { id: '@_id'  } ,
        { 
          index:  { method: 'GET' , isArray: true  },
          create: { method: 'POST', },
          show:   { method: 'GET' , isArray: false },
          update: { method: 'PUT' , },
          destroy:{ method: 'DELETE'}
        }
      );


      this.show = function( set_id , callback ) {
        
        api.show( { id: set_id } , function(set) {
          callback(set);
        });
      };

      this.index = function( callback ) {

        api.index( callback );
      
      };

      this.create = api.create;
  }]);