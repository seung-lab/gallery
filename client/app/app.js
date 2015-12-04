var app = angular.module('museum', 
     ['ngCookies',
      'ngResource',
      'ngRoute',
      'ui.router',
      'ngMaterial',
      'angularResizable']);

//The actual routing is done in the MainCtrl
app.config(function($urlRouterProvider,$locationProvider,$httpProvider) {

    $urlRouterProvider.caseInsensitiveMatch = true;
    $urlRouterProvider.otherwise('/');

    // $urlRouterProvider.when('/','/Viewer/viewer.html');
    // $urlRouterProvider.when('/set/:setIds*?','/Viewer/viewer.html');
    // $urlRouterProvider.when('/:view/:cellId?','/Viewer/viewer.html');
    // $urlRouterProvider.otherwise('/','/Viewer/viewer.html');

    //Remove hashtag from url if windows history is supported.
    if(window.history && window.history.pushState){
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
    
app.run(['Cells' , 'Sets', '$rootScope', 'UtilService',  'KeyboardFactory', 'ModalFactory',  '$window', 'LocaleFactory', 
    function(Cells , Sets , $rootScope, util,  keyboard, modal, $window, locale) {

      $rootScope._ =  ($window.navigator, locale._);
      $rootScope.change = false;
      $rootScope.$on('ready', function() {
          $rootScope.ready = true
      });

      $rootScope.sets = Sets();
      $rootScope.cells = Cells();

      $rootScope.sets.run(function() {
          $rootScope.cells.run(function() {
            $rootScope.$emit('ready');
          });
      });

      $rootScope.modal = modal;
      $rootScope.toggleState = function(stateName) {
          $rootScope[stateName] = !$rootScope[stateName];
          $rootScope.changedState = true;
      };
      $rootScope.resetState = function() {
          return $rootScope.changedState ? void($rootScope.changedState = false) : void['menu', 'em'].forEach(function(b) {
              $rootScope[b] && ($rootScope[b] = false)
          });
      };

      //This slow down all animations
      //But there has to be another event after this changed is updated
      keyboard.on('ctrl+shift', function() {
          $rootScope.slow = !$rootScope.slow;
      });

      //Displays some of the key bindings
      keyboard.on(['h', '?'], function() {
          modal('components/keyboard.html');
          $rootScope.$apply();
          return false;
      });
      keyboard.on('esc', function() {
          return true;
      });
}]);


var f = function() {
    var a = navigator.userAgent,
    b = {}, c = {};
    window.location.search.substring(1).split('&').forEach(function(a) {
        a = a.split('=');
        c[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
    });
    c.android ? (b.name = 'android', b.version = c.android, b.native = !0) : c.ios ? (b.name = 'ios', b.version = c.ios, b.native = !0) : /AppleWebKit/.test(a) && /Mobile\/\w+/.test(a) ? b.name = 'ios' : ~a.toLowerCase().indexOf('firefox') && (b.name = 'ff'), b.name && (document.documentElement.className += ' ' + b.name)
    app.constant('platform', b)
}(window);
