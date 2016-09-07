'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/about',
        templateUrl: 'templates/homepage.html',
        controller: 'HomepageCtrl',
      })
      .state('publications', {
      	url: '/about#publications',
      	templateUrl: 'templates/homepage.html',
        controller: 'HomepageCtrl',
      })
  });