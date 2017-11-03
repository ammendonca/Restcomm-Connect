angular.module('rcApp.controllers').controller('ApplicationsCtrl', function ($scope, RCommApplications, SessionService) {
    var accountSid = SessionService.get("sid");
    $scope.appsList = RCommApplications.query({accountSid: accountSid, includeNumbers: true});
});

angular.module('rcApp.controllers').controller('ApplicationDetailsCtrl', function ($scope, RCommApplications, RvdProjects, SessionService, $stateParams, $location, $dialog, Notifications, $filter, $httpParamSerializer, FileRetriever) {
    var accountSid = SessionService.get("sid");
    var applicationSid = $stateParams.applicationSid;
    $scope.app = RCommApplications.get({accountSid: accountSid, applicationSid: applicationSid}, function () {
        $scope.provider = $filter('appKind')($scope.app.rcml_url);
    });
    // TODO also retrieve IncomingNumbers list for specific application

    $scope.confirmApplicationDelete = function(app) {
        confirmApplicationDelete(app, $dialog, $scope, Notifications, RCommApplications, RvdProjects, $location)
    }

    $scope.editInDesigner = function(app) {
        window.open("/restcomm-rvd#/designer/" + app.sid + "=" + app.friendly_name); // TODO maybe escape friendly_name ???
    }

    $scope.saveExternalApp = function(app) {
        RCommApplications.save({accountSid: accountSid, applicationSid: applicationSid}, $httpParamSerializer({RcmlUrl: app.rcml_url}), function () {
            Notifications.success("Application '" + app.friendly_name + " ' saved");
            $location.path( "/applications" );
        });
    }

    $scope.downloadRvdApp = function(app) {
        var downloadUrl =  '/restcomm-rvd/services/projects/' + app.sid + '/archive?projectName=' + app.friendly_name; // TODO remove '/restcomm-rvd/' hardcoded value and use one from PublicConfig service
        FileRetriever.download(downloadUrl, app.friendly_name + ".zip").catch(function () {
            notifications.error("Error downloading project archive");
        });
    }
});

angular.module('rcApp.controllers').controller('ApplicationCreationWizzardCtrl', function ($scope, $rootScope, $location) {
    console.log("IN ApplicaitonCreationWizzardCtrl");

    $scope.onFileDropped = function(files) {
        console.log("dropped the following files: ", files);
        $rootScope.droppedFiles = files;
        $location.path("/applications/new");

    }
});

angular.module('rcApp.controllers').controller('ApplicationCreationCtrl', function ($scope, $rootScope, $location, Notifications, RvdProjectImporter) {
    console.log("IN ApplicationCreationCtrl");
    var appOptions = {}, droppedFiles; // all options the application needs to be created like name, kind ... anything else ?
    if ( !!$rootScope.droppedFiles ) {
        droppedFiles = $rootScope.droppedFiles;
        delete $rootScope.droppedFiles;
    }
    if (!droppedFiles) {
        appOptions.kind = "voice"; // by default create voice applications
    }

    $scope.setKind = function(options, kind) {
        options.kind = kind;
    }


    // if we're importing, use imported filename to suggest a name for the newly created project
    if (droppedFiles) {
        var m = droppedFiles[0].name.match(RegExp("(.+)\\.zip$"));
        if ( m && m[1] ) {
            appOptions.name = m[1];
        }
    }

    $scope.importProjectFromFile = function(files, nameOverride) {
        if (files[0]) {
            RvdProjectImporter.import(files[0], nameOverride).then(function () {
                Notifications.success("Application imported successfully");
                $location.path("/applications");
            }, function (message) {
                Notifications.error(message);
            });
        }

        /*
        $scope.upload = $upload.upload({
            url: '/restcomm-rvd/services/projects',
            file: file,
        }).progress(function(evt) {
            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
            Notifications.success("Application imported successfully");
            $location.path("/applications")
        }).error(function(data, status, headers, config) {
            if (status == 400 && data && data.exception && data.exception.className == "UnsupportedProjectVersion") {
                console.log(data.exception.message);
                Notifications.error("Cannot import application. " + data.exception.message, type:"danger");
            } else {
                console.log(data);
                Notifications.error("Error importing application");
            }
        });
        */
    }

    $scope.appOptions = appOptions;
    $scope.droppedFiles = droppedFiles;
});

var confirmApplicationDelete = function(app, $dialog, $scope, Notifications, RCommApplications, RvdProjects, $location) {
  var title = 'Delete application \'' + app.friendly_name + '\'';
  var msg = 'Are you sure you want to delete application ' + app.sid + ' (' + app.friendly_name +  ') ? This action cannot be undone.';
  var btns = [{result:'cancel', label: 'Cancel', cssClass: 'btn-default'}, {result:'confirm', label: 'Delete!', cssClass: 'btn-danger'}];

  $dialog.messageBox(title, msg, btns)
    .open()
    .then(function(result) {
      console.log("Provider: " + $scope.provider);
      if (result == "confirm") {
        if ($scope.provider == 'rvd') {
            RvdProjects.delete({applicationSid:app.sid}, {},
                function() {
                    Notifications.success('RestComm Application "' + app.friendly_name + '" has been deleted.');
                    $location.path( "/applications" );
                },
                function() {
                    Notifications.error('Failed to delete application "' + app.friendly_name + '".');
                }
            );
        } else
        if ($scope.provider == 'external') {
            RCommApplications.delete({accountSid: app.account_sid, applicationSid:app.sid}, {},
               function() {
                    Notifications.success('RestComm Application "' + app.friendly_name + '" has been deleted.');
                    $location.path( "/applications" );
               },
               function() {
                   Notifications.error('Failed to delete application "' + app.friendly_name + '".');
               })
        }
      }
    });
};