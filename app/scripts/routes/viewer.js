'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/viewer?neurons&fullscreen',
        templateUrl: 'templates/viewer.html',
        controller: 'ViewerCtrl'
      })
  });
