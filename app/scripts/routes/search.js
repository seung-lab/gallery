'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        templateUrl: 'templates/search.html',
        controller: 'SearchController',
      })
});