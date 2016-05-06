'use strict';
 
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET		 /cells							->	index
 * POST		/cells							->	create
 * GET		 /cells/:id					->	show
 * PUT		 /cells/:id					->	update
 * DELETE	/cells/:id					->	destroy
 */

app.service('cells', [ '$q', '$resource', function ($q, $resource) {
	var api = $resource('/1.0/cells/:id', { id: '@_id' }, { 
		index: { 
			method: 'GET', 
			isArray: true, 
			cache: true, 
		},
		create: { method: 'POST' }, // isn't this backwards with update?
		show: { 
			method: 'GET', 
			isArray: false, 
			cache: true, 
		},
		update: { method: 'PUT', },
		destroy: { method: 'DELETE' },
	});

	this.show = function (cell_id, callback) {
		return $q(function (resolve, reject) {
			api.show({ id: cell_id }, function (cell) {
				resolve(cell);

				if (callback) {
					callback(cell);
				}
			});
		});
	};

	this.index = function (callback) {
		api.index(callback);	
	};

	this.create = api.create;
}]);