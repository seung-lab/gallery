'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('selector', {
        url: '/selector',
        templateUrl: 'templates/selector.html',
        controller: 'SelectorCtrl'
      })
  });