'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/viewer?neurons',
        templateUrl: 'templates/viewer.html',
        controller: 'ViewerCtrl'
      })
  });
