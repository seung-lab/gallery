'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/viewer?neurons',
        templateUrl: 'app/viewer/viewer.html',
        controller: 'ViewerCtrl'
      })
  });
