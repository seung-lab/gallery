'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/viewer',
        templateUrl: 'app/Viewer/viewer.html',
        controller: 'ViewerCtrl'
      })
      // .state('selector.set', {
      //   url: 'set/{id:int}',
      //   // templateUrl: 'app/main/main.html',
      //   // controller: 'MainCtrl'
      // });
  });