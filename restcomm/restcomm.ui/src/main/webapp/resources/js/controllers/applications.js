angular.module('rcApp.controllers').controller('ApplicationsCtrl', function ($scope, RCommApplications, SessionService) {
    var accountSid = SessionService.get("sid");
    $scope.appsList = RCommApplications.query({accountSid: accountSid, includeNumbers: true});
});