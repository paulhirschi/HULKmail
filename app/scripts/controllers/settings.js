'use strict';

/**
 * @ngdoc function
 * This file contains the following controller
 * 1. SettingsCtrl which is bound to settings.html
 */

/* 1. SettingsCtrl: Controller for settings.html
 ======================================*/
app.controller('SettingsCtrl', function($scope) {

  // Data bound to the respective input elements
  $scope.settings = {
    name: "Paul Hirschi",
    email: "paul@paulhirschi.com"
  };

  // When the update button is clicked, it merely types this to the console.
  $scope.updateSettings = function() {
    console.log("updateSettings was called");
  };

});