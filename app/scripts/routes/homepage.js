'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'templates/homepage.html',
        controller: 'HomepageCtrl',
      })
      .state('publications', {
      	url: '/#publications',
      	templateUrl: 'templates/homepage.html',
        controller: 'HomepageCtrl',
      })
  });