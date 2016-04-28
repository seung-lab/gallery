'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'templates/homepage.html',
        controller: 'HomepageCtrl'
      })
      // .state('main.set', {
      //   url: 'set/{id:int}',
        // templateUrl: 'app/main/main.html',
        // controller: 'MainCtrl'
      // });
  });