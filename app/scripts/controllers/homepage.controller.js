'use strict';

app.controller('HomepageCtrl', function ($scope, $timeout, $mdSidenav, $mdDialog, $log, $state) {
    $scope.goToSelector = function() {
        $state.go('selector')
    };

});