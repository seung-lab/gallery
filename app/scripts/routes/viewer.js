'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/?neurons&fullscreen&charts&browse&x&y&z',
        templateUrl: 'templates/viewer.html',
        reloadOnSearch : false,
        controller: 'ViewerCtrl'
      })
      .state('viewer.charts', {
        params: {
          charts: '1',
          browse: null,
        },
      })
      .state('viewer.browse', {
      	params: {
          charts: null,
          browse: '1',
        },
      });
  });
