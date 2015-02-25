'use strict';

/**
 * @ngdoc function
 * Controllers for the angularEmailApp
 *
 * This file contains the following controllers:
 * 1. The HomeCtrl which is bound to the home.html template.
 * - Controllers nested inside HomeCtrl include:
 * 2. ContentCtrl which is bound to email content section
 * 3. MailListCtrl which is bound to the inbox section
 */

/* 1. HomeCtrl: controller for home.html.
 ======================================*/
app.controller('HomeCtrl', ['$scope',
  function($scope) {

    // Determine which email from the inbox is selected.
    $scope.selectedMail;

    $scope.setSelectedMail = function(mail) {
      $scope.selectedMail = mail;
    };

    $scope.isSelected = function(mail) {
      if ($scope.selectedMail) {
        return $scope.selectedMail === mail;
      }
    };

  }
]);

/* 1. ContentCtrl: nested in HomeCtrl. Controller for the email content section.
 ======================================*/
app.controller('ContentCtrl', ['$scope', '$rootScope', '$filter', '$timeout', 'mailService',
  function($scope, $rootScope, $filter, $timeout, mailService) {

    // Decide whether to show the Reply form for the currently selected email.
    $scope.showingReply = false;

    $scope.reply = {};

    $scope.toggleReply = function() {
      // Toggle the Reply form visibility.
      //  This is set with an ng-show directive on pertinent DOM elements.
      $scope.showingReply = !$scope.showingReply;
      $scope.reply = {};
      $scope.reply.to = $filter('lowercase')($scope.selectedMail.email);
      $scope.reply.body = "\n\n________________\n\n" + $filter('json')($scope.selectedMail);
    };

    // sendReply function fires when an email is sent.
    // It toggles the "working" spinner in the header.
    // Currently no 'POST' is made. It merely sets the spinner to work for 3 seconds.
    $scope.sendReply = function() {
      $scope.showingReply = false;
      // loading is set to the $rootScope so it is available
      // to the spinner element in index.html outside any controller
      $rootScope.loading = true;
      $timeout(function() {
        $rootScope.loading = false;
      }, 3000);
      mailService.sendEmail($scope.reply)
        .then(function(status) {
          $rootScope.loading = false;
        }, function(err) {
          $rootScope.loading = false;
        });
    };

    // The functions resets the reply fields to empty if the reply form is
    // closed before it is sent.
    $scope.$watch('selectedMail', function(evt) {
      $scope.showingReply = false;
      $scope.reply = {};
    });

  }
]);

/* 3. MailListCtrl: nested in HomeCtrl. Controller for the inbox section.
 ======================================*/
app.controller('MailListCtrl', ['$scope', 'mailService',
  function($scope, mailService) {

    // Declares to email array which will recieve the email objects after the 'GET'.
    $scope.email = [];
    // This displays a "Fetching Email" message until the getMail method returns success
    $scope.fetchingEmail = true;
    // This is used to restrict the inbox items to 10 objects.
    // Used with the limitTo filter in the emailListing directive.
    $scope.quantity = 10;

    // Using the mailService Service to get new emails from the server.
    mailService.getMail()
      .success(function(data, status, headers) {
        $scope.email = data;
        $scope.fetchingEmail = false;
      })
      .error(function(data, status, headers) {

      });
  }
]);