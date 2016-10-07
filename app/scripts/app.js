var app = angular.module('Museum', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ngMaterial',
  'ngSanitize',
  'angular-cache'
]);

// The actual routing is done in the MainCtrl
app.config(function ($urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.caseInsensitiveMatch = true;
    $urlRouterProvider.otherwise('/');

    // Remove hashtag from url if windows history is supported.
    if (window.history && window.history.pushState) {
      $locationProvider.html5Mode(true);
    }

    $httpProvider.interceptors.push('authInterceptor');
});

// Use in production for performance speedup
// https://medium.com/@hackupstate/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.7gwddf1ni
app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);

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

// This is to allow cross-origin requests
app.config(function ($httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

$(document).ready(function () {
  curtainRise(function () {}, 0);
});


function curtainRise (fn, delay = 100) {
  let curtain = $('<div>').addClass('curtain fall');
  $('body').append(curtain);

  setTimeout(function () {
    curtain.removeClass('fall');

    setTimeout(function () {
      curtain.remove();

      if (fn) {
        fn(curtain);
      }
    }, 1250);
  }, delay);
}


