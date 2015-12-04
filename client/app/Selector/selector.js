'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('selector', {
        url: '/selector',
        templateUrl: 'app/Selector/selector.html',
        controller: 'SelectorCtrl'
      })
      // .state('selector.set', {
      //   url: 'set/{id:int}',
      //   // templateUrl: 'app/main/main.html',
      //   // controller: 'MainCtrl'
      // });
  });