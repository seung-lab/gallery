'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/?neurons&fullscreen',
        templateUrl: 'templates/viewer.html',
        controller: 'ViewerCtrl'
      })
  });
