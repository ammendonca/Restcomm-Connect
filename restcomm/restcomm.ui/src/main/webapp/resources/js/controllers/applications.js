angular.module('rcApp.controllers').controller('ApplicationsCtrl', function ($scope, RCommApplications, SessionService) {
    var accountSid = SessionService.get("sid");
    $scope.appsList = RCommApplications.query({accountSid: accountSid, includeNumbers: true});
});

angular.module('rcApp.controllers').controller('ApplicationDetailsCtrl', function ($scope, RCommApplications, SessionService, $stateParams) {
    var accountSid = SessionService.get("sid");
    var applicationSid = $stateParams.applicationSid;
    $scope.app = RCommApplications.get({accountSid: accountSid, applicationSid: applicationSid});
    // TODO also retrieve IncomingNumbers list for specific application

});