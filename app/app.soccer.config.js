(function () {
    'use strict';

    angular
        .module('appVideoSuite.mdl')
        .config(interceptors);

    interceptors.$inject = ['$httpProvider'];
    function interceptors($httpProvider) {
        $httpProvider.interceptors.push("requestCounter.ftry");
        //$httpProvider.interceptors.push("loginRedirect.ftry");
        //$httpProvider.interceptors.push("addToken.ftry");
    }

    // webWorker service configuration. Used in lla-video-recorder directive.

    angular.module('appVideoSuite.mdl').constant("_webWorker", { worker: {} });

    angular.module('appVideoSuite.mdl').run(['appSettingsCnt', 'WorkerService', 'currentUser.ftry', '_webWorker',
        function (appSettingsCnt, WorkerService, currentUserFtry, _webWorker) {

            var array = document.URL.split("/");
            var baseAddress = array[0].concat('//', array[2]);
            var baseShared = baseAddress.concat(appSettingsCnt.sitePathShared);
            var angularURL = baseShared.concat('bower_components/angular/angular.min.js');
            WorkerService.setAngularUrl(angularURL);

            var resourceURL = baseShared.concat('bower_components/angular-resource/angular-resource.min.js');
            WorkerService.addDependency('$resource', 'ngResource', resourceURL);

            var webWorkersGeneralLibrariesURL = URL.createObjectURL(new Blob([
            'var serverAddress = \'' + baseAddress + appSettingsCnt.serverPathApi + '\' + \'api/WallApi/postVideoOfEvent/\';' +
            'var actions = {' +
                'post: {' +
                 '   method: \'POST\',' +
                 '   headers: { \'Authorization\': \'Bearer ' + currentUserFtry.profile.token + '\' },' +
                 '   isArray: false, ' +
                '}};'
            ], { type: 'application/javascript' }));

            WorkerService.addLibrary(webWorkersGeneralLibrariesURL);

            var loginInConsoleWithTimerURL = URL.createObjectURL(new Blob(['(function () {' +
            'var timeReference = Date.now();' +
            'function logTimed(param1, param2) {' +
                'console.log((Date.now() - timeReference) + \': \' + param1 + \': \' + param2);}' +
            'function dirTimed(param1, param2) {' +
                '    console.log((Date.now() - timeReference) + \': \' + param1 + \': \');' +
            '    console.dir(param2);}' +
            'console.log.timed = logTimed;' +
            'console.dir.timed = dirTimed;' +

            '})();'], { type: 'application/javascript' }));

            WorkerService.addLibrary(loginInConsoleWithTimerURL);
    }]);
})();