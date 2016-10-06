'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        templateUrl: 'templates/homepage.html',
        controller: 'HomepageCtrl',
      })
      .state('publications', {
      	url: '/about#publications',
      	templateUrl: 'templates/homepage.html',
        controller: 'HomepageCtrl',
      })


    $stateProvider
      .state('credits', {
        url: '/credits',
        templateUrl: 'templates/credits.html',
        controller: 'HomepageCtrl',
      });

  });