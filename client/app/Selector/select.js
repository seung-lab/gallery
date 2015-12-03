'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('select', {
        url: '/select',
        templateUrl: 'app/select/select.html',
        controller: 'SelectCtrl'
      })
      .state('select.set', {
        url: 'set/{id:int}',
        // templateUrl: 'app/main/main.html',
        // controller: 'MainCtrl'
      });
  });