'use strict';
 
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /cells              ->  index
 * POST    /cells              ->  create
 * GET     /cells/:id          ->  show
 * PUT     /cells/:id          ->  update
 * DELETE  /cells/:id          ->  destroy
 */


app.service('cells', [ '$resource',
    function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

      var api = $resource('/api/cells/:id', { id: '@_id'  } ,
        { 
          index:  { method: 'GET' , isArray: true,  cache: true },
          create: { method: 'POST', },
          show:   { method: 'GET' , isArray: false, cache: true },
          update: { method: 'PUT' , },
          destroy:{ method: 'DELETE'},
        }
      );


      this.show = function( cell_id , callback ) {
        
        api.show( { id: cell_id } , function(cell) {
          callback(cell);
        });
      };

      this.index = function( callback ) {

        api.index( callback );
      
      };

      this.create = api.create;
  }]);