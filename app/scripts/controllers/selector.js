'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('selector', {
        url: '/selector',
        templateUrl: 'app/Selector/selector.html',
        controller: 'SelectorCtrl'
      })
  });