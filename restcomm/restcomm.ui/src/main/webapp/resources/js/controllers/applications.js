angular.module('rcApp.controllers').controller('ApplicationsCtrl', function ($scope, RCommApplications, SessionService) {
    console.log('IN ApplicationsCtrl');

    var accountSid = SessionService.get("sid");
    $scope.appsList = RCommApplications.query({accountSid: accountSid, includeNumbers: true});
});