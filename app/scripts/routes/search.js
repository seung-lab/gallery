'use strict';

app.config(function ($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/browse',
        templateUrl: 'templates/search.html',
        controller: 'SearchController',
      })
});