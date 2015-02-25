'use strict';

/**
 * @ngdoc overview
 * @name angularEmailApp
 * @description
 * # angularEmailApp
 *
 * Main module of the application.
 *
 * This file contains the following:
 * 1. The Main Application Module Declaration, including dependencies.
 * 2. The Routing config method using the $routeProvider service.
 * 3. The mailService angular Service used in sending and recieving email.
 * 4. The emailListing angular Directive used in populating the email inbox.
 */

/* 1. Main Application Module declared
 ======================================*/
var app = angular.module('angularEmailApp', [
  'ngRoute',
  'ngTouch'
]);

/* 2. Routes declared
 ======================================*/
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

/* 3. mailService Service used to send and recieve email.
** This service is injected in the contentCtrl to provide services for a 'POST'ing email
** This service is also injected in the mailListCtrl to provide services for 'GET'ting email
 ======================================*/
app.service('mailService', ['$http', '$q',
  function($http, $q) {
    // HTTP request function.  This gets dummy information from a real json REST API
    // provided by jsonplaceholder.typicode.com. Very handy.
    var getMail = function() {
      return $http({
        method: 'GET',
        url: 'http://jsonplaceholder.typicode.com/users'
      });
    };

    // HTTP post function.  Currently does nothing. I didn't want to waste my time.
    var sendEmail = function(mail) {
      var d = $q.defer();
      $http({
        method: 'POST',
        data: mail,
        url: ''
      }).success(function(data, status, header) {
        d.resolve(data);
      }).error(function(data, status, header) {
        d.reject(data);
      });
      return d.promise;
    };

    return {
      getMail: getMail
    };
  }
]);

/* 4. emailListing Directive used to populate & control the inbox items
 ======================================*/
app.directive('emailListing', function() {
  return {
    restrict: 'EA',
    replace: false,
    scope: {
      email: '=', // accept an object as a parameter
      action: '&', // accept a function as a parameter
      shouldUseGravatar: '@' // accept a string as a parameter
    },
    // Template to be used for the directive
    templateUrl: '/views/emailListing.html',
    controller: ['$scope', '$element', '$attrs', '$transclude',
      function($scope, $element, $attrs, $transclude) {

        // This function sets the currenlty selected email to the scope.
        $scope.handleClick = function() {
          $scope.action({
            selectedMail: $scope.email
          });
        };
      }
    ],
    // This binds the click function an inbox item allowing us to
    // dynamically add classes for styling.
    link: function(scope, iElement, iAttrs, controller) {
      iElement.bind('click', function() {
        iElement.parent().children().removeClass('selected');
        iElement.addClass('selected');
      });
    }
  };
});