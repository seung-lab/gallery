var app = angular.module('museum', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ngMaterial',
  'angular-cache'
]);

// The actual routing is done in the MainCtrl
app.config(function ($urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.caseInsensitiveMatch = true;
    $urlRouterProvider.otherwise('/');

    //Remove hashtag from url if windows history is supported.
    if (window.history && window.history.pushState) {
      $locationProvider.html5Mode(true);
    }

    $httpProvider.interceptors.push('authInterceptor');
});

app.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },
      
      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
});

//This is to allow cross-origin requests
app.config(function ($httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
